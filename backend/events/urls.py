from django.urls import path
from .views import EventListCreateView, EventDetailView

app_name = 'events'

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list-create'), # /api/events/
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'), # /api/events/{eventId}/
]
