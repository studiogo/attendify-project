from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly # Domyślne uprawnienia DRF

from .models import Event
from .serializers import EventSerializer
from .permissions import IsOwnerOrReadOnly # Nasze niestandardowe uprawnienie

class EventListCreateView(generics.ListCreateAPIView):
    """
    Widok API do listowania wydarzeń zalogowanego użytkownika oraz tworzenia nowych wydarzeń.
    - GET: Zwraca listę wydarzeń należących do zalogowanego użytkownika.
    - POST: Tworzy nowe wydarzenie dla zalogowanego użytkownika.
    """
    serializer_class = EventSerializer
    # Uprawnienia: Tylko zalogowani użytkownicy mogą tworzyć (POST),
    # listowanie (GET) jest domyślnie dozwolone przez IsAuthenticatedOrReadOnly,
    # ale queryset filtruje tylko wydarzenia zalogowanego użytkownika.
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Zwraca tylko wydarzenia należące do aktualnie zalogowanego użytkownika.
        Dla niezalogowanych użytkowników (jeśli permission_classes by na to pozwalały),
        zwróciłoby pusty queryset.
        """
        user = self.request.user
        if user.is_authenticated:
            return Event.objects.filter(user=user)
        return Event.objects.none() # Zwróć pusty queryset dla niezalogowanych

    def perform_create(self, serializer):
        """
        Automatycznie ustawia pole 'user' na zalogowanego użytkownika podczas tworzenia wydarzenia.
        """
        serializer.save(user=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Widok API do pobierania, aktualizacji i usuwania pojedynczego wydarzenia.
    - GET: Zwraca szczegóły wydarzenia.
    - PUT/PATCH: Aktualizuje wydarzenie.
    - DELETE: Usuwa wydarzenie.
    """
    queryset = Event.objects.all() # Pobieramy wszystkie, uprawnienia załatwią resztę
    serializer_class = EventSerializer
    # Uprawnienia: Odczyt dozwolony dla wszystkich (IsAuthenticatedOrReadOnly),
    # ale zapis/usuwanie tylko dla właściciela (IsOwnerOrReadOnly).
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    # Domyślnie DRF używa 'pk' jako klucza w URL, co jest OK.
    # lookup_field = 'pk'
