from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
from PIL import Image
import io
import json
import imageio
from django.core.files.base import ContentFile
from yb_photo.models import Wallpaper
from yb_photo.utility import process_image, modify_image

import requests
import jwt
import datetime
from YourbitGold.settings import env
import os
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from yb_photo.models import Photo
from yb_photo.api.serializers import PhotoSerializer

CLOUDFLARE_IMAGE_ACCOUNT_ID = settings.CLOUDFLARE_STREAM_ACCOUNT_ID

def cropper_view(request, crop_type, *args, **kwargs):

    return render(request, "image_cropper.html", {"type": crop_type})

    
def reset_images_to_yb(request):
    if request.user.is_admin:
        for photo in Photo.objects.all():
            photo.storage_type = "yb"
            photo.save()
def upload_image(request, *args, **kwargs):
    from yb_customize.models import CustomCore
    from yb_photo.utility import upload_image_cf

    if request.method == 'POST':
    
        print(request.POST)
        print(request.FILES)
        this_image = request.FILES.get('image')
        image_type = request.POST.get('image_type')

        print(this_image)
        
        photo_object = upload_image_cf(request, image_type)
        

        custom_core = CustomCore.objects.get(profile=request.user.profile)

        if request.POST.get('image_type') == "desktop" or request.POST.get('image_type') == "mobile":
            custom_core.wallpaper = photo_object
            custom_core.save()
            return JsonResponse({'status': 'success', 'wpid': photo_object.id}, status=200)
        
        if request.POST.get('image_type') ==  'profile':
            custom_core.profile_image = photo_object
            custom_core.save()
            return JsonResponse({'status': 'success', 'wpid': photo_object.id}, status=200)

    else:
        return JsonResponse({'status': 'failed', 'message': 'No image uploaded'}, status=400)
    


def test_upload(request):
    return render(request, "image_upload_test.html")
