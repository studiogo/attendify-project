from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated # Dodajemy IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserSettings
# Dodajemy PasswordResetRequestSerializer i PasswordResetConfirmSerializer
from .serializers import (
    UserRegisterSerializer, UserSerializer, UserSettingsSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)

class RegisterView(generics.CreateAPIView):
    """
    Widok API do rejestracji nowych użytkowników.
    Dostępny dla wszystkich (AllowAny).
    Akceptuje żądania POST z danymi: email, password, password2, full_name (opcjonalnie).
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Każdy może się zarejestrować
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Walidacja danych, rzuca wyjątek jeśli niepoprawne
        user = serializer.save() # Zapisuje użytkownika (metoda create w serializerze)

        # Zwracamy odpowiedź sukcesu, można też zwrócić dane użytkownika (bez hasła)
        # lub pustą odpowiedź 201 Created.
        return Response(
            {
                "message": "Użytkownik zarejestrowany pomyślnie.",
                # Można dodać ID lub email użytkownika, jeśli potrzebne
                # "user": {
                #     "id": user.id,
                #     "email": user.email
                # }
            },
            status=status.HTTP_201_CREATED
        )

class CurrentUserView(APIView):
    """
    Widok API do pobierania danych aktualnie zalogowanego użytkownika.
    Wymaga uwierzytelnienia (ważnego tokenu JWT).
    """
    permission_classes = [IsAuthenticated] # Tylko zalogowani użytkownicy

    def get(self, request):
        serializer = UserSerializer(request.user) # Serializujemy obiekt request.user
        return Response(serializer.data)


class UserSettingsView(generics.RetrieveUpdateAPIView):
    """
    Widok API do pobierania i aktualizacji domyślnych ustawień personalizacji
    iframe dla zalogowanego użytkownika.
    Automatycznie tworzy obiekt UserSettings, jeśli jeszcze nie istnieje.
    """
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated] # Tylko zalogowani użytkownicy

    def get_object(self):
        # Pobieramy lub tworzymy obiekt UserSettings dla zalogowanego użytkownika
        # get_or_create zwraca krotkę (object, created_boolean)
        settings, created = UserSettings.objects.get_or_create(user=self.request.user)
        return settings

    # Metoda perform_update nie jest potrzebna, bo RetrieveUpdateAPIView
    # sam zapisze zmiany w obiekcie zwróconym przez get_object.


class PasswordResetRequestView(generics.GenericAPIView):
    """
    Widok API do inicjowania procesu resetowania hasła.
    Przyjmuje POST z adresem email.
    Wysyła email (do konsoli w trybie dev) z linkiem resetującym.
    """
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny] # Każdy może poprosić o reset

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Pass request directly to the save method
        serializer.save(request=request)
        # Zawsze zwracamy sukces, aby nie ujawniać, czy email istnieje
        return Response({"message": "Jeśli konto istnieje, wysłano link do resetowania hasła."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    """
    Widok API do potwierdzenia resetowania hasła i ustawienia nowego.
    Przyjmuje POST z uid, token, new_password1, new_password2.
    """
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny] # Link jest publiczny, ale chroniony tokenem

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save() # Metoda save serializera zapisze nowe hasło
        return Response({"message": "Hasło zostało pomyślnie zresetowane."}, status=status.HTTP_200_OK)
