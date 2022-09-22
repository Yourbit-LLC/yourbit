from email.policy import default
from unittest.util import _MAX_LENGTH
from django.db import models
from django.db.models.signals import post_save
from django.utils import timezone
from django.dispatch import receiver
from django.forms import FileField

# from ImageKit.models import ImageSpecField
# from ImageKit.processors import ResizeToFill


#from PIL import Image


from YourbitAccounts.models import Account as User

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    follows = models.ManyToManyField(
        "self",
        related_name="followed_by",
        symmetrical=False,
        blank = True
    )
    connections = models.ManyToManyField(
        "self",
        related_name="friends_with",
        symmetrical=False,
        blank = True
    )

    custom = models.ManyToManyField('Customization', blank=True, related_name='custom')
    
    #User content
    conversations = models.ManyToManyField('Conversation', blank=True, related_name="conversations")
    clusters = models.ManyToManyField('Cluster', blank=True, related_name="clusters")
    gender = models.CharField(max_length = 100, blank=True)

    #Profile Images
    image_uploaded = models.BooleanField(default=False)
    image = models.ImageField(upload_to='media/', default="media/blenderlogo.png")
    background_image = models.ImageField(upload_to='media/', blank=True, default="media/aqua_default_theme.png")

    #bits
    bit_background = models.CharField(max_length=50, default = "#4b4b4b")
    title_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    feedback_icon_color = models.CharField(max_length=50, default="#ffffff")
    feedback_background_color = models.CharField(max_length=50, default="#313131")
    paragraph_align = models.CharField(max_length=10, default='left')

    #UI
    background_color = models.CharField(max_length=50, default="#323232")
    accent_color = models.CharField(max_length=50, default="#ffffff")
    user_bio = models.CharField(max_length = 500, blank=True)
    icon_color = models.CharField(max_length=50, default="#ffffff")

    #Quick Appearance Settings
    user_colors_on = models.BooleanField(default=True)
    wallpaper_on = models.BooleanField(default=True)
    default_theme_on = models.BooleanField(default=False)
    rewards_earned = models.IntegerField(default=0)
    share_points = models.IntegerField(default=0)
    point_balance = models.IntegerField(default=0)
    level = models.IntegerField(default=1)

    #Interaction History
    liked_bits = models.ManyToManyField('Bit', related_name="liked_bits", blank=True)
    disliked_bits = models.ManyToManyField('Bit', related_name="disliked_bits", blank=True)
    interacted_with = models.ManyToManyField('Bit', related_name='interacted_with', blank=True )
    commented_on = models.ManyToManyField('Bit', related_name='commented_on', blank=True)
    alerted_notifications = models.BooleanField(default=False)

    rewards_earned = models.IntegerField(default=0)
    share_points = models.IntegerField(default=0)
    point_balance = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    def __str__(self):
        return self.user.username

class Community(models.Model):
    admin = models.ForeignKey(User, related_name="community", on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=200)
    followers = models.ManyToManyField(
        "self",
        related_name="followed_by",
        symmetrical=False,
        blank = True
    )
    

class Feed(models.Model):
    profile = models.ForeignKey('Profile', related_name="feed", on_delete=models.DO_NOTHING, null=True)
    friends_only_on = models.BooleanField(default=False)
    block_links_on = models.BooleanField(default=False)
    muted_users = models.ManyToManyField(User, blank=True, related_name='muted')
    sorting = models.CharField(max_length= 100, default = 'chronological+')

class PrivacySettings(models.Model):
    user = models.ForeignKey(User, related_name='privacy', on_delete=models.DO_NOTHING, null=True)
    enable_followers = models.BooleanField(default=False)
    search_by_name = models.BooleanField(default=True)
    real_name_visibility = models.CharField(max_length = 50, default='Everyone')
    message_availability = models.CharField(max_length = 50, default='Friends Only')


class Bit(models.Model):
    user = models.ForeignKey(
        User, related_name="bits", on_delete=models.DO_NOTHING, default=None
    )
    title = models.CharField(max_length=140, blank=True)
    image = models.ImageField(blank = True, upload_to='media/')
    video = models.FileField(blank = True, upload_to = 'media/')
    body = models.CharField(max_length=5000)
    created_at = models.DateTimeField(default=timezone.now)
    bit_type = models.CharField(max_length=20, default="chat")
    likes = models.ManyToManyField(User, blank=True, related_name='likes')
    like_count = models.IntegerField(default=0)
    dislikes = models.ManyToManyField(User, blank=True, related_name='dislikes')
    dislike_count = models.IntegerField(default=0)
    notifications = models.ManyToManyField('Notification', blank = True, related_name = 'notifications')
    is_public = models.BooleanField(default=False)
    is_tips = models.BooleanField(default=False)
    comments = models.ManyToManyField('Comment', related_name="bit_comments", blank=True)
    comment_count = models.IntegerField(default=0)
    contains_video_link = models.BooleanField(default=False)
    contains_news_link = models.BooleanField(default=False)
    contains_web_link = models.BooleanField(default=False)
    extend_widget = models.CharField(max_length = 1000, blank=True)
    video_widget = models.CharField(max_length = 1000, blank=True)
    #customization = models.ManyToManyField("Customizations", related_name="custom", blank=True)

    def __str__(self):
        return (
            f"{self.user}"
            f"({self.created_at: %Y-%m-%d %H:%M}): "
            f"{self.body[:30]}..."
        )
class Comment(models.Model):
    comment = models.CharField(max_length=1000, blank=True, default=None)
    created_on = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bit = models.ForeignKey('Bit', on_delete=models.CASCADE)

class SearchHistory(models.Model):
    query = models.CharField(max_length = 200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Notification(models.Model):
    #Notification type 1 = like, 2 = comment, 3 = follow, 4 = friend request received, 5 = friend request accepted, 6 = message, 
    notification_type = models.IntegerField()
    to_user = models.ForeignKey('Profile', related_name='notification_to', on_delete=models.CASCADE, null=True)
    from_user = models.ForeignKey('Profile', related_name='notification_from', on_delete=models.CASCADE, null=True)
    bit = models.ForeignKey('Bit', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    date = models.DateTimeField(default=timezone.now)
    user_has_seen = models.BooleanField(default=False)

class Conversation(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    reciever = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")

class Message(models.Model):
    conversation = models.ForeignKey('Conversation', related_name="+", on_delete=models.CASCADE, blank=True, null=True)
    body = models.CharField(max_length = 1500)
    video = models.FileField(upload_to='media/message_attachments', blank=True)
    image = models.ImageField(upload_to='media/message_attachments', blank=True, null=True)
    document = models.FileField(upload_to='media/message_files')
    sender = models.ForeignKey(User, related_name='message_to', on_delete=models.CASCADE, null=True)
    receiver_user = models.ForeignKey(User, related_name='message_from', on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

class Cluster(models.Model):
    name = models.CharField(max_length=100)
    profile = models.ForeignKey('Profile', on_delete= models.CASCADE, related_name = 'cluster', null=True)
    bits = models.ManyToManyField('Bit', related_name = 'clustered_bit', blank=True)

class Customization(models.Model):

    #Profile Connections
    profile = models.OneToOneField('Profile', related_name='custom_profile', blank=True, on_delete=models.CASCADE)
    community = models.OneToOneField('Profile', related_name='custom_community', blank=True, on_delete=models.CASCADE)

    #Profile Images
    image_uploaded = models.BooleanField(default=False)
    image = models.ImageField(upload_to='media/', default="media/blenderlogo.png")
    background_image = models.ImageField(upload_to='media/', blank=True, default="media/aqua_default_theme.png")

    #bits
    bit_background = models.CharField(max_length=50, default = "#4b4b4b")
    title_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    feedback_icon_color = models.CharField(max_length=50, default="#000000")

    #UI
    background_color = models.CharField(max_length=50, default="#323232")
    accent_color = models.CharField(max_length=50, default="#ffffff")
    user_bio = models.CharField(max_length = 500, blank=True)
    icon_color = models.CharField(max_length=50, default="#ffffff")

    #Quick Appearance Settings
    user_colors_on = models.BooleanField(default=True)
    wallpaper_on = models.BooleanField(default=True)
    default_theme_on = models.BooleanField(default=False)

class Receipts(models.Model):
    user = models.ForeignKey(User, related_name = 'receipts', blank = True, on_delete=models.CASCADE)
    date_generated = models.DateTimeField(default = timezone.now)
    amount = models.FloatField(default=0.00)
    item = models.CharField(max_length=150, blank = True)
    