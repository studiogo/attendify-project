"""
URL configuration for attendify_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include # Dodajemy include
from events.views import EventCalendarView, TrackClickView, WidgetRenderView # Importujemy widoki kalendarza, śledzenia i renderowania widżetu

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # Kierujemy ścieżkę /api/ do api.urls

    # Publiczny endpoint do pobierania pliku .ics
    path('calendar/<uuid:public_id>/download.ics', EventCalendarView.as_view(), name='event-calendar-download'), # Używamy uuid dla public_id

    # Publiczny endpoint do śledzenia kliknięć
    path('track/<uuid:public_id>/<str:type>/', TrackClickView.as_view(), name='track-click'), # Używamy uuid dla public_id

    # Publiczny endpoint do renderowania widżetu iframe
    path('widget/event/<uuid:public_id>/', WidgetRenderView.as_view(), name='widget-render'), # Używamy uuid dla public_id
]
