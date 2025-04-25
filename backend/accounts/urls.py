from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('me/', views.UserDetailView.as_view(), name='me'), # Endpoint to get current user details
]
