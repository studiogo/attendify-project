from django.urls import path
from .views import EventListCreateView, EventDetailView, EventStatsView # Dodajemy EventStatsView

app_name = 'events'

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list-create'), # GET /api/events/, POST /api/events/
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'), # GET /api/events/{id}/, PUT/PATCH /api/events/{id}/, DELETE /api/events/{id}/
    path('<int:pk>/stats/', EventStatsView.as_view(), name='event-stats'), # GET /api/events/{id}/stats/
]
