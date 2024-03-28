from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, JsonResponse, FileResponse
from rest_framework.response import Response
from PIL import Image

# Create your views here.
class CustomizeProfile(View):
    def get(self, request):
        return render(request, "yb_customize/editable_profile_splash.html")
    
    def post(self, request):
        pass

from yb_profile.models import Profile, Orbit
from yb_photo.models import Photo
from yb_photo.utility import process_image


class CustomizeMenu(View):
    def get(self, request):
        return render(request, "yb_customize/customize_main.html")
    
    def post(self, request):
        pass


def update_profile_image(request):
    if request.POST.get('class') == 'profile':
        this_profile = Profile.objects.get(user=request.user)
    elif request.POST.get('class') == 'community':
        this_profile = Orbit.objects.get(handle=request.POST.get('handle'))
    else:
        return HttpResponse("Invalid request type")

    source_image = request.FILES.get('image')
    cropped_image = request.FILES.get('cropped_image')

    new_photo = process_image(request, source_image, cropped_image)

    if request.POST.get('class') == 'profile':
        new_photo.profile = this_profile
    elif request.POST.get('class') == 'community':
        new_photo.is_community = True
        new_photo.community_profile = this_profile

    custom_core = this_profile.custom
    custom_core.profile_image = new_photo
    custom_core.save()

    return HttpResponse("success")

def update_profile_background(request):
    from yb_profile.models import Profile, Orbit
    from yb_photo.models import Wallpaper

    wpid = request.POST.get('wpid')
    print("wpid => " + wpid)
    this_profile = None
    profile_class = request.POST.get('class')

    if profile_class == 'profile':
        print("updating user profile")
        this_profile = Profile.objects.get(user = request.user)
        
    elif profile_class == 'orbit':
        print("updating community profile")
        this_profile = Orbit.objects.get(handle = request.POST.get('handle'))
    
    else:
        print("Invalid Entry For Type => " + "'" + profile_class + "'")
        
    if (wpid == "null"):
        print("Existing Wallpaper Not Found \n\n Creating New One...")
        new_wallpaper = Wallpaper()
        this_stage = 1

    else:
        print("Existing Wallpaper Found")
        new_wallpaper = Wallpaper.objects.get(id = wpid)
        this_stage = 2

    source_image = request.FILES.get('image')
    new_wallpaper.background_image = source_image

    custom_core = this_profile.custom
    

    if request.POST.get('name') == 'desktop':
        new_wallpaper.background_desktop = request.POST.get('cropped-image')
        

    elif request.POST.get('name') == 'mobile':
        new_wallpaper.background_mobile = request.POST.get('cropped-image')
    
    new_wallpaper.save()

    custom_core.wallpaper = new_wallpaper
    custom_core.save()

    return JsonResponse({"success": "success", "stage": this_stage, "wpid": new_wallpaper.id})

def get_wallpaper(request, profile_class, type):
    from yb_photo.models import Wallpaper
    from yb_profile.models import Profile, Orbit
    from yb_customize.models import CustomCore

    this_profile = None

    if profile_class == 'profile':
        this_profile = Profile.objects.get(user=request.user)
        custom_core = CustomCore.objects.get(profile=this_profile)
    elif profile_class == 'orbit':
        this_profile = Orbit.objects.get(handle=request.GET.get('handle'))
        custom_core = CustomCore.objects.get(community_profile=this_profile)
    else:
        return HttpResponse("Invalid request type")

    
    

    wallpaper = Wallpaper.objects.get(id=custom_core.wallpaper.id)
    if type == 'mobile':
        wallpaper = wallpaper.background_image
    elif type == 'desktop':
        wallpaper = wallpaper.background_image
    else:
        return HttpResponse("Invalid wallpaper type")

    print("wallpaper => " + str(wallpaper))
    return FileResponse(wallpaper, content_type="image/png")