from django.db import models
from django.utils import timezone
from YourbitAccounts.models import Account as User
from user_profile.models import Profile, Bit
from feed.models import Comment
from messenger.models import Message

# Create your models here.
class Notification(models.Model):
    #Notification type 1 = like, 2 = comment, 3 = follow, 4 = friend request received, 5 = friend request accepted, 6 = message, 7 = donation
    type = models.IntegerField()
    to_user = models.ForeignKey(Profile, related_name='notification_to', on_delete=models.CASCADE, null=True)
    from_user = models.ForeignKey(Profile, related_name='notification_from', on_delete=models.CASCADE, null=True)
    bit = models.ForeignKey(Bit, on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    time = models.DateTimeField(default=timezone.now)
    has_seen = models.BooleanField(default=False)