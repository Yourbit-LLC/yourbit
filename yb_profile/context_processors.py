
from django.urls import reverse
from django.contrib.auth import authenticate, login
from yb_settings.models import MySettings

# def CoreUI(request):
#     bit_form = BitForm()
#     search_bar = SearchBar()
#     settings = None
#     default_public = False
    
#     if request.user.is_authenticated:
#         settings = MySettings.objects.get(profile=request.user.profile)
#         default_public = settings.privacy.default_public
    
#     return {
#         'bit_form': bit_form, 
#         'search_bar': search_bar,
#         'default_public': default_public,
#         'settings': settings
#         }

def Customization(request):
    from yb_profile.models import Profile
    from yb_customize.models import CustomCore, CustomBit, CustomUI
    from main.models import UserSession
    if request.user.is_authenticated:

        user_session = UserSession.objects.get(user=request.user)
        user_profile = Profile.objects.get(username=request.user.active_profile)

        if user_session.current_context == "self":
            profile = Profile.objects.get(username=request.user.active_profile)

        else:
            profile = Profile.objects.get(username = request.user.active_profile)
        
        custom = CustomCore.objects.get(profile=profile)
        

        theme = custom.theme
        
        profile_image_object = custom.profile_image

        if profile_image_object.storage_type == "yb":
            profile_image = profile_image_object.image
            profile_thumbnail_small = profile_image_object.small_thumbnail.url
            profile_thumbnail_medium = profile_image_object.medium_thumbnail.url
            profile_thumbnail_large = profile_image_object.large_thumbnail.url
        else:
            profile_image = profile_image_object.ext_url
            profile_thumbnail_small = profile_image_object.small_thumbnail_ext
            profile_thumbnail_medium = profile_image_object.medium_thumbnail_ext
            profile_thumbnail_large = profile_image_object.large_thumbnail_ext
            
        display_name = profile.display_name
        username = profile.user.username
        
        wallpaper_enabled = custom.wallpaper_on
        wallpaper_object = custom.wallpaper
        wallpaper = wallpaper_object.background_image

        try:
            wallpaper_mobile = wallpaper_object.background_mobile
        except:
            wallpaper_mobile = None

        try:
            wallpaper_desktop = wallpaper_object.background_desktop
        except:
            wallpaper_desktop = None


        
        custom_ui = CustomUI.objects.get(theme=theme)

        user_session = UserSession.objects.get(user = request.user)
        user_context = user_session.current_context
        


        context = {
            'profile_image': profile_image,
            'user_profile': user_profile,
            'profile_thumbnail_small': profile_thumbnail_small,
            'profile_thumbnail_medium': profile_thumbnail_medium,
            'profile_thumbnail_large': profile_thumbnail_large,
            'display_name': display_name,
            'username': username,
            'wallpaper': wallpaper,
            'wallpaper_mobile': wallpaper_mobile,
            'wallpaper_desktop': wallpaper_desktop,
            'user_orbits': profile.managed_orbits.all(),
            'custom_core': custom,
            'wallpaper_enabled': wallpaper_enabled,
            'user_custom_ui': custom_ui,
            'active_profile':user_context
        }

        bit_colors_on = custom.bit_colors_on


        if bit_colors_on:
            custom_bit = CustomBit.objects.get(theme=theme)
            context['custom_bit'] = custom_bit

        return context

    else:
        return {}
