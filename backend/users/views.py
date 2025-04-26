from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated # Dodajemy IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView # Dodajemy APIView

from .models import UserSettings # Importujemy model
from .serializers import UserRegisterSerializer, UserSerializer, UserSettingsSerializer # Dodajemy UserSettingsSerializer

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
