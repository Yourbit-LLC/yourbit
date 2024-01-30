from django.db import models
from django.utils import timezone
from yb_accounts.models import Account as User

# Create your models here.

class Video(models.Model):
    #Model for attached video to bit
    video = models.FileField(blank = True, upload_to='media/profile/videos/%Y/%m/%d/%H:%M')
    user = models.ForeignKey(User, related_name = "video", on_delete=models.DO_NOTHING, blank=True)
    uploaded = models.DateTimeField(default=timezone.now)
    modified = models.DateTimeField(default=timezone.now)
    is_private = models.BooleanField(default=False)

class VideoSticker(models.Model):
    #Model for sticker placement on a video
    video = models.ForeignKey(Video, related_name = "video_sticker", on_delete=models.CASCADE, blank=True)
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

class VideoWidget(models.Model):
    #Model for widget placement on a video
    video = models.ForeignKey(Video, related_name = "video_widget", on_delete=models.CASCADE, blank=True)
    name = models.CharField(max_length=50, default="")
    widget = models.CharField(max_length=50, default="")
    action = models.CharField(max_length=50, default="")
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

