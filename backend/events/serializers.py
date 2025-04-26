from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer do tworzenia, aktualizacji i pobierania danych wydarzeń.
    """
    # Pole user jest tylko do odczytu, bo ustawiamy je automatycznie na podstawie zalogowanego użytkownika
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    # public_id jest tylko do odczytu, generowany automatycznie
    public_id = serializers.CharField(read_only=True)

    class Meta:
        model = Event
        # Pola, które będą obsługiwane przez serializer
        fields = [
            'id',
            'user', # ID użytkownika, który stworzył wydarzenie
            'title',
            'description',
            'start_datetime',
            'end_datetime',
            'webinar_url',
            'public_id', # Publiczny identyfikator
            'customization_settings', # Ustawienia personalizacji
            'created_at',
            'updated_at',
        ]
        # Pola tylko do odczytu (nie można ich ustawić przy tworzeniu/aktualizacji przez API)
        read_only_fields = ['id', 'user', 'public_id', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Dodatkowa walidacja danych.
        """
        # Sprawdzenie, czy data końcowa jest późniejsza niż początkowa
        if 'start_datetime' in data and 'end_datetime' in data:
            if data['end_datetime'] <= data['start_datetime']:
                raise serializers.ValidationError("Data zakończenia musi być późniejsza niż data rozpoczęcia.")
        # Można dodać inne walidacje w przyszłości
        return data

    # Metoda create nie jest potrzebna, jeśli nie robimy nic specjalnego
    # - ModelSerializer sam obsłuży tworzenie obiektu.
    # Podobnie z metodą update.

    # W metodzie create (jeśli byśmy ją nadpisywali) trzeba by ustawić pole user:
    # def create(self, validated_data):
    #     validated_data['user'] = self.context['request'].user
    #     return super().create(validated_data)
