from django.shortcuts import render
#Import bytesIO to create in-memory files
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone
from django.utils import dateformat
from PIL import Image, ImageOps, ImageSequence
from .models import Photo
import io
from django.core.files.base import ContentFile
from django.http import JsonResponse
import imageio


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



def modify_image(image_type, user, original_image_file, crop_data):
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
    

    if image_type == "profile":

        cropped_image_file = process_image(user, original_image_file, cropped_image_file, is_private = False)

    return cropped_image_file

# Create your views here.
def generate_tiny_thumbnail(user, source_file, raw_source):
    # Open the source file
    source_file = Image.open(source_file)
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')

    # Check if the source file is a GIF
    if source_file.format == 'GIF':
        original_image = source_file
        new_frames = [Image.fromarray(frame) for frame in original_image]
        lthumb_io = BytesIO()

        # Handle GIF resizing
        for frame in new_frames:
            frame.thumbnail((32, 32), Image.ANTIALIAS)

        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"

        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=100)  
        format = 'image/gif'
    else:
        # Handle non-GIF image resizing
        lthumb_io = BytesIO()
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (32, 32), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

    # Create InMemoryUploadedFile
    inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

    return inmemory_uploaded_file


def generate_small_thumbnail(user, source_file, raw_source):
    # Open the source file
    source_file = source_file
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    
    print("File Format " + source_file.format)
    # Check if the source file is a GIF
    if source_file.format == 'GIF':
        # Create a new BytesIO object for the thumbnail
        lthumb_io = BytesIO()

        # Handle GIF resizing
        frames = ImageSequence.Iterator(source_file)
        new_frames = []
        for frame in frames:
            new_frame = ImageOps.fit(frame.convert('RGBA'), (64, 64), Image.ANTIALIAS)
            new_frames.append(new_frame)

        # Save the new frames as a GIF
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=100)

        # Update filename and format
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"
        
        format = 'image/gif'
    else:
        # Handle non-GIF image resizing
        lthumb_io = BytesIO()
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (64, 64), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

    # Create InMemoryUploadedFile
    inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

    return inmemory_uploaded_file

def generate_medium_thumbnail(user, source_file, raw_source):
    # Open the source file
    source_file = source_file
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    

    # Check if the source file is a GIF
    if source_file.format == 'GIF':
        # Create a new BytesIO object for the thumbnail
        lthumb_io = BytesIO()

        # Handle GIF resizing
        frames = ImageSequence.Iterator(source_file)
        new_frames = []
        for frame in frames:
            new_frame = ImageOps.fit(frame.convert('RGBA'), (256, 256), Image.ANTIALIAS)
            new_frames.append(new_frame)

        # Save the new frames as a GIF
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=100)

        # Update filename and format
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"
        format = 'image/gif'
    else:
        # Handle non-GIF image resizing
        lthumb_io = BytesIO()
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (256, 256), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

    # Create InMemoryUploadedFile
    inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

    return inmemory_uploaded_file

def generate_large_thumbnail(user, source_file, raw_source):
    # Open the source file
    source_file = source_file
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    

    # Check if the source file is a GIF
    if source_file.format == 'GIF':
        # Create a new BytesIO object for the thumbnail
        lthumb_io = BytesIO()

        # Handle GIF resizing
        frames = ImageSequence.Iterator(source_file)
        new_frames = []
        for frame in frames:
            new_frame = ImageOps.fit(frame.convert('RGBA'), (512, 512), Image.ANTIALIAS)
            new_frames.append(new_frame)

        # Save the new frames as a GIF
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=100)

        # Update filename and format
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"
        format = 'image/gif'
    else:
        # Handle non-GIF image resizing
        lthumb_io = BytesIO()
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (512, 512), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

    # Create InMemoryUploadedFile
    inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

    return inmemory_uploaded_file

def process_image(request, source_image = None, cropped_image = None, is_private = False):

    print("Processing image...")

    #Create new photo instance
    new_photo = Photo(image=source_image)

    try:
        user = request.user
    except:
        user = request

    new_photo.tiny_thumbnail = generate_tiny_thumbnail(user, cropped_image, source_image)
    new_photo.small_thumbnail = generate_small_thumbnail(user, cropped_image, source_image)
    new_photo.medium_thumbnail = generate_medium_thumbnail(user, cropped_image, source_image)
    new_photo.large_thumbnail = generate_large_thumbnail(user, cropped_image, source_image)

    print("Images Cropped")

    new_photo.is_private = is_private
    new_photo.save()

    print("Processing Complete")

    return new_photo

