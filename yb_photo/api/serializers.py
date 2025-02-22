#Serializers.py
from rest_framework import serializers
from yb_photo.models import *
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import update_last_login
from django.utils import timezone
from yb_photo.utility import generate_cloudflare_presigned_url


class PhotoSerializer(serializers.ModelSerializer):
        
    image_url = serializers.SerializerMethodField()
    tiny_thumbnail_url = serializers.SerializerMethodField()
    small_thumbnail_url = serializers.SerializerMethodField()
    medium_thumbnail_url = serializers.SerializerMethodField()
    large_thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Photo
        fields = [
            'id', 
            'storage_type', 
            'image', 
            'tiny_thumbnail', 
            'small_thumbnail', 
            'medium_thumbnail', 
            'large_thumbnail', 
            'tiny_thumbnail_ext', 
            'small_thumbnail_ext', 
            'medium_thumbnail_ext', 
            'large_thumbnail_ext'
        ]
    
    def get_presigned_url(self, file_path, expiration=3600):
        """
        Generates a signed URL for Linode Object Storage (S3-compatible).
        """
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        )

        try:
            return s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": file_path},
                ExpiresIn=expiration,
            )
        except Exception as e:
            print(f"Error generating presigned URL: {e}")
            return None

    def get_signed_url(self, obj, field_name, variant="public", expiration=3600):
        """
        Returns the appropriate signed URL based on storage type.
        """
        if obj.storage_type == "yb":
            file_field = getattr(obj, field_name)
            return self.get_presigned_url(file_field.name) if file_field else None
        else:
            # Cloudflare Images - Use Cloudflare function
            cloudflare_id = getattr(obj, "cloudflare_image_id", None)
            return (
                generate_cloudflare_presigned_url(cloudflare_id, variant, expiration)
                if cloudflare_id
                else None
            )

    def get_image_url(self, obj):
        return self.get_signed_url(obj, "image")

    def get_tiny_thumbnail_url(self, obj):
        return self.get_signed_url(obj, "tiny_thumbnail", "tiny")

    def get_small_thumbnail_url(self, obj):
        return self.get_signed_url(obj, "small_thumbnail", "small")

    def get_medium_thumbnail_url(self, obj):
        return self.get_signed_url(obj, "medium_thumbnail", "medium")

    def get_large_thumbnail_url(self, obj):
        return self.get_signed_url(obj, "large_thumbnail", "large")

        
class PhotoStickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoSticker
        fields = '__all__'

class VideoThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoThumbnail
        fields = '__all__'

class WallpaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallpaper
        fields = '__all__'