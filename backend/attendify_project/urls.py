"""
URL configuration for attendify_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
"""
from django.contrib import admin
# Add include, re_path and auth_views
from django.urls import path, include, re_path
from django.contrib.auth import views as auth_views
from events.views import EventCalendarView, TrackClickView, WidgetRenderView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # Nasze API

    # Publiczne endpointy dla widżetów, kalendarzy, śledzenia
    path('calendar/<uuid:public_id>/download.ics', EventCalendarView.as_view(), name='event-calendar-download'),
    path('track/<uuid:public_id>/<str:type>/', TrackClickView.as_view(), name='track-click'),
    path('widget/event/<uuid:public_id>/', WidgetRenderView.as_view(), name='widget-render'),

    # Usunięto standardowe URL-e Django do resetowania hasła,
    # ponieważ obsługa odbywa się teraz przez dedykowane endpointy API w api.urls
]
# Upewniono się, że błędne linie zostały usunięte.
