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
    public_id = models.UUIDField(
        default=uuid.uuid4, # Używamy bezpośrednio uuid.uuid4
        unique=True,
        editable=False,
        db_index=True
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


class WidgetInteraction(models.Model):
    """
    Model rejestrujący interakcję (kliknięcie) użytkownika z widżetem wydarzenia.
    """
    # Typy interakcji - można rozszerzyć w przyszłości
    INTERACTION_TYPES = (
        ('google', 'Google Calendar Click'),
        ('ics', 'ICS Download Click'),
        ('outlook', 'Outlook Calendar Click'), # Możemy śledzić to jako oddzielny typ, jeśli link będzie inny niż .ics
        # ('widget_load', 'Widget Load'), # Można rozważyć śledzenie załadowań widżetu
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE, # Usunięcie wydarzenia usuwa jego interakcje
        related_name='interactions' # Dostęp do interakcji z obiektu wydarzenia (event.interactions.all())
    )
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES, db_index=True)

    # Dane potencjalnie wrażliwe - uwaga na GDPR!
    # Domyślnie ustawiamy je jako null=True, blank=True
    ip_address = models.GenericIPAddressField(null=True, blank=True, db_index=True) # Indeks dla potencjalnych analiz geolokalizacyjnych
    user_agent = models.TextField(null=True, blank=True)

    clicked_at = models.DateTimeField(auto_now_add=True, db_index=True) # Czas kliknięcia, indeks dla sortowania/filtrowania

    def __str__(self):
        return f"{self.interaction_type} for Event {self.event_id} at {self.clicked_at}"

    class Meta:
        ordering = ['-clicked_at'] # Najnowsze interakcje pierwsze
        indexes = [
            models.Index(fields=['event', 'clicked_at']), # Indeks złożony dla szybszego pobierania interakcji dla danego wydarzenia
            models.Index(fields=['event', 'interaction_type']), # Indeks dla filtrowania wg typu interakcji
        ]
