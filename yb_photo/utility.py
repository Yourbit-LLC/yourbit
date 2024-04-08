from django.shortcuts import render
#Import bytesIO to create in-memory files
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone
from django.utils import dateformat
from PIL import Image
from .models import Photo

# Create your views here.
def generate_tiny_thumbnail(request, source_file):
    #Create small thumbnail (32x32)
    source_file = Image.open(source_file)
    tiny_image = source_file.copy()
    sthumb_io = BytesIO()
    label = "thumbnail_tiny"
    tiny_thumbnail = tiny_image.resize((32, 32))
    tiny_thumbnail.save(sthumb_io, format='PNG', quality=80)
    this_username = request.user.username
    this_uid = request.user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    this_filename = this_username + str(this_uid) + timestamp + label + ".png"
    inmemory_uploaded_file = InMemoryUploadedFile(sthumb_io, None, this_filename, 'image/png', sthumb_io.tell(), None)
    
    return inmemory_uploaded_file

def generate_small_thumbnail(request, source_file):
    #Create small thumbnail (64x64)
    source_file = Image.open(source_file)
    small_image = source_file.copy()
    sthumb_io = BytesIO()
    label = "thumbnail_small"
    small_thumbnail = small_image.resize((64, 64))
    small_thumbnail.save(sthumb_io, format='PNG', quality=80)
    this_username = request.user.username
    this_uid = request.user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    this_filename = this_username + str(this_uid) + timestamp + label + ".png"
    inmemory_uploaded_file = InMemoryUploadedFile(sthumb_io, None, this_filename, 'image/png', sthumb_io.tell(), None)
    
    return inmemory_uploaded_file

def generate_medium_thumbnail(request, source_file):
    #Create Medium thumbnail (256x256)
    source_file = Image.open(source_file)
    large_image = source_file.copy()
    lthumb_io = BytesIO()
    label = "thumbnail_medium"
    large_thumbnail = large_image.resize((256, 256))
    large_thumbnail.save(lthumb_io, format='PNG', quality=80)
    this_username = request.user.username
    this_uid = request.user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    this_filename = this_username + str(this_uid) + timestamp + label + ".png"
    inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, 'image/png', lthumb_io.tell(), None)
    
    return inmemory_uploaded_file

#Typically used for feed thumbnails
def generate_large_thumbnail(request, source_file):
    #Create large thumbnail (512x512)
    source_file = Image.open(source_file)
    xlarge_image = source_file.copy()
    xthumb_io = BytesIO()
    label = "thumbnail_large"
    xlarge_thumbnail = xlarge_image.resize((512, 512))
    xlarge_thumbnail.save(xthumb_io, format='PNG', quality=80)
    this_username = request.user.username
    this_uid = request.user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    this_filename = this_username + str(this_uid) + timestamp + label + ".png"
    inmemory_uploaded_file = InMemoryUploadedFile(xthumb_io, None, this_filename, 'image/png', xthumb_io.tell(), None)
    
    return inmemory_uploaded_file


def process_image(request, source_image = None, cropped_image = None, is_private = False):

    print("Processing image...")

    #Create new photo instance
    new_photo = Photo(image=source_image)

    new_photo.tiny_thumbnail = generate_tiny_thumbnail(request, cropped_image)
    new_photo.small_thumbnail = generate_small_thumbnail(request, cropped_image)
    new_photo.medium_thumbnail = generate_medium_thumbnail(request, cropped_image)
    new_photo.large_thumbnail = generate_large_thumbnail(request, cropped_image)

    print("Images Cropped")

    new_photo.is_private = is_private
    new_photo.save()

    print("Processing Complete")

    return new_photo
