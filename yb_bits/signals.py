from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Bit, BitLike, BitDislike # Replace 'YourModel' with the actual model name
from PIL import Image

# @receiver(pre_save, sender=Bit)
# def compress_image(sender, instance, **kwargs):
#     if instance.image:  # Check if the image field is not empty
#         img = Image.open(instance.image.path)
#         img.save(instance.image.path, optimize=True)  # Optimize the image


