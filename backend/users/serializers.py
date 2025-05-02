from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.core.mail import send_mail
from django.template import loader
import logging
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserSettings

logger = logging.getLogger(__name__)


class UserSettingsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = UserSettings
        fields = ['user', 'iframe_defaults', 'updated_at']
        read_only_fields = ['user', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Użytkownik o tym adresie email już istnieje.")]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    full_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'full_name')
        extra_kwargs = {
            'username': {'read_only': True},
            'full_name': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Hasła nie zgadzają się."})
        attrs['username'] = attrs['email']
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        full_name = validated_data.get('full_name', '')
        if full_name:
            parts = full_name.split(' ', 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
            else:
                user.last_name = ''
        user.save()
        return user


class CustomTokenObtainSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        logger.warning(f"CustomTokenObtainSerializer validating: email={email}")
        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                logger.warning(f"User with email {email} not found.")
                raise serializers.ValidationError('No active account found with the given credentials', code='authorization')
            if not user.is_active:
                logger.warning(f"User {email} is inactive.")
                raise serializers.ValidationError('User account is disabled.', code='authorization')
            if user.check_password(password):
                logger.warning(f"Password check successful for user {email}.")
                refresh = RefreshToken.for_user(user)
                data = {'refresh': str(refresh), 'access': str(refresh.access_token)}
                return data
            else:
                logger.warning(f"Password check failed for user {email}.")
                raise serializers.ValidationError('No active account found with the given credentials', code='authorization')
        else:
            logger.warning("Email or password not provided.")
            raise serializers.ValidationError('Must include "email" and "password".', code='authorization')


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            logger.warning(f"Password reset requested for non-existent email: {value}")
            pass
        return value

    def save(self, request):
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL', None),
            'email_template_name': 'registration/password_reset_email.html', # Dla wersji tekstowej
            'subject_template_name': 'registration/password_reset_subject.txt',
            'request': request,
            'html_email_template_name': 'registration/password_reset_email.html', # Jawnie wskazujemy szablon HTML
            # Usunięto 'domain_override' i 'html_email_template_name' - nie będziemy używać form.save() do wysyłki
        }
        form = PasswordResetForm(self.validated_data)
        logger.info(f"PasswordResetForm instantiated with data: {self.validated_data}")

        # Używamy formularza tylko do walidacji i znalezienia użytkownika
        if not form.is_valid():
            logger.error(f"PasswordResetForm is invalid for {self.validated_data.get('email')}: {form.errors}")
            # Zwracamy sukces, aby nie ujawniać, czy email istnieje
            return

        users = list(form.get_users(self.validated_data['email']))
        if not users:
             logger.warning(f"Password reset requested for email {self.validated_data['email']}, but no active user found (form valid but get_users empty).")
             # Zwracamy sukces, aby nie ujawniać, czy email istnieje
             return

        for user in users:
            # Ręczne generowanie tokenu i uid
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Ręczne budowanie URL frontendu
            frontend_base_url = 'http://localhost:3002/panel/reset-password-confirm' # Dostosuj dla produkcji
            reset_url = f"{frontend_base_url}/{uid}/{token}/"

            context = {
                'email': user.email,
                'frontend_reset_url_base': frontend_base_url, # Przekazujemy bazę, jeśli szablon jej potrzebuje
                'uid': uid,
                'token': token,
                'user': user,
                # Dodajemy zmienne, których może oczekiwać domyślny szablon (choć ich nie używamy w linku)
                'domain': request.get_host(), # Lub stała domena frontendu
                'site_name': request.get_host(), # Lub nazwa witryny
                'protocol': 'https' if request.is_secure() else 'http',
                # Nasz link - najważniejsza część
                'reset_url': reset_url # Ten URL jest poprawny i wskazuje na frontend
            }

            # Ręczne tworzenie treści e-maila zamiast renderowania szablonu
            try:
                subject = "Resetowanie hasła w Attendify" # Prosty temat
                
                # Prosta wersja tekstowa
                body = (
                    f"Otrzymaliśmy prośbę o zresetowanie hasła dla konta powiązanego z adresem {user.email} w serwisie Attendify.\n\n"
                    f"Aby ustawić nowe hasło, kliknij poniższy link lub skopiuj go i wklej w pasku adresu przeglądarki:\n\n"
                    f"{reset_url}\n\n"
                    f"Jeśli to nie Ty prosiłeś o reset hasła, zignoruj tę wiadomość.\n\n"
                    f"Dziękujemy,\nZespół Attendify"
                )

                # Prosta wersja HTML (opcjonalna, ale dobra praktyka)
                email_html_message = (
                    f"<p>Otrzymaliśmy prośbę o zresetowanie hasła dla konta powiązanego z adresem {user.email} w serwisie Attendify.</p>"
                    f"<p>Aby ustawić nowe hasło, kliknij poniższy link lub skopiuj go i wklej w pasku adresu przeglądarki:</p>"
                    f'<p><a href="{reset_url}">{reset_url}</a></p>'
                    f"<p>Jeśli to nie Ty prosiłeś o reset hasła, zignoruj tę wiadomość.</p>"
                    f"<p>Dziękujemy,<br>Zespół Attendify</p>"
                )

                logger.info(f"Manually generated reset URL for email body: {reset_url}")

                # Ręczne wysłanie (wydruk do konsoli) - upewniamy się, że przekazujemy poprawny link
                send_mail(
                    subject,
                    body,
                    opts.get('from_email'),
                    [user.email],
                    html_message=email_html_message,
                )
                logger.info(f"Password reset email manually sent (to console) for {user.email}")

            except Exception as e:
                 logger.error(f"Error during manual email generation/sending for {user.email}: {e}", exc_info=True)
                 # Celowo nie rzucamy wyjątku, aby nie ujawniać błędu na zewnątrz
                 # W produkcji można by tu dodać np. powiadomienie admina
                 pass


# Serializer for confirming password reset and setting new password
class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password1 = serializers.CharField(max_length=128, write_only=True)
    new_password2 = serializers.CharField(max_length=128, write_only=True)
    uid = serializers.CharField() # uidb64 encoded user ID
    token = serializers.CharField() # Password reset token

    set_password_form_class = SetPasswordForm # Use Django's form for validation

    def validate(self, attrs):
        self._errors = {}
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uid']))
            self.user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({'uid': ['Invalid value']})

        if not default_token_generator.check_token(self.user, attrs['token']):
            raise serializers.ValidationError({'token': ['Invalid value']})

        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)

        if attrs['new_password1'] != attrs['new_password2']:
             raise serializers.ValidationError({'new_password2': ["The two password fields didn't match."]})

        return attrs

    def save(self):
        # Save the new password
        self.set_password_form.save()
        logger.info(f"Password successfully reset for user {self.user.email}")
