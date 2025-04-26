from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import UserSettings # Importujemy model UserSettings


class UserSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer do zarządzania domyślnymi ustawieniami personalizacji iframe użytkownika.
    """
    # Pole user jest tylko do odczytu, bo jest kluczem głównym i powiązane z zalogowanym użytkownikiem
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = UserSettings
        fields = ['user', 'iframe_defaults', 'updated_at']
        read_only_fields = ['user', 'updated_at'] # Tylko iframe_defaults można modyfikować


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer do zwracania podstawowych danych użytkownika (bez hasła).
    """
    class Meta:
        model = User
        # Pola, które chcemy zwracać w odpowiedzi API dla /auth/me
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class UserRegisterSerializer(serializers.ModelSerializer):
    # Używamy UniqueValidator, aby upewnić się, że email jest unikalny
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Użytkownik o tym adresie email już istnieje.")]
    )
    # Pole hasła jest tylko do zapisu (write_only) i wymagane
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    # Pole potwierdzenia hasła - tylko do zapisu i wymagane
    password2 = serializers.CharField(write_only=True, required=True)
    # Opcjonalne pole full_name
    full_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    class Meta:
        model = User
        # Pola, które będą używane przez serializer
        fields = ('username', 'password', 'password2', 'email', 'full_name')
        # Ustawiamy pola jako tylko do zapisu, oprócz username (które ustawimy na email)
        extra_kwargs = {
            'username': {'read_only': True}, # Username nie będzie podawane przez użytkownika
            'full_name': {'write_only': True} # full_name też tylko do zapisu na razie
        }

    def validate(self, attrs):
        # Sprawdzamy, czy hasła się zgadzają
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Hasła nie zgadzają się."})
        # Ustawiamy username na email (wymagane przez model User Django)
        attrs['username'] = attrs['email']
        return attrs

    def create(self, validated_data):
        # Tworzymy nowego użytkownika
        user = User.objects.create(
            username=validated_data['username'], # Ustawiamy username na email
            email=validated_data['email']
        )
        # Ustawiamy hasło (używamy set_password do hashowania)
        user.set_password(validated_data['password'])

        # Ustawiamy imię i nazwisko, jeśli podano
        full_name = validated_data.get('full_name', '')
        if full_name:
            # Proste rozdzielenie na imię i nazwisko (można ulepszyć)
            parts = full_name.split(' ', 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
            else:
                user.last_name = '' # Lub zostawić puste

        user.save()
        return user
