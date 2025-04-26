from django.db import models
from django.conf import settings

# Domyślny model User jest już zaimportowany przez settings.AUTH_USER_MODEL

class UserSettings(models.Model):
    """
    Model przechowujący domyślne ustawienia personalizacji iframe dla użytkownika.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='settings', # Dostęp do ustawień przez user.settings
        primary_key=True # Użytkownik może mieć tylko jeden zestaw ustawień
    )
    # Domyślne ustawienia personalizacji iframe przechowywane jako JSON
    # np. {'primaryColor': '#007bff', 'showLogo': true, 'logoUrl': null}
    iframe_defaults = models.JSONField(blank=True, null=True, default=dict) # Domyślnie pusty słownik

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user.username}"

    class Meta:
        verbose_name = "User Settings"
        verbose_name_plural = "User Settings"
