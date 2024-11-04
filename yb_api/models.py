from django.db import models
from django.conf import settings
from rest_framework_api_key.models import APIKey
from yb_accounts.models import Account as User

class UserAPIKey(APIKey):
    profile = models.ForeignKey('yb_profile.Profile', on_delete=models.CASCADE, related_name="api_keys", null=True, blank=True)

class DeveloperPublicKey(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='developer_keys')
    public_key = models.TextField()
    key_id = models.CharField(max_length=50, unique=True)  # Unique identifier for each public key
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(null=True, blank=True)