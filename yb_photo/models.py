from django.db import models
from django.utils import timezone


# Create your models here.

class Photo(models.Model):
    #Model for a photo uploaded by a user
    image = models.ImageField(blank = True, upload_to='media/profile/source_photos/%Y/%m/%d/%H:%M', default="static/images/2023-logo-draft.png")

    is_community = models.BooleanField(default=False)

    profile = models.ForeignKey('yb_profile.UserProfile', related_name = "photo", on_delete=models.CASCADE, blank=True, null=True)
    community_profile = models.ForeignKey('yb_profile.CommunityProfile', related_name = "photo", on_delete=models.CASCADE, blank=True, null=True)
    
    small_thumbnail = models.ImageField(blank = True, upload_to='media/profile/small_thumbnails/%Y/%m/%d/%H:%M', default="static/images/2023-logo-draft.png")
    medium_thumbnail = models.ImageField(blank = True, upload_to='media/profile/medium_thumbnails/%Y/%m/%d/%H:%M', default="static/images/2023-logo-draft.png")
    large_thumbnail =  models.ImageField(blank = True, upload_to='media/profile/large_thumbnails/%Y/%m/%d/%H:%M', default="static/images/2023-logo-draft.png")
    
    stickers = models.ManyToManyField('PhotoSticker', related_name = "photo", blank=True)

    uploaded = models.DateTimeField(default=timezone.now)
    modified = models.DateTimeField(default=timezone.now)
    is_private = models.BooleanField(default=False)

class PhotoSticker(models.Model):
    #Model for sticker placement on a photo
    sticker_name = models.CharField(max_length=100, default="")
    url = models.CharField(max_length=100, default="")
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

class ProfileImage(models.Model):
    profile = models.ForeignKey('yb_profile.UserProfile', related_name = "profile_image", on_delete=models.CASCADE, blank=True, null=True)
    photo = models.ForeignKey('Photo', related_name = "profile_image", on_delete=models.CASCADE, blank=True, null=True)

class Wallpaper(models.Model):
    user_profile = models.ForeignKey('yb_profile.UserProfile', related_name='wallpaper', blank=True, on_delete=models.CASCADE, null=True)
    community_profile = models.ForeignKey('yb_profile.CommunityProfile', related_name='wallpaper', blank=True, on_delete=models.CASCADE, null=True)
    background_image = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="media/aqua_default_theme.png")
    background_mobile = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="media/aqua_default_theme.png")
    background_desktop = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="media/aqua_default_theme.png")