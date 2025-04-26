from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView, # Opcjonalnie: do weryfikacji tokenu
)
# Importuj widoki z innych aplikacji API (np. users, events) w miarę ich tworzenia
from users.views import RegisterView, CurrentUserView # Dodajemy CurrentUserView

app_name = 'api'

urlpatterns = [
    # Ścieżki dla Simple JWT (logowanie, odświeżanie, weryfikacja)
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Logowanie - uzyskanie pary tokenów
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Odświeżenie tokenu dostępowego
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'), # Opcjonalnie: weryfikacja tokenu

    # Rejestracja użytkownika
    path('auth/register/', RegisterView.as_view(), name='register'),
    # Pobranie danych zalogowanego użytkownika
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),

    # Tutaj dodamy ścieżki dla innych endpointów API w przyszłości
    # np. path('events/', include('events.urls')),
]
