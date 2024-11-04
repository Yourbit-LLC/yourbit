from rest_framework.permissions import BasePermission
# from yb_api.models import UserAPIKey
from rest_framework.exceptions import AuthenticationFailed

class HasUserAPIKey(BasePermission):
    def has_permission(self, request, view):
        # Extract API key from the Authorization header
        api_key = request.headers.get("Authorization", "").replace("Api-Key ", "")
        
        if not api_key:
            raise AuthenticationFailed("API key missing")

        try:
            # Validate the API key and get the associated user
            user_api_key = UserAPIKey.objects.get_from_key(api_key)
            request.user = user_api_key.user  # Associate the user with the request
            return True
        except UserAPIKey.DoesNotExist:
            raise AuthenticationFailed("Invalid API key")