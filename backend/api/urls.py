from django.urls import path, include, re_path # Add re_path for Django's built-in views
from django.contrib.auth import views as auth_views # Import Django's auth views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from rest_framework import generics, status
from rest_framework.response import Response
import logging
from users.serializers import CustomTokenObtainSerializer
# Importuj widoki z innych aplikacji API (np. users, events) w miarę ich tworzenia
# Dodajemy import PasswordResetRequestView i PasswordResetConfirmView
from users.views import (
    RegisterView, CurrentUserView, UserSettingsView,
    PasswordResetRequestView, PasswordResetConfirmView
)

logger = logging.getLogger(__name__)

# Widok używający nowego, całkowicie niestandardowego serializera
class CustomTokenObtainView(generics.GenericAPIView): # Zmieniamy nazwę dla jasności
    serializer_class = CustomTokenObtainSerializer # Używamy nowego serializera
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        logger.warning(f"--- CustomTokenObtainView POST --- Request data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            logger.warning(f"--- CustomTokenObtainView POST --- Serializer validated successfully.")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"--- CustomTokenObtainView POST --- Serializer validation failed: {e}", exc_info=True)
            error_detail = getattr(e, 'detail', {"detail": "Authentication failed"}) # Bardziej ogólny błąd
            return Response(error_detail, status=status.HTTP_401_UNAUTHORIZED) # Zwracamy 401 Unauthorized

# app_name = 'api' # Tymczasowo usuwamy przestrzeń nazw, aby sprawdzić, czy to rozwiąże NoReverseMatch

urlpatterns = [
    # Ścieżki dla Simple JWT (logowanie, odświeżanie, weryfikacja)
    # Używamy nowego, niestandardowego widoku do logowania przez email
    path('auth/token/', CustomTokenObtainView.as_view(), name='token_obtain_pair'), # Zmieniamy widok
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Rejestracja użytkownika
    path('auth/register/', RegisterView.as_view(), name='register'),
    # Pobranie danych zalogowanego użytkownika
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),

    # Ścieżki dla modułu Events
    path('events/', include('events.urls')),

    # Ścieżka dla ustawień użytkownika (personalizacja iframe)
    path('settings/iframe/', UserSettingsView.as_view(), name='user-settings'),

    # Tutaj dodamy ścieżki dla innych endpointów API w przyszłości

    # Password Reset URLs (using Django's built-in views for logic)
    # We need to wrap them slightly or provide templates if needed,
    # but for API usage, we might create custom views/serializers later.
    # For now, let's include the standard URLs under our API path.
    # Note: Confirm, Done, Complete views are moved to the main urls.py
    path('auth/password/reset/', PasswordResetRequestView.as_view(), name='password_reset_request_api'),
    # Endpoint API do ustawienia nowego hasła (przyjmuje POST z uid, token, hasłami w ciele)
    path('auth/password/set-new/', PasswordResetConfirmView.as_view(), name='password_set_new_api'),
    # Wzorzec wymagany przez Django PasswordResetForm (nawet jeśli go nie używamy bezpośrednio w linku)
    # Można go powiązać z widokiem zwracającym pustą odpowiedź lub zostawić jak jest,
    # jeśli nie powoduje problemów. Na razie zostawiamy z PasswordResetConfirmView.
    path('auth/password/reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
