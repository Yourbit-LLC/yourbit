from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
from PIL import Image
import io
import json
import imageio
from django.core.files.base import ContentFile
from yb_photo.models import Wallpaper
    
def cropper_view(request, crop_type, *args, **kwargs):

    return render(request, "image_cropper.html", {"type": crop_type})
    


def crop_image(image, crop_data):
    return image.crop((
        crop_data['x'],
        crop_data['y'],
        crop_data['x'] + crop_data['width'],
        crop_data['y'] + crop_data['height']
    ))

def modify_image(original_image_file, crop_data):
    

    image_format = original_image_file.name.split('.')[-1].lower()

    if image_format in ['jpg', 'jpeg', 'png']:
        original_image = Image.open(original_image_file)
        cropped_image = crop_image(original_image, crop_data)
        output_io = io.BytesIO()
        cropped_image.save(output_io, format='JPEG', quality=85)
        cropped_image_file = ContentFile(output_io.getvalue(), 'cropped.jpg')
    elif image_format == 'gif':
        original_image = imageio.mimread(original_image_file)
        cropped_frames = [crop_image(Image.fromarray(frame), crop_data) for frame in original_image]
        output_io = io.BytesIO()
        cropped_frames[0].save(output_io, format='GIF', save_all=True, append_images=cropped_frames[1:], loop=0)
        cropped_image_file = ContentFile(output_io.getvalue(), 'cropped.gif')
    else:
        return JsonResponse({'status': 'failed', 'message': 'Unsupported image format'}, status=400)
    


    return cropped_image_file
    
def upload_image(request, *args, **kwargs):
    if request.method == 'POST':
    
        print(request.POST)
        this_image = request.FILES.get('source_image')
        crop_data = request.POST.get('crop_data')
        print(crop_data)
        cropped_image = modify_image(this_image , crop_data)



        if request.POST.get('image_type') == "desktop" or request.POST.get('image_type') == "mobile":
            if request.POST.get("wpid"):
                wpid = request.POST.get("wpid")
                try:
                    wallpaper = Wallpaper.objects.get(pk=wpid)
                except Wallpaper.DoesNotExist:
                    wallpaper = Wallpaper(profile = request.user.profile)
                    wallpaper.save()
                if request.POST.get('image_type') == "desktop":
                
                    wallpaper.background_desktop = cropped_image
                
                elif request.POST.get('image_type') == "mobile":
                    wallpaper.background_mobile = cropped_image
                
                wallpaper.save()
                
                return JsonResponse({'status': 'success', 'wpid': wallpaper.id}, status=200)

    else:
        return JsonResponse({'status': 'failed', 'message': 'No image uploaded'}, status=400)