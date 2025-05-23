from django.db import models
from yb_accounts.models import Account as User
from yb_profile.models import Profile

# Create your models here.
class MySettings(models.Model):
    profile = models.OneToOneField(Profile, on_delete = models.CASCADE, blank=True, null=True)

class PrivacySettings(models.Model):
    settings = models.ForeignKey(MySettings, related_name='privacy', on_delete=models.CASCADE, null=True)
    show_reputation = models.BooleanField(default=True)
    enable_followers = models.BooleanField(default=False)
    searchable = models.BooleanField(default=True)
    real_name_visibility = models.BooleanField(default=True)
    display_name = models.CharField(max_length = 50, default='')
    message_availability = models.CharField(max_length = 50, default='e')
    comment_visibility = models.CharField(max_length = 50, default='e')
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
    settings = models.ForeignKey(MySettings, related_name="feed", on_delete=models.CASCADE, null=True)
    
    #Connection Filters
    show_friends = models.BooleanField(default=True)
    show_following = models.BooleanField(default=True)
    show_communities = models.BooleanField(default=True)
    show_my_bits = models.BooleanField(default=True)
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
    sort_by = models.CharField(max_length= 100, default = '-time')

    #Defualt Space
    default_space = models.CharField(max_length= 100, default = 'auto')
    current_space = models.CharField(max_length= 100, default = 'global')

class NotificationSettings(models.Model):
    settings = models.ForeignKey(MySettings, related_name='notifications', on_delete=models.CASCADE, null=True)

    notifications_enabled = models.BooleanField(default=True)

    app_notifications = models.BooleanField(default=True)
    store_notifications = models.BooleanField(default=True)

    #New Post Notifications
    bit_notifications = models.BooleanField(default=True)
    bits_from_friends = models.BooleanField(default=True)
    bits_from_following = models.BooleanField(default=True)
    bits_from_communities = models.BooleanField(default=True)
    bits_batched_notifications = models.BooleanField(default=True)
    bits_batched_notification_interval = models.IntegerField(default=1)

    new_bits_from =  models.ManyToManyField(Profile, blank=True, related_name='custom_list')

    bit_likes = models.BooleanField(default=True)
    bit_likes_from = models.CharField(max_length=100, default='e')
    bit_comments = models.BooleanField(default=True)
    bit_comments_from = models.CharField(max_length=100, default='e')
    bit_mentions = models.BooleanField(default=True)
    bit_shares = models.BooleanField(default=True)
    bit_shares_from = models.CharField(max_length=100, default='e')
    bit_donations = models.BooleanField(default=True)
    
    #Batching Bit Notifications
    batched_bit_notifications = models.BooleanField(default=False)
    batched_bit_interval = models.IntegerField(default=1)

    #Comment Notifications 
    my_bit_comments = models.BooleanField(default=True) #Notify when other users comment on a users posted bit
    my_comment_replies = models.BooleanField(default=True) #Notify when other users reply to a users comment
    bits_commented_on = models.BooleanField(default=True) #Notify when a bit a user has commented on is commented on by another user

    #High Profile Management
    follow_notifications = models.BooleanField(default=True)
    friend_request_notifications = models.BooleanField(default=True)
    messages_from = models.CharField(max_length=100, default='e')
    