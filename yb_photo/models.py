from django.db import models
from django.utils import timezone
from django.conf import settings
import boto3
import time
import hmac
import hashlib
import base64

# Create your models here.

class Photo(models.Model):
    #Model for a photo uploaded by a user
    profile = models.ForeignKey('yb_profile.Profile', related_name = "photo", on_delete=models.CASCADE, blank=True, null=True)
    is_community = models.BooleanField(default=False)
    
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

    def get_presigned_yb_url(self, field_name="image", expiration=3600):
        """
        Generates a pre-signed URL for the given field.
        - field_name: the name of the model field (e.g., 'image', 'tiny_thumbnail')
        - expiration: time in seconds for the link to be valid (default: 1 hour)
        """
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            endpoint_url=settings.AWS_S3_ENDPOINT_URL
        )

        field = getattr(self, field_name)
        if not field:
            return None  # Return None if there's no file uploaded

        file_path = field.name  # The relative path in the bucket

        try:
            presigned_url = s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": file_path},
                ExpiresIn=expiration
            )
            return presigned_url
        except Exception as e:
            print(f"Error generating presigned URL: {e}")
            return None


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
    photo = models.ForeignKey('Photo', related_name = "profile_image", on_delete=models.CASCADE, blank=True, null=True)
    time = models.DateTimeField(default=timezone.now)

class Wallpaper(models.Model):
    profile = models.ForeignKey('yb_profile.Profile', related_name='wallpaper', blank=True, on_delete=models.CASCADE, null=True)
    background_image = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="static/images/main/desktop-wallpaper-plceholder.png")
    background_mobile = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="static/images/main/mobile-wallpaper-placeholder.png")
    background_desktop = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="static/images/main/desktop-wallpaper-placeholder.png")

    storage_type = models.CharField(max_length=100, default="cf")
    
    background_mobile_id = models.CharField(max_length=1000, default="")
    background_mobile_url = models.CharField(max_length=1000, default="")
    background_desktop_id = models.CharField(max_length=1000, default="")
    background_desktop_url = models.CharField(max_length=1000, default="")

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