import uuid
from django.db import models
from django.conf import settings # Aby uzyskać dostęp do modelu User

def generate_unique_public_id():
    """Generuje unikalny, trudny do odgadnięcia publiczny ID."""
    # Używamy UUID4, ale można rozważyć inne metody, np. krótsze, bardziej przyjazne ID
    return str(uuid.uuid4())

class Event(models.Model):
    """
    Model reprezentujący wydarzenie (webinar) organizatora.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, # Usunięcie użytkownika usuwa jego wydarzenia
        related_name='events'     # Umożliwia dostęp do wydarzeń z obiektu użytkownika (user.events.all())
    )
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    start_datetime = models.DateTimeField(blank=False, null=False)
    end_datetime = models.DateTimeField(blank=False, null=False)
    webinar_url = models.URLField(max_length=2000, blank=True, null=True) # URL do samego webinaru

    # Publiczny ID używany w URL-ach widżetu, śledzenia itp.
    public_id = models.CharField(
        max_length=36, # UUID4 ma 36 znaków z myślnikami
        unique=True,
        default=generate_unique_public_id,
        editable=False, # Nie można edytować po utworzeniu
        db_index=True   # Indeks dla szybszego wyszukiwania
    )

    # Ustawienia personalizacji iframe nadpisujące domyślne ustawienia użytkownika
    # Używamy JSONField, który jest dostępny w Django >= 3.1
    # W MySQL/MariaDB będzie to typ LONGTEXT lub JSON (w zależności od wersji)
    customization_settings = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True) # Ustawiane automatycznie przy tworzeniu
    updated_at = models.DateTimeField(auto_now=True)     # Ustawiane automatycznie przy zapisie

    def __str__(self):
        return f"{self.title} (by {self.user.username})"

    class Meta:
        ordering = ['-start_datetime'] # Domyślne sortowanie - najnowsze wydarzenia pierwsze
