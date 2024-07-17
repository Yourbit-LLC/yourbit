from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
from PIL import Image
import io
import json
import imageio
from django.core.files.base import ContentFile
from yb_photo.models import Wallpaper
from yb_photo.utility import process_image    
def cropper_view(request, crop_type, *args, **kwargs):

    return render(request, "image_cropper.html", {"type": crop_type})
    


def crop_image(image, crop_data):
    return image.crop((
        float(crop_data['x']),
        float(crop_data['y']),
        float(crop_data['x']) + float(crop_data['width']),
        float(crop_data['y']) + float(crop_data['height'])
    ))

def modify_image(user, original_image_file, crop_data):
    from yb_photo.utility import rename_image
    image_format = original_image_file.name.split('.')[-1].lower()

    if image_format in ['jpg', 'jpeg', 'png']:
        original_image = Image.open(original_image_file)
        cropped_image = crop_image(original_image, crop_data)
        output_io = io.BytesIO()
        cropped_image.save(output_io, format='PNG', quality=85)
        new_name = rename_image(user, original_image_file.name, image_format)
        cropped_image_file = ContentFile(output_io.getvalue(), new_name)

    elif image_format == 'gif':

        original_image = imageio.mimread(original_image_file)
        cropped_frames = [crop_image(Image.fromarray(frame), crop_data) for frame in original_image]
        output_io = io.BytesIO()
        cropped_frames[0].save(output_io, format='GIF', save_all=True, append_images=cropped_frames[1:], loop=0)
        new_name = rename_image(user, original_image_file.name, 'gif')
        cropped_image_file = ContentFile(output_io.getvalue(), new_name)
        

    else:

        return JsonResponse({'status': 'failed', 'message': 'Unsupported image format'}, status=400)
    


    return cropped_image_file
    
def upload_image(request, *args, **kwargs):
    from yb_customize.models import CustomCore
    if request.method == 'POST':
    
        print(request.POST)
        this_image = request.FILES.get('source_image')
        print(this_image)
        crop_x = request.POST.get('crop_x')
        crop_y = request.POST.get('crop_y')
        crop_width = request.POST.get('crop_width')
        crop_height = request.POST.get('crop_height')
        
        cropped_image = modify_image(request.user, this_image, crop_data={'x': crop_x, 'y': crop_y, 'width': crop_width, 'height': crop_height})

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
            new_image = process_image(request, this_image, cropped_image, is_private = False)
            custom_core.profile_image = new_image

            return JsonResponse({'status': 'success', 'image': custom_core.profile_image.url}, status=200)
            


        custom_core.save()
                
        

    else:
        return JsonResponse({'status': 'failed', 'message': 'No image uploaded'}, status=400)