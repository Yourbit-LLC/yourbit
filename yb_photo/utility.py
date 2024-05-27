from django.shortcuts import render
#Import bytesIO to create in-memory files
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone
from django.utils import dateformat
from PIL import Image, ImageOps, ImageSequence
from .models import Photo

# Create your views here.
def generate_tiny_thumbnail(user, source_file):
    # Open the source file
    source_file = Image.open(source_file)
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

    # Check if the source file is a GIF
    if source_file.format == 'GIF':
        # Create a new BytesIO object for the thumbnail
        lthumb_io = BytesIO()

        # Handle GIF resizing
        frames = ImageSequence.Iterator(source_file)
        new_frames = []
        for frame in frames:
            new_frame = ImageOps.fit(frame.convert('RGBA'), (32, 32), Image.ANTIALIAS)
            new_frames.append(new_frame)

        # Save the new frames as a GIF
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=source_file.info['duration'])

        # Update filename and format
        this_filename = f"{this_username}{this_uid}{timestamp}{label}.gif"
        format = 'image/gif'
    else:
        # Handle non-GIF image resizing
        lthumb_io = BytesIO()
        large_image = source_file.copy()
        squared_image = ImageOps.fit(large_image, (32, 32), Image.ANTIALIAS)
        squared_image.save(lthumb_io, format='PNG', quality=80)
        format = 'image/png'

    # Create InMemoryUploadedFile
    inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

    return inmemory_uploaded_file


def generate_small_thumbnail(user, source_file):
    # Open the source file
    source_file = Image.open(source_file)
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

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
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=source_file.info['duration'])

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

    # Create InMemoryUploadedFile
    inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

    return inmemory_uploaded_file

def generate_medium_thumbnail(user, source_file):
    # Open the source file
    source_file = Image.open(source_file)
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

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
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=source_file.info['duration'])

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

    # Create InMemoryUploadedFile
    inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, format, lthumb_io.tell(), None)

    return inmemory_uploaded_file

def generate_large_thumbnail(user, source_file):
    # Open the source file
    source_file = Image.open(source_file)
    label = "thumbnail_medium"
    this_username = user.username
    this_uid = user.id
    timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
    this_filename = f"{this_username}{this_uid}{timestamp}{label}.png"

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
        new_frames[0].save(lthumb_io, format='GIF', save_all=True, append_images=new_frames[1:], loop=0, duration=source_file.info['duration'])

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

    new_photo.tiny_thumbnail = generate_tiny_thumbnail(user, cropped_image)
    new_photo.small_thumbnail = generate_small_thumbnail(user, cropped_image)
    new_photo.medium_thumbnail = generate_medium_thumbnail(user, cropped_image)
    new_photo.large_thumbnail = generate_large_thumbnail(user, cropped_image)

    print("Images Cropped")

    new_photo.is_private = is_private
    new_photo.save()

    print("Processing Complete")

    return new_photo

