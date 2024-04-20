from django.db import models
from yb_profile.models import Profile as Profile
from yb_accounts.models import Account as User
from django.utils import timezone
from yb_customize.models import CustomBit
from django.contrib.postgres.fields import ArrayField



# Create your models here.

class BitStream(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    video_bits = models.ManyToManyField('Bit', related_name='all_bits', blank=True)
    chat_bits = models.ManyToManyField('Bit', related_name='chat_bits', blank=True)
    photo_bits = models.ManyToManyField('Bit', related_name='photo_bits', blank=True)
    unseen_bits = models.ManyToManyField('Bit', related_name='bit_stream', blank=True)
    seen_bits = models.ManyToManyField('Bit', related_name='seen_bits', blank=True)

class Bit(models.Model):

    #Model for a Bit: A post on Yourbit
    profile = models.ForeignKey(
        'yb_profile.Profile', related_name="bits", on_delete=models.CASCADE, default=None
    )

    user = models.ForeignKey(
        User, related_name="bits", on_delete=models.CASCADE, default=None
    )
    to_users = models.ManyToManyField(
        User,  blank=True, related_name='mentioned'
    )
    
    display_name = models.CharField(max_length=100, blank=True, null=True) #used for display name, user may set real name or username
    title = models.CharField(max_length=140, blank=True)

    body = models.CharField(max_length=5000, blank=True)
    
    time = models.DateTimeField(default=timezone.localtime)
    evaporate = models.BooleanField(default=False)
    evapoation_date = models.DateTimeField(default=timezone.localtime)
    
    type = models.CharField(max_length=20, default="chat")

    dislikes = models.ManyToManyField('BitDislike', blank=True, related_name='dislikes', null=True)
    likes = models.ManyToManyField('BitLike', blank=True, related_name='likes', null=True)
    shares = models.ManyToManyField('BitShare', blank=True, related_name='shares', null=True)
    comments = models.ManyToManyField('BitComment', blank=True, related_name='comments', null=True)

    #View Counts track the total amount of times a bit has been within the viewport for longer than 1.5s
    view_count = models.IntegerField(default = 0)

    #New Views track the amount of non-repeat views of this bit
    new_views = models.IntegerField(default=0)

    #Options booleans
    is_public = models.BooleanField(default=False)
    is_tips = models.BooleanField(default=False)
    is_title =models.CharField(max_length=10, default='none')

    #Links and widgets
    contains_video_link = models.BooleanField(default=False)
    contains_news_link = models.BooleanField(default=False)
    contains_web_link = models.BooleanField(default=False)
    extend_widget = models.CharField(max_length = 1000, blank=True)
    video_widget = models.CharField(max_length = 1000, blank=True)
    custom = models.ForeignKey(CustomBit, on_delete=models.CASCADE, default=None, related_name="user_custom")
    tags = models.CharField(max_length=1000, blank=True)
    slug = models.SlugField(max_length=140, blank=True)
    
    photos = models.ManyToManyField('yb_photo.Photo', related_name='photos', blank=True)

    #If type in video category
    #watch percent determined by percentage of video watched not time watched 
    average_watch_percent = models.FloatField(null=True)
    
    #Watch count tracks the amount of times a video bit has been watched for at least 80% length
    watch_count = models.IntegerField(default = 0)
    
    #New watches tracks the amount of non-repeat watches of this Video Bit
    new_watches = models.IntegerField(default = 0)

    video_upload = models.OneToOneField('yb_video.Video', related_name='video_upload', blank=True, on_delete=models.CASCADE, null=True)

    video_key = models.CharField(max_length=100, blank=True)

    
    #Amount of time bit, or its contents, were visible on screen in milliseconds
    average_time_on_screen = models.IntegerField(null=True)

    def __str__(self):
        return (
            f"{self.user}"
            f"({self.time: %Y-%m-%d %H:%M}): "
            f"{self.body[:30]}..."
        )
    
class Continuum(models.Model):

    title = models.CharField(max_length=100, default="Untitled Continuum")
    bits = models.ManyToManyField(Bit, related_name = "continuum", blank=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(default=timezone.now)
    subscribers = models.ManyToManyField(User, related_name = "subscribed_users", blank=True)

class BitSticker(models.Model):
    #Model for sticker placement on a bit
    bit = models.ForeignKey(Bit, related_name = "bit_sticker", on_delete=models.CASCADE, blank=True)
    sticker = models.CharField(max_length=50, default="")
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    width = models.IntegerField(default=0)
    height = models.IntegerField(default=0)
    rotation = models.IntegerField(default=0)
    z_index = models.IntegerField(default=0)
    animation = models.CharField(max_length=100, default="static")
    loop_animation = models.BooleanField(default=False)
    animation_delay = models.IntegerField(default=0)
    animation_duration = models.IntegerField(default=0)
    
    time = models.DateTimeField(default=timezone.now)

class Cluster(models.Model):
    name = models.CharField(max_length=100)
    profile = models.ForeignKey('yb_profile.Profile', on_delete= models.CASCADE, related_name = 'cluster', null=True)
    type = models.CharField(max_length=100, default="all")
    bits = models.ManyToManyField('yb_bits.Bit', related_name = 'clustered_bit', blank=True)
    custom = models.ForeignKey('yb_customize.CustomUI', on_delete=models.CASCADE, related_name='cluster', null=True)
    bit_count = models.IntegerField(default=0)
    is_public = models.BooleanField


class BitComment(models.Model):
    #Model for a comment on a bit
    bit = models.ForeignKey(Bit, related_name = "bit_comments", on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, related_name = "comments", on_delete=models.CASCADE, blank=True)
    body = models.CharField(max_length=5000)
    time = models.DateTimeField(default=timezone.localtime)

class BitLike(models.Model):
    #Model for a like on a bit
    bit = models.ForeignKey(Bit, related_name = "bit_likes", on_delete=models.CASCADE, blank=True)
    user = models.ForeignKey(User, related_name = "bit_likes", on_delete=models.CASCADE, blank=True)
    time = models.DateTimeField(default=timezone.now)

class BitDislike(models.Model):
    #Model for a dislike on a bit
    bit = models.ForeignKey(Bit, related_name = "bit_dislikes", on_delete=models.CASCADE, blank=True)
    user = models.ForeignKey(User, related_name = "bit_dislikes", on_delete=models.CASCADE, blank=True)
    time = models.DateTimeField(default=timezone.now)

class BitShare(models.Model):
    #Model for a share on a bit
    
    user = models.ForeignKey(User, related_name = "bit_shares", on_delete=models.CASCADE, blank=True)
    time = models.DateTimeField(default=timezone.now)

class BitView(models.Model):
    #Model for a view on a bit
    bit = models.ForeignKey(Bit, related_name = "bit_views", on_delete=models.CASCADE, blank=True)
    user = models.ForeignKey(User, related_name = "bit_views", on_delete=models.CASCADE, blank=True)
    time = models.DateTimeField(default=timezone.now)

class BitNewView(models.Model):
    #Model for a new view on a bit
    bit = models.ForeignKey(Bit, related_name = "bit_new_views", on_delete=models.CASCADE, blank=True)
    user = models.ForeignKey(User, related_name = "bit_new_views", on_delete=models.CASCADE, blank=True)
    time = models.DateTimeField(default=timezone.now)

class VideoBitWatch(models.Model):
    #Model for a view on a video bit
    video = models.ForeignKey('yb_video.Video', related_name = "video_bit_watch", on_delete=models.CASCADE, blank=True)
    user = models.ForeignKey(User, related_name = "video_bit_watch", on_delete=models.CASCADE, blank=True)
    time = models.DateTimeField(default=timezone.now)

#Interaction History
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
