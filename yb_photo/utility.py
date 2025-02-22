from django.shortcuts import render
# Import bytesIO to create in-memory files
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone
from django.utils import dateformat
from PIL import Image, ImageOps, ImageSequence
from .models import Photo
import io
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.conf import settings
import imageio
import logging
import requests
from .thumbnails import *
from yb_photo.models import *


logger = logging.getLogger(__name__)

CLOUDFLARE_IMAGE_ACCOUNT_ID = settings.CLOUDFLARE_STREAM_ACCOUNT_ID

def generate_cloudflare_presigned_url(image_id, variant, expiration=3600):
    """
        Generates a Cloudflare Image URL, with optional signed access.
        
        :param image_id: The ID of the stored image in Cloudflare.
        :param variant: The variant of the image (e.g., 'thumbnail', 'public', 'full').
        :param expiration: Expiration time in seconds (only applies if signing is enabled).
        :return: A direct URL to the Cloudflare image.
    """

    # Base delivery URL for Cloudflare Images
    base_url = f"https://imagedelivery.net/{settings.CLOUDFLARE_ACCOUNT_HASH}/{image_id}/{variant}"

    # If signing is disabled, return the direct URL
    if not getattr(settings, "CLOUDFLARE_SIGNING_SECRET", None):
        return base_url

    # Generate a signed URL if signing is enabled
    expiry_timestamp = int(time.time()) + expiration
    signing_secret = settings.CLOUDFLARE_SIGNING_SECRET

    # Create the token signature
    signature_string = f"{image_id}/{variant}{expiry_timestamp}"
    signature = hmac.new(
        signing_secret.encode(), signature_string.encode(), hashlib.sha256
    ).digest()

    # Encode the signature in URL-safe base64
    encoded_signature = base64.urlsafe_b64encode(signature).decode()

    # Append the signature and expiration as query parameters
    return f"{base_url}?exp={expiry_timestamp}&sig={encoded_signature}"


def rename_image(user, filename, file_type):
    #Create a timestamp for the image
    label = "thumbnail_medium"
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    #Create a new filename
    new_filename = f"{user.username}{user.id}{timestamp}{filename}{label}.{file_type}"
    
    return new_filename


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
        return cropped_image_file

    elif image_format == 'gif':

        # Read the original file into memory
        original_image_file.seek(0)
        image_data = original_image_file.read()

        # Load the original GIF using imageio from the bytes in memory
        original_image = imageio.mimread(image_data)

        # Open the image using PIL from the same bytes to access metadata like 'duration'
        pil_image = Image.open(io.BytesIO(image_data))


        cropped_frames = [crop_image(Image.fromarray(frame), crop_data) for frame in original_image]
        output_io = io.BytesIO()
        duration = pil_image.info.get('duration', 100)  # Default to 100 if not present

        cropped_frames[0].save(output_io, format='GIF', save_all=True, append_images=cropped_frames[1:], loop=0, duration=duration)
        new_name = rename_image(user, original_image_file.name, 'gif')
        cropped_image_file = ContentFile(output_io.getvalue(), new_name)
        return cropped_image_file
        
        

    else:

        return JsonResponse({'status': 'failed', 'message': 'Unsupported image format'}, status=400)

def process_image(request, source_image = None, cropped_image = None, is_private = False):
    print("Processing image...")

    new_photo = Photo(image=source_image)

    try:
        user = request.user
    except:
        user = request

    # Ensure cropped_image is opened correctly
    cropped_image = Image.open(io.BytesIO(cropped_image.read()))

    new_photo.tiny_thumbnail = generate_tiny_thumbnail(user, cropped_image, source_image)
    new_photo.small_thumbnail = generate_small_thumbnail(user, cropped_image, source_image)
    new_photo.medium_thumbnail = generate_medium_thumbnail(user, cropped_image, source_image)
    new_photo.large_thumbnail = generate_large_thumbnail(user, cropped_image, source_image)

    print("Images Cropped")

    new_photo.is_private = is_private

    try:
        new_photo.save()
    except Exception as e:
        logger.error(f"Error saving new_photo: {e}")
        raise

    print("Processing Complete")

    return new_photo

def get_image_url_from_cloudflare(image_id, variant="public"):
    print("Image URL " + variant)
    return f"https://imagedelivery.net/{settings.CLOUDFLARE_ACCOUNT_HASH}/{image_id}/{variant}"



def generate_image_urls(image_id):
    print("Generating image urls")
    return {
        'image_url': 
            get_image_url_from_cloudflare(
                image_id, 
                variant="public"
            ),
        'tiny_thumbnail_url': 
            get_image_url_from_cloudflare(
                image_id, 
                variant="tinyThumbnail"
            ),
        'small_thumbnail_url': 
            get_image_url_from_cloudflare(
                image_id, 
                variant="smallThumbnail"
            ),
        'medium_thumbnail_url': 
            get_image_url_from_cloudflare(
                image_id, 
                variant="mediumThumbnail"
            ),
        'large_thumbnail_url': 
            get_image_url_from_cloudflare(
                image_id, 
                variant="largeThumbnail"
            )
    }

def generate_wallpaper_urls(image_id):
    return {
        'image_url': get_image_url_from_cloudflare(image_id, variant="public"),
        'desktop_wallpaper': get_image_url_from_cloudflare(image_id, variant="desktopCropWallpaper"),
        'mobile_wallpaper': get_image_url_from_cloudflare(image_id, variant="mobileCropWallpaper"),
    }

def generate_video_thumb_urls(image_id):
    return {
        'image_url': get_image_url_from_cloudflare(image_id, variant="public"),
        'tiny_thumbnail_url': get_image_url_from_cloudflare(image_id, variant="tinyVideoThumbnail"),
        'small_thumbnail_url': get_image_url_from_cloudflare(image_id, variant="smallVideoThumbnail"),
        'medium_thumbnail_url': get_image_url_from_cloudflare(image_id, variant="mediumVideoThumbnail"),
        'large_thumbnail_url': get_image_url_from_cloudflare(image_id, variant="largeVideoThumbnail"),
        'xlarge_thumbnail_url': get_image_url_from_cloudflare(image_id, variant="xlVideoThumbnail")
    }


def send_image_to_cloudflare(image_file):
    # Cloudflare API URL for image uploads
    image_api_url = f"https://api.cloudflare.com/client/v4/accounts/{settings.CLOUDFLARE_STREAM_ACCOUNT_ID}/images/v1"
    
    # Authorization header with API token
    headers = {
        "Authorization": f"Bearer {settings.CLOUDFLARE_IMAGES_API_KEY}"
    }
    
    # Open the image file and send it with the request
    with image_file.open('rb') as f:
        files = {'file': (image_file.name, f)}
        response = requests.post(image_api_url, headers=headers, files=files)
    
    # Raise an error if the request fails
    response.raise_for_status()
    
    # Return the uploaded image ID
    return response.json()["result"]["id"]

def upload_image_cf(request, image_type="profile"):
    from yb_photo.utility import generate_image_urls
    from yb_profile.models import Profile
    profile_object = Profile.objects.get(username = request.user.active_profile)
    print(request.FILES)
    image = request.FILES.get('photo') 
    if request.POST.get('crop_data'):
        crop_data = request.POST.get('crop_data')

        crop_data = json.loads(crop_data)
        image = modify_image(request.user, image, crop_data)

    else:
        image = image
    image_id = send_image_to_cloudflare(image)
    print(image_type)
    
    
    if image_type == "general":
        new_photo = Photo.objects.create(
            storage_type="cf", 
            ext_id=image_id, 
            profile=profile_object
        )
    
        urls = generate_image_urls(image_id)
        print(urls)

        new_photo.ext_url = urls['image_url']
        new_photo.tiny_thumbnail_ext = urls['tiny_thumbnail_url']
        new_photo.small_thumbnail_ext = urls['small_thumbnail_url']
        new_photo.medium_thumbnail_ext = urls['medium_thumbnail_url']
        new_photo.large_thumbnail_ext = urls['large_thumbnail_url']

        new_photo.save()
        

    elif image_type == "profile":
        profile_type = request.POST.get('profile_class')
        print(profile_type)
        if profile_type == "user":

            new_photo = Photo.objects.create(
                storage_type="cf", 
                ext_id=image_id, 
                profile=profile_object
            )

            urls = generate_image_urls(image_id)
            print(urls)
            new_photo.ext_url = urls['image_url']
            new_photo.tiny_thumbnail_ext = urls['tiny_thumbnail_url']
            new_photo.small_thumbnail_ext = urls['small_thumbnail_url']
            new_photo.medium_thumbnail_ext = urls['medium_thumbnail_url']
            new_photo.large_thumbnail_ext = urls['large_thumbnail_url']

            new_photo.save()

            profile_image = ProfileImage.objects.create(
                profile = profile_object,
                photo = new_photo
            )

            profile_image.save()

    elif image_type == "video_thumbnail":
        new_photo = VideoThumbnail.objects.get(upload_id = request.data.get("upload_id"))
    
        urls = generate_video_thumb_urls(image_id)
        new_photo.ext_url = urls['image_url']
        new_photo.small_thumbnail_ext = urls['small_thumbnail_url']
        new_photo.medium_thumbnail_ext = urls['medium_thumbnail_url']
        new_photo.large_thumbnail_ext = urls['large_thumbnail_url']
        new_photo.xlarge_thumbnail_ext = urls['xlarge_thumbnail_url']

        new_photo.save()
        

    elif image_type == "desktop" or image_type == "mobile":
        if request.POST.get("wpid"):
            wpid = request.POST.get("wpid")
            try:
                new_photo = Wallpaper.objects.get(pk=wpid)
                new_photo.background_mobile_id = image_id

            except:
            
                new_photo = Wallpaper.objects.create(
                    storage_type="cf", 
                    background_desktop_id=image_id, 
                    profile=profile_object
                )

            new_photo.save()

    return new_photo