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
from django.conf import settings
import imageio
import logging
import requests
import json


def generate_tiny_thumbnail(user, source_file, raw_source):
    label = "thumbnail_tiny"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')

    lthumb_io = BytesIO()

    if source_file.format == 'GIF':
        original_image = source_file
        new_frames = [frame.copy() for frame in ImageSequence.Iterator(original_image)]

        for frame in new_frames:
            frame.thumbnail((32, 32), Image.ANTIALIAS)

        duration = original_image.info.get('duration', 100)
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=duration)
        format = 'image/gif'
    else:
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (32, 32), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

    lthumb_io.seek(0)

    # Use InMemoryUploadedFile for both GIF and non-GIF
    thumbnail_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)
    
    print("Thumbnail Created")
    return thumbnail_file

def generate_small_thumbnail(user, source_file, raw_source):
    # Open the source file
    label = "thumbnail_small"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    
    print("File Format " + source_file.format)
    # Check if the source file is a GIF
    if source_file.format == 'GIF':
        print("File format is gif. NOT RETURNING AN IN MEMORY UPLOADED FILE!")
        original_image = source_file
        new_frames = [frame.copy() for frame in ImageSequence.Iterator(original_image)]
        lthumb_io = BytesIO()

        # Handle GIF resizing
        for frame in new_frames:
            frame.thumbnail((64, 64), Image.ANTIALIAS)

        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"

        duration = original_image.info.get('duration', 100)

        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=duration)
        format = 'image/gif'

        
        cropped_image_file = ContentFile(lthumb_io.getvalue(), this_filename)

        print("Thumbnail Created")
        return cropped_image_file
    else:
        # Handle non-GIF image resizing
        lthumb_io = BytesIO()
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (64, 64), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

        lthumb_io.seek(0)

        # Create InMemoryUploadedFile
        inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

        print("Thumbnail Created")
        return inmemory_uploaded_file

def generate_medium_thumbnail(user, source_file, raw_source):
    # Open the source file
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    

    # Check if the source file is a GIF
    if source_file.format == 'GIF':
        print("File format is gif. NOT RETURNING AN IN MEMORY UPLOADED FILE!")
        original_image = source_file
        new_frames = [frame.copy() for frame in ImageSequence.Iterator(original_image)]
        lthumb_io = BytesIO()

        # Handle GIF resizing
        for frame in new_frames:
            frame.thumbnail((256, 256), Image.ANTIALIAS)

        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"
        duration = original_image.info.get('duration', 100)
        
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=duration)
        format = 'image/gif'

        cropped_image_file = ContentFile(lthumb_io.getvalue(), this_filename)

        print("Thumbnail Created")

        return cropped_image_file
    else:
        # Handle non-GIF image resizing
        lthumb_io = BytesIO()
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (256, 256), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

        lthumb_io.seek(0)

        # Create InMemoryUploadedFile
        inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

        print("Thumbnail Created")
        return inmemory_uploaded_file

def generate_large_thumbnail(user, source_file, raw_source):
    # Open the source file
    label = "thumbnail_large"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    

    # Check if the source file is a GIF
    if source_file.format == 'GIF':
        print("File format is gif. NOT RETURNING AN IN MEMORY UPLOADED FILE!")
        original_image = source_file
        new_frames = [frame.copy() for frame in ImageSequence.Iterator(original_image)]
        lthumb_io = BytesIO()

        # Handle GIF resizing
        for frame in new_frames:
            frame.thumbnail((512, 512), Image.ANTIALIAS)

        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"
        duration = original_image.info.get('duration', 100)

        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=duration)
        format = 'image/gif'

        
        cropped_image_file = ContentFile(lthumb_io.getvalue(), this_filename)

        print("Thumbnail Created")
        return cropped_image_file
    else:
        # Handle non-GIF image resizing
        lthumb_io = BytesIO()
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (512, 512), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

        lthumb_io.seek(0)

        # Create InMemoryUploadedFile
        inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)
        
        print("Thumbnail Created")
        
        return inmemory_uploaded_file
