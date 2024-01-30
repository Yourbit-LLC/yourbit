from django.shortcuts import render
#Import bytesIO to create in-memory files
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone
from django.utils import dateformat
from PIL import Image

# Create your views here.
def generate_tiny_thumbnail(request, source_file):
    #Create small thumbnail
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
    #Create small thumbnail
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
    #Create large thumbnail
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

#Typicall used for feed thyumbnails
def generate_large_thumbnail(request, source_file):
    #Create xlarge thumbnail
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
