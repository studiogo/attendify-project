from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils import timezone
from django.db.models import Count
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render # Dodajemy render
from django.urls import reverse
from django.utils import timezone
from django.utils.http import urlencode # Do budowania URL-i Google Calendar
from django.views import View # Importujemy generyczny View
from rest_framework import generics, views, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated # Dodajemy IsAuthenticated
from rest_framework.response import Response # Dodajemy Response
from ics import Calendar, Event as ICSEvent # Importujemy bibliotekę ics

from .models import Event, WidgetInteraction # Dodajemy WidgetInteraction
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


class EventCalendarView(views.APIView):
    """
    Widok API do generowania i pobierania pliku .ics dla wydarzenia.
    Dostępny publicznie na podstawie public_id wydarzenia.
    """
    permission_classes = [AllowAny] # Dostępny publicznie

    def get(self, request, public_id, format=None):
        # Pobieramy wydarzenie na podstawie public_id
        event = get_object_or_404(Event, public_id=public_id)

        # Tworzymy obiekt kalendarza i wydarzenia z biblioteki ics
        c = Calendar()
        e = ICSEvent()

        e.name = event.title
        e.begin = event.start_datetime
        e.end = event.end_datetime
        if event.description:
            e.description = event.description
        # Można dodać lokalizację, jeśli mielibyśmy takie pole w modelu
        # e.location = event.location
        if event.webinar_url:
             # Dodajemy URL webinaru do opisu, bo nie ma dedykowanego pola w standardzie iCalendar
             e.description = f"{e.description or ''}\n\nLink do webinaru: {event.webinar_url}".strip()

        # Dodajemy wydarzenie do kalendarza
        c.events.add(e)

        # Przygotowujemy odpowiedź HTTP z plikiem .ics
        response = HttpResponse(str(c), content_type='text/calendar')
        # Ustawiamy nagłówek Content-Disposition, aby przeglądarka zaproponowała pobranie pliku
        # Używamy prostego slugify tytułu dla nazwy pliku
        filename = "".join(c if c.isalnum() else "_" for c in event.title) + ".ics"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class TrackClickView(views.APIView):
    """
    Widok publiczny do śledzenia kliknięć w widżecie i przekierowania do celu.
    URL: /track/{public_id}/{type}/
    """
    permission_classes = [AllowAny]

    def get_client_ip(self, request):
        """Pomocnicza funkcja do pobierania adresu IP klienta."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get(self, request, public_id, type, format=None):
        event = get_object_or_404(Event, public_id=public_id)

        # Sprawdzenie, czy typ jest poprawny (zdefiniowany w modelu)
        valid_types = [t[0] for t in WidgetInteraction.INTERACTION_TYPES]
        if type not in valid_types:
            raise Http404("Invalid interaction type")

        # Zapis interakcji (uwaga na GDPR - IP i User Agent)
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        WidgetInteraction.objects.create(
            event=event,
            interaction_type=type,
            ip_address=ip_address, # Rozważyć nie zapisywanie lub anonimizację
            user_agent=user_agent   # Rozważyć nie zapisywanie lub anonimizację
        )

        # Przygotowanie URL docelowego
        target_url = None
        if type == 'google':
            # Format daty dla Google Calendar: YYYYMMDDTHHMMSSZ
            start_utc = event.start_datetime.astimezone(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
            end_utc = event.end_datetime.astimezone(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
            params = {
                'action': 'TEMPLATE',
                'text': event.title,
                'dates': f'{start_utc}/{end_utc}',
                'details': event.description or '',
                # 'location': event.location or '', # Jeśli dodamy lokalizację
                'trp': 'false', # Show as busy
            }
            # Dodajemy URL webinaru do opisu, jeśli istnieje
            if event.webinar_url:
                params['details'] += f"\n\nLink do webinaru: {event.webinar_url}"

            target_url = f"https://www.google.com/calendar/render?{urlencode(params)}"

        elif type == 'ics' or type == 'outlook': # Na razie traktujemy Outlook tak samo jak ICS
            # Generujemy URL do pobrania pliku .ics
            target_url = request.build_absolute_uri(
                reverse('event-calendar-download', kwargs={'public_id': public_id})
            )

        if target_url:
            # Przekierowanie do celu
            return HttpResponseRedirect(target_url)
        else:
            # Jeśli z jakiegoś powodu nie ma URL docelowego (np. nieznany typ)
            raise Http404("Could not determine target URL")


class EventStatsView(views.APIView):
    """
    Widok API do pobierania statystyk interakcji dla danego wydarzenia.
    Dostępny tylko dla właściciela wydarzenia.
    """
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly] # Wymaga zalogowania i bycia właścicielem

    def get_object(self, pk):
        """Pomocnicza metoda do pobierania obiektu Event."""
        try:
            return Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        event = self.get_object(pk)
        # Sprawdzamy uprawnienia do obiektu (IsOwnerOrReadOnly)
        self.check_object_permissions(request, event)

        # Pobieramy interakcje dla tego wydarzenia
        interactions = event.interactions.all()

        # Liczymy interakcje
        total_clicks = interactions.count()
        clicks_by_type = interactions.values('interaction_type').annotate(count=Count('id')).order_by('-count')

        # Przygotowujemy dane do odpowiedzi
        # Można dodać bardziej zaawansowane statystyki, np. timeline
        stats_data = {
            "event_id": event.id,
            "event_title": event.title,
            "total_clicks": total_clicks,
            "clicks_by_type": {item['interaction_type']: item['count'] for item in clicks_by_type},
            # "clicks_timeline": [...] # TODO: Dodać agregację czasową, jeśli potrzebne
        }

        return Response(stats_data, status=status.HTTP_200_OK)


class WidgetRenderView(View):
    """
    Widok publiczny renderujący HTML widżetu dla danego wydarzenia.
    URL: /widget/event/{public_id}/
    """
    # Nie używamy permission_classes, bo to standardowy widok Django, nie DRF

    def get(self, request, public_id, *args, **kwargs):
        event = get_object_or_404(Event, public_id=public_id)

        # Pobieramy ustawienia personalizacji
        # Najpierw sprawdzamy ustawienia specyficzne dla wydarzenia
        customization = event.customization_settings or {}
        # Jeśli brakuje ustawień w wydarzeniu, próbujemy pobrać domyślne użytkownika
        if not customization:
            try:
                user_settings = event.user.settings # Zakładamy, że UserSettings istnieje (można dodać obsługę błędu)
                customization = user_settings.iframe_defaults or {}
            except AttributeError: # Jeśli user.settings nie istnieje
                customization = {}

        # Generujemy URL-e do śledzenia kliknięć
        track_urls = {
            'google': request.build_absolute_uri(reverse('track-click', kwargs={'public_id': public_id, 'type': 'google'})),
            'ics': request.build_absolute_uri(reverse('track-click', kwargs={'public_id': public_id, 'type': 'ics'})),
            'outlook': request.build_absolute_uri(reverse('track-click', kwargs={'public_id': public_id, 'type': 'outlook'})),
        }

        context = {
            'event': event,
            'customization': customization,
            'track_urls': track_urls,
        }

        # Renderujemy szablon
        # Upewnijmy się, że Django wie, gdzie szukać szablonów aplikacji 'events'
        # (powinno działać domyślnie, jeśli 'APP_DIRS': True w settings.py)
        return render(request, 'events/widget.html', context)
