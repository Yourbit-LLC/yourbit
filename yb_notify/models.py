# Create your models here.
from django.db import models
from django.utils import timezone
from yb_accounts.models import Account as User
from yb_customize.models import CustomCore
from yb_bits.models import BitComment, Bit
from yb_messages.models import Message, OneToOneMessage

class NotificationCore(models.Model):
    profile = models.ForeignKey('yb_profile.Profile', on_delete=models.CASCADE, related_name='notification_profile')
    unseen_notifications = models.ManyToManyField('Notification', related_name='unseen_notifications', blank=True)
    seen_notifications = models.ManyToManyField('Notification', related_name='seen_notifications', blank=True)

# Create your models here.
class Notification(models.Model):

    #Notification type 1 = like, 2 = comment, 3 = follow, 4 = friend request received, 5 = friend request accepted, 6 = message, 7 = donation
    type = models.IntegerField()
    
    #User Details
    display_name = models.CharField(max_length=100, blank=True, null=True) #used for display name, user may set real name or username
    is_community = models.BooleanField(default=False)
    to_user = models.ForeignKey('yb_profile.Profile', related_name='notification_to', on_delete=models.CASCADE, null=True) #connected to profile so users personal information cannot be retrieved
    title = models.CharField(max_length=100, blank=True, null=True)
    body = models.CharField(max_length=300, blank=True, null=True)
    from_user = models.ForeignKey('yb_profile.Profile', related_name='notification_from_user', on_delete=models.CASCADE, null=True) #connected to profile so users personal information cannot be retrieved
    from_community = models.ForeignKey('yb_profile.CommunityProfile', related_name='notification_from_community', on_delete=models.CASCADE, blank=True, null=True)
    
    #Notification Details
    custom = models.ForeignKey(CustomCore, on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    time = models.DateTimeField(default=timezone.now)
    has_seen = models.BooleanField(default=False)

    #Bit Details
    bit = models.ForeignKey(Bit, on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    comment = models.ForeignKey(BitComment, on_delete=models.CASCADE, related_name='+', blank=True, null=True)

    #Message Details
    solo_conversation = models.ForeignKey('yb_messages.OneToOneConversation', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    group_conversation = models.ForeignKey('yb_messages.GroupConversation', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    message = models.ForeignKey(OneToOneMessage, on_delete=models.CASCADE, related_name='+', blank=True, null=True)





