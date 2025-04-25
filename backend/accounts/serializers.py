from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8 # Enforce a minimum password length
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label=_("Confirm Password")
    )

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 'password_confirm')
        extra_kwargs = {
            'full_name': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": _("Password fields didn't match.")})
        # Add more password validation if needed (e.g., complexity)
        # from django.contrib.auth.password_validation import validate_password
        # try:
        #     validate_password(attrs['password'], self.instance)
        # except serializers.ValidationError as e:
        #     raise serializers.ValidationError({'password': list(e.messages)})

        return attrs

    def create(self, validated_data):
        # Remove password_confirm as it's not part of the User model
        validated_data.pop('password_confirm')
        # Use the custom manager's create_user method which handles password hashing
        user = User.objects.create_user(**validated_data)
        return user

class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer for retrieving user details (read-only)."""
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'date_joined', 'is_active', 'is_staff')
        read_only_fields = fields # Make all fields read-only
