import profile
from django.db import models
from user_profile.models import Profile
from YourbitAccounts.models import Account as User

# Create your models here.
class MySettings(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    profile = models.OneToOneField(Profile, on_delete = models.CASCADE)

class PrivacySettings(models.Model):
    settings = models.OneToOneField('MySettings', related_name='privacy', on_delete=models.CASCADE, null=True)
    enable_followers = models.BooleanField(default=False)
    search_by_name = models.BooleanField(default=True)
    real_name_visibility = models.CharField(max_length = 50, default='Everyone')
    message_availability = models.CharField(max_length = 50, default='Friends Only')
    default_publish = models.CharField(max_length = 50, default = 'private')
    phone_number_is_visible = models.BooleanField(default=False)
    email_is_visible = models.BooleanField(default=False)

class FeedSettings(models.Model):
    settings = models.OneToOneField('MySettings', related_name="feed", on_delete=models.CASCADE, null=True)
    friends_only_on = models.BooleanField(default=False)
    block_links_on = models.BooleanField(default=False)
    muted_users = models.ManyToManyField(User, blank=True, related_name='muted')
    sorting = models.CharField(max_length= 100, default = 'chronological+')
