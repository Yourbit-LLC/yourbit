from django.db import models
from yb_accounts.models import Account as User
from django.utils import timezone

# Create your models here.
class UserEvent(models.Model):
    
    """
        Event Types: 
            0 = Logged In
            1 = Logged Out
            2 = Followed 
            3 = Gained Follower
            4 = Added Friend
            5 = Searched
            6 = Sent Message
            7 = Read Notification
            8 = Closed Notification
            9 = Changed Color
            10 = Updated Profile Photo
            11 = Updated Profile Background
            12 = Changed Account Settings
            13 = Changed Profile Settings
            14 = Changed Feed Settings
            15 = Changed Notification Settings
            16 = Changed Privacy Settings
            17 = Changed Password
            18 = Changed Email
            19 = Changed Username
            20 = Changed Name
            21 = Changed Bio
            22 = New Continuum 
            23 = New Bit   

    """    
    type = models.IntegerField(default=0)
    time = models.DateTimeField(default=timezone.now)
    modified = models.DateTimeField(default=timezone.now)
    
    class Meta:
        abstract = True

class UserLoginEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "log_in", on_delete=models.DO_NOTHING, blank=True)

class UserLogoutEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "log_out", on_delete=models.DO_NOTHING, blank=True)

class UserFollowEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "followed_user", on_delete=models.DO_NOTHING, blank=True)
    user_followed = models.ForeignKey(User, related_name = "user_followed", on_delete=models.DO_NOTHING, blank=True)

class UserGainFollowerEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "gained_follower", on_delete=models.DO_NOTHING, blank=True)
    user_gained_follower = models.ForeignKey(User, related_name = "follower_gained", on_delete=models.DO_NOTHING, blank=True)

class UserAddFriendEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "requested_friend", on_delete=models.DO_NOTHING, blank=True)
    user_added_friend = models.ForeignKey(User, related_name = "friend_requested", on_delete=models.DO_NOTHING, blank=True)

class UserSearchEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "performed_search", on_delete=models.DO_NOTHING, blank=True)
    query = models.ForeignKey('yb_search.SearchHistory', related_name = "user_searched", on_delete=models.DO_NOTHING, blank=True)

class UserSendMessageEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "sent_message", on_delete=models.DO_NOTHING, blank=True)
    to_user = models.ForeignKey(User, related_name = "message_sent_to", on_delete=models.DO_NOTHING, blank=True)

class UserReadNotificationEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "read_notification", on_delete=models.DO_NOTHING, blank=True)
    notification = models.ForeignKey('yb_notify.Notification', related_name = "notification_read", on_delete=models.DO_NOTHING, blank=True)

class UserCloseNotificationEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "closed_notification", on_delete=models.DO_NOTHING, blank=True)
    notification = models.ForeignKey('yb_notify.Notification', related_name = "notification_closed", on_delete=models.DO_NOTHING, blank=True)

class UserChangeColorEvent(UserEvent):
    color = models.CharField(max_length=200)
    element = models.CharField(max_length=200)

class UserUpdateProfilePhotoEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "updated_profile_photo", on_delete=models.DO_NOTHING, blank=True)
    photo = models.ForeignKey('yb_photo.Photo', related_name = "new_profile_photo", on_delete=models.DO_NOTHING, blank=True)

class UserUpdateProfileBackgroundEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "updated_background_photo", on_delete=models.DO_NOTHING, blank=True)
    photo = models.ForeignKey('yb_photo.Photo', related_name = "updated_background_to", on_delete=models.DO_NOTHING, blank=True)

class UserChangeAccountSettingsEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_account", on_delete=models.DO_NOTHING, blank=True)
    param = models.CharField(max_length=200)
    value = models.CharField(max_length=200)

class UserChangeProfileSettingsEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_profile", on_delete=models.DO_NOTHING, blank=True)
    param = models.CharField(max_length=200)
    value = models.CharField(max_length=200)

class UserChangeFeedSettingsEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_feed", on_delete=models.DO_NOTHING, blank=True)
    param = models.CharField(max_length=200)
    value = models.CharField(max_length=200)

class UserChangeNotificationSettingsEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_notification", on_delete=models.DO_NOTHING, blank=True)
    param = models.CharField(max_length=200)
    value = models.CharField(max_length=200)

class UserChangePrivacySettingsEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_privacy", on_delete=models.DO_NOTHING, blank=True)
    param = models.CharField(max_length=200)
    value = models.CharField(max_length=200)

class UserChangePasswordEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_password", on_delete=models.DO_NOTHING, blank=True)

class UserChangeEmailEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_email", on_delete=models.DO_NOTHING, blank=True)

class UserChangeUsernameEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_username", on_delete=models.DO_NOTHING, blank=True)
    username = models.CharField(max_length=200)

class UserChangeNameEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_name", on_delete=models.DO_NOTHING, blank=True)
    name = models.CharField(max_length=200)

class UserChangeBioEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "changed_bio", on_delete=models.DO_NOTHING, blank=True)
    bio = models.CharField(max_length=200)

class UserNewContinuumEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "created_continuum", on_delete=models.DO_NOTHING, blank=True)
    continuum = models.ForeignKey('yb_bits.Continuum', related_name = "created_continuum", on_delete=models.DO_NOTHING, blank=True)

class UserNewBitEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "created_bit", on_delete=models.DO_NOTHING, blank=True)
    bit = models.ForeignKey('yb_bits.Bit', related_name = "bit_created", on_delete=models.DO_NOTHING, blank=True)

class UserNewCommentEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "created_comment", on_delete=models.DO_NOTHING, blank=True)
    comment = models.ForeignKey('yb_bits.BitComment', related_name = "comment_created", on_delete=models.DO_NOTHING, blank=True)
    bit = models.ForeignKey('yb_bits.Bit', related_name = "comment_sent_to", on_delete=models.DO_NOTHING, blank=True)

class UserFeedbackEvent(UserEvent):
    user = models.ForeignKey(User, related_name = "sent_feedback", on_delete=models.DO_NOTHING, blank=True)
    like = models.ForeignKey('yb_bits.BitLike', related_name = "like_sent", on_delete=models.DO_NOTHING, blank=True)
    like = models.ForeignKey('yb_bits.BitDislike', related_name = "dislike_sent", on_delete=models.DO_NOTHING, blank=True)
    bit = models.ForeignKey('yb_bits.Bit', related_name = "like_sent_to", on_delete=models.DO_NOTHING, blank=True)
    
    #Like: 0=Like, 1=Dislike
    type = models.IntegerField(default=0)



class TaskManager(models.Model):
    #Task manager models keep track of the users session state for restoration on login

    user = models.OneToOneField(User, related_name = 'tasks', on_delete=models.CASCADE)
    
    #Current Task: 0=Home, 1=Comment, 2=Message, 3=Profile, 4=Video
    last_task = models.IntegerField(default = 0)
    last_url = models.CharField(max_length=500)
    last_location = models.CharField(max_length=500)
    
    is_tasks = models.BooleanField(default = False)
    home_task = models.BooleanField(default = False)
    comment_task = models.BooleanField(default = False)
    message_task = models.BooleanField(default = False)
    profile_task = models.BooleanField(default = False)
    video_task = models.BooleanField(default = False)
    
    last_video = models.ManyToManyField('yb_bits.Bit', related_name = 'last_video', blank=True)
    last_space = models.CharField(max_length = 10, blank=True)
    feed_filters = models.CharField(max_length = 30, default='-fr-fo-me-c-p', blank=True)
    recent_videos = models.ManyToManyField('yb_bits.Bit', related_name='video_recent', blank=True)
    recent_comment = models.ManyToManyField('yb_bits.Bit', related_name = 'comment_sections', blank=True)
    conversation = models.ManyToManyField('yb_messages.Conversation', related_name = 'recent_conversations', blank=True)
    recent_user_profile = models.ManyToManyField('yb_profile.Profile', related_name='recent_user_profiles', blank=True)
    recent_user_profile = models.ManyToManyField('yb_profile.Orbit', related_name='recent_community_profiles', blank=True)
