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
def cropper_view(request, crop_type, *args, **kwargs):

    return render(request, "image_cropper.html", {"type": crop_type})
    
    
def upload_image(request, *args, **kwargs):
    from yb_customize.models import CustomCore
    if request.method == 'POST':
    
        print(request.POST)
        print(request.FILES)
        this_image = request.FILES.get('source_image')
        image_type = request.POST.get('image_type')
        print(this_image)
        crop_x = request.POST.get('crop_x')
        crop_y = request.POST.get('crop_y')
        crop_width = request.POST.get('crop_width')
        crop_height = request.POST.get('crop_height')
        
        cropped_image = modify_image(image_type, request.user, this_image, crop_data={'x': crop_x, 'y': crop_y, 'width': crop_width, 'height': crop_height})

        custom_core = CustomCore.objects.get(profile=request.user.profile)

        if request.POST.get('image_type') == "desktop" or request.POST.get('image_type') == "mobile":
            if request.POST.get("wpid"):
                wpid = request.POST.get("wpid")
                try:
                    wallpaper = Wallpaper.objects.get(pk=wpid)
                except:
                    wallpaper = Wallpaper(profile = request.user.profile)
                    wallpaper.save()

                    wallpaper.background_image = cropped_image
                if request.POST.get('image_type') == "desktop":
                
                    wallpaper.background_desktop = cropped_image
                
                elif request.POST.get('image_type') == "mobile":
                    wallpaper.background_mobile = cropped_image

                
                wallpaper.save()

                custom_core.wallpaper = wallpaper

                if custom_core.wallpaper_on == False:
                    custom_core.wallpaper_on = True

                return JsonResponse({'status': 'success', 'wpid': wallpaper.id}, status=200)


        elif request.POST.get('image_type') == "profile":
            from yb_photo.api.serializers import PhotoSerializer
            custom_core.profile_image = cropped_image
            custom_core.save()

            return JsonResponse({'status': 'success'}, status=200)
            


        custom_core.save()
                
        

    else:
        return JsonResponse({'status': 'failed', 'message': 'No image uploaded'}, status=400)
    


def get_cloudflare_image_url(request):
    if request.method == 'POST':
        headers = {
            "Authorization": f"Bearer {env('CLOUDFLARE_IMAGES_API_KEY')}",
            'Tus-Resumable': '1.0.0',
        }

        stream_api_url = f"https://api.cloudflare.com/client/v4/accounts/{env('CLOUDFLARE_STREAM_ACCOUNT_ID')}/images/v2/direct_upload"

        print(env('CLOUDFLARE_STREAM_API_KEY'))

        try:
            print("Requesting upload URL from Cloudflare Stream API")
            response = requests.post(stream_api_url, headers=headers, json={"maxDurationSeconds": 300})
            if response.status_code == 200:
                # Return the signed URL to the client
                upload_url = response.json().get('result', {}).get('uploadURL')
                return JsonResponse({"upload_url": upload_url})
            else:
                print("Error:", response.json())
                return JsonResponse({"status": "error", "message": response.json()}, status=400)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

def test_upload(request):
    return render(request, "image_upload_test.html")