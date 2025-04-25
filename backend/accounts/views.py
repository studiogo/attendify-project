from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from .serializers import UserRegistrationSerializer, UserDetailSerializer

User = get_user_model()

class UserRegisterView(generics.CreateAPIView):
    """
    API view for user registration.
    Allows any user (authenticated or not) to create a new user account.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,) # Allow anyone to register
    serializer_class = UserRegistrationSerializer

class UserDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve details of the currently authenticated user.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,) # Only authenticated users
    serializer_class = UserDetailSerializer

    def get_object(self):
        # Return the currently authenticated user
        return self.request.user
