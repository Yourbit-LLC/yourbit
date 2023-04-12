from django.db import models
from YourbitAccounts.models import Account as User
from user_profile.models import Profile, Bit, Custom
from django.utils import timezone

# Create your models here.
class Comment(models.Model):
    body = models.CharField(max_length=1000, blank=True, default=None)
    time = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bit = models.ForeignKey(Bit, on_delete=models.CASCADE)
    custom = models.ForeignKey(Custom, on_delete=models.CASCADE, blank=True, null=True)

class Interaction(models.Model):
    from_user = models.ForeignKey(
        User, related_name="interacted", on_delete=models.DO_NOTHING, default=None
    )
    to_user = models.ForeignKey(
        User, related_name="interacted_with", on_delete=models.DO_NOTHING, default=None
    )

    time = models.DateTimeField(default=timezone.now)

#   Interaction history types:
#       
#       Profile
#       1 - communityView
#       2 - profileView
#       3 - followedUser
#       4 - addedFriend
#       
#       Bit
#       5 - bitView
#       6 - videoView
#       7 - like
#       8 - dislike
#       9 - positiveComment
#       10 - neutralComment
#       11 - negativeComment
#       12 - share
#       13 - Donated
#
#       Feed Control
#       13 - blockedUser
#       14 - unblockedUser
#       15 - mutedUser

    #Notify Class 1 = Rate, 2 = Comment, 3 = Activity
    action_class = models.IntegerField(default=0)

    action_sub_class = models.IntegerField(default=0)
    
    #If type in bit category
    bit = models.ForeignKey(
        Bit, related_name="bit_interacted_with", on_delete=models.CASCADE, default=None
    )

    #If type in video category
    #watch percent determined by percentage of video watched not time watched 
    watch_percent = models.FloatField(null=True)

    #Amount of time bit, or its contents, were visible on screen in milliseconds
    time_on_screen = models.IntegerField(null=True)


#Interaction history table indexes all Yourbit Interactions as they are created. Interactions
#are referenced in 3 places which allow for quicker queries and scope. 
class InteractionHistory(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    profile = models.OneToOneField(
        Profile, on_delete=models.DO_NOTHING, default=None, null=True, blank=True, related_name='interactions'
    )
    
    liked_bits = models.ManyToManyField(Bit, related_name="liked_bits", blank=True)
    disliked_bits = models.ManyToManyField(Bit, related_name="disliked_bits", blank=True)
    shared_bits = models.ManyToManyField(Bit, related_name='shared', blank=True)
    
    interacted_with = models.ManyToManyField(Bit, related_name='interacted_with', blank=True )
    commented_on = models.ManyToManyField(Bit, related_name='commented_on', blank=True)
    
    bit_donation = models.ManyToManyField(Bit, related_name = "bit_donations", blank = True)
    user_donation = models.ManyToManyField(User, related_name = "user_donations", blank=True)

    unfed_bits = models.ManyToManyField(Bit, related_name="unfed_bits", blank=True)
    unseen_bits = models.ManyToManyField(Bit, related_name="unseen_bits", blank=True)
    watched = models.ManyToManyField(Bit, related_name = "watched_bits", blank=True)
    seen_bits = models.ManyToManyField(Bit, related_name = "bits_seen", blank=True)

    saved_bits = models.ManyToManyField(Bit, related_name="saved_bits", blank=True)
