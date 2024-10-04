from django.db import models
from django.utils import timezone


# Create your models here.

class Photo(models.Model):
    #Model for a photo uploaded by a user
    profile = models.ForeignKey('yb_profile.Profile', related_name = "photo", on_delete=models.CASCADE, blank=True, null=True)
    is_community = models.BooleanField(default=False)
    community_profile = models.ForeignKey('yb_profile.Orbit', related_name = "photo", on_delete=models.CASCADE, blank=True, null=True)
    
    #Define storage type for photo to identify source fields
    storage_type = models.CharField(max_length=100, default="cf") #current possible locations are: 'yb' - Yourbit, 'cf' - CloudFlare, 'ex' - External

    #Fields for yb storage
    image = models.ImageField(blank = True, upload_to='media/profile/source_photos/%Y/%m/%d/%H:%M', default="static/images/main/default_pfile_image2.png")
    tiny_thumbnail = models.ImageField(blank = True, upload_to='media/profile/tiny_thumbnails/%Y/%m/%d/%H:%M', default="static/images/main/default_pfile_image2.png")
    small_thumbnail = models.ImageField(blank = True, upload_to='media/profile/small_thumbnails/%Y/%m/%d/%H:%M', default="static/images/main/default_pfile_image2.png")
    medium_thumbnail = models.ImageField(blank = True, upload_to='media/profile/medium_thumbnails/%Y/%m/%d/%H:%M', default="static/images/main/default_pfile_image2.png")
    large_thumbnail =  models.ImageField(blank = True, upload_to='media/profile/large_thumbnails/%Y/%m/%d/%H:%M', default="static/images/main/default_pfile_image2.png")
    
    #Fields for Other storage types
    ext_url = models.CharField(max_length=1000, default="")
    ext_id = models.CharField(max_length=1000, default="")
    tiny_thumbnail_ext = models.CharField(max_length=1000, default="")
    small_thumbnail_ext = models.CharField(max_length=1000, default="")
    medium_thumbnail_ext = models.CharField(max_length=1000, default="")
    large_thumbnail_ext =  models.CharField(max_length=1000, default="")
    

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
    profile = models.ForeignKey('yb_profile.Profile', related_name = "profile_image", on_delete=models.CASCADE, blank=True, null=True)
    orbit = models.ForeignKey("yb_profile.Orbit", related_name="orbit_image", on_delete=models.CASCADE, blank=True, null=True)
    photo = models.ForeignKey('Photo', related_name = "profile_image", on_delete=models.CASCADE, blank=True, null=True)
    time = models.DateTimeField(default=timezone.now)

class Wallpaper(models.Model):
    profile = models.ForeignKey('yb_profile.Profile', related_name='wallpaper', blank=True, on_delete=models.CASCADE, null=True)
    background_image = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="static/images/main/desktop-wallpaper-plceholder.png")
    background_mobile = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="static/images/main/mobile-wallpaper-placeholder.png")
    background_desktop = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="static/images/main/desktop-wallpaper-placeholder.png")

    storage_type = models.CharField(max_length=100, default="cf")
    
    ext_id = models.CharField(max_length=100, default="")
    ext_url = models.CharField(max_length=1000, default="")
    background_mobile_ext = models.CharField(max_length=1000, default="")
    background_desktop_ext = models.CharField(max_length=1000, default="")

    def __str__(self):
        try:
            return f"Wallpaper {self.id} - Submitted by: {self.profile.username}"
        
        except:
            return f"Wallpaper {self.id} - Submitted by: Unknown User"
        
    #on delete also delete associated image files
    def delete(self, *args, **kwargs):
        self.background_image.delete()
        self.background_mobile.delete()
        self.background_desktop.delete()
        super().delete(*args, **kwargs)

class VideoThumbnail(models.Model):
    #Model for a thumbnail image for a video
    storage_type = models.CharField(max_length=100, default="yb")

    image = models.ImageField(blank = True, upload_to='media/profile/video_thumbnails/%Y/%m/%d/%H:%M', default="static/images/main/default_pfile_image2.png")
    ext_url = models.CharField(max_length=1000, default="")
    upload_id = models.CharField(max_length=1000, default="")

    tiny_thumbnail_ext = models.CharField(max_length=1000, default="")
    small_thumbnail_ext = models.CharField(max_length=1000, default="")
    medium_thumbnail_ext = models.CharField(max_length=1000, default="")
    large_thumbnail_ext = models.CharField(max_length=1000, default="")
    xlarge_thumbnail_ext = models.CharField(max_length=1000, default="")

    profile = models.ForeignKey('yb_profile.Profile', related_name = "video_thumbnail", on_delete=models.CASCADE, blank=True, null=True)

    uploaded = models.DateTimeField(default=timezone.now)
    modified = models.DateTimeField(default=timezone.now)
    is_private = models.BooleanField(default=False)