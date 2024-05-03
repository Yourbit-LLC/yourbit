from django.shortcuts import render
from django.views.generic import View
    
def cropper_view(request, crop_type, *args, **kwargs):

    return render(request, "image_cropper.html", {"type": crop_type})
    
    