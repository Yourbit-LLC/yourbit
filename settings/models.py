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
    show_reputation = models.BooleanField(default=True)
    enable_followers = models.BooleanField(default=False)
    search_by_name = models.BooleanField(default=True)
    real_name_visibility = models.CharField(max_length = 50, default='e')
    message_availability = models.CharField(max_length = 50, default='e')
    default_public = models.BooleanField(default=False)
    phone_number_visibility = models.CharField(max_length = 50, default='fr')
    birthday_visibility = models.CharField(max_length = 50, default='fr')
    email_visibility = models.CharField(max_length = 50, default='fr')
    enable_share = models.BooleanField(default=True)
    friends_of_friends = models.BooleanField(default=False)
    friend_count_visibility = models.CharField(max_length = 50, default='fr')
    follower_count_visibility = models.CharField(max_length = 50, default='e')

class FeedSettings(models.Model):

    #Parent settings object
    settings = models.OneToOneField('MySettings', related_name="feed", on_delete=models.CASCADE, null=True)
    
    #Connection Filters
    show_friends = models.BooleanField(default=True)
    show_following = models.BooleanField(default=True)
    show_communities = models.BooleanField(default=True)
    show_public = models.BooleanField(default=True)
    show_shared_bits = models.BooleanField(default=True)
    muted_users = models.ManyToManyField(User, blank=True, related_name='muted')

    #Content Filters
    smart_filters_on = models.BooleanField(default=False)
    political_suppression_on = models.BooleanField(default=False)
    news_suppression_on = models.BooleanField(default=False)
    foul_language_filter_on = models.BooleanField(default=False)
    keywords = models.CharField(max_length = 100, blank=True, default = '')
    show_links = models.BooleanField(default=True)
    
    #Sortation
    sorting = models.CharField(max_length= 100, default = 'time')

class NotificationSettings(models.Model):
    settings = models.OneToOneField('MySettings', related_name='notifications', on_delete=models.CASCADE, null=True)
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    email_frequency = models.CharField(max_length = 50, default='d')
    push_frequency = models.CharField(max_length = 50, default='d')