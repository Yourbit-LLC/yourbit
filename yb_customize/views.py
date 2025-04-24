from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, JsonResponse, FileResponse
from rest_framework.response import Response
from PIL import Image
from main.utility import initialize_session
from yb_customize.models import *
from django.utils import timezone, dateformat
import requests
import environ

env = environ.Env()
environ.Env.read_env()


# Create your views here.
class CustomizeProfile(View):
    def get(self, request):
        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile = profile_object)
        theme = custom_core.theme
        custom_splash = CustomSplash.objects.get(theme = theme)
        
        context = {
            'custom_splash': custom_splash,
        }
        return render(request, "yb_customize/profile_editor/editable_profile_splash.html", context)
    
    def post(self, request):
        profile_object = Profile.objects.get(username = request.user.active_profile)
        custom_core = CustomCore.objects.get(profile = profile_object)
        theme = custom_core.theme
        custom_splash = CustomSplash.objects.get(theme = theme)

        custom_splash.primary_color = request.POST.get('splash_color')
        custom_splash.username_font_color = request.POST.get('username_font_color')
        custom_splash.username_font_size = request.POST.get('username_font_size')
        custom_splash.name_font_color = request.POST.get('name_font_color')
        custom_splash.name_font_size = request.POST.get('name_font_size')
    
        custom_splash.button_text_color = request.POST.get('button_text_color')
        # custom_splash.button_text_size = request.POST.get('button_text_size')
        custom_splash.button_shape = request.POST.get('button_shape')
        custom_splash.button_color = request.POST.get('button_color')
        
        custom_splash.save()

        context = {
            'custom_splash': custom_splash,
        }
        return HttpResponse("success")
    
        

from yb_profile.models import Profile
from yb_photo.models import Photo
from yb_photo.utility import process_image, modify_image

class CustomizeMain(View):
    def get(self, request, *args, **kwargs):
                                
        if request.user.is_authenticated:
            init_params = initialize_session(request)
            return render(
                request, 
                "main/index.html",
                {
                    'first_login': request.user.first_login,
                    'location': init_params['last_location'],
                    'space': init_params['current_space'],
                    'filter': init_params['filter_chain'],
                    'sort': init_params['sort_by'],   
                    'start_function': "yb_navigateTo('content-container', 'customize-main');",    
                },

            )

def toggle_flat_mode(request):
    profile_object = Profile.objects.get(username=request.user.active_profile)
    custom_core = CustomCore.objects.get(profile=profile_object)
    custom_core.flat_mode_on = not custom_core.flat_mode_on
    if custom_core.ui_colors_on == True:
        custom_core.ui_colors_on = False
    if custom_core.bit_colors_on == True:
        custom_core.bit_colors_on = False
    custom_core.save()

    return JsonResponse({"success": "success"})
        

def complete_tutorial(request, type):
    profile_object = Profile.objects.get(username=request.user.active_profile)
    custom_core = CustomCore.objects.get(profile = profile_object)
    custom_core.splash_tutorial_complete = True
    custom_core.save()
    
    return JsonResponse({"success": "success"})

class CustomizeMenu(View):
    def get(self, request):
        return render(request, "yb_customize/main_page/customize_main.html")
    
    def post(self, request):
        pass

class ProfileImageUpload(View):
    def get(self, request):
        profile_object = Profile.objects.get(username = request.user.active_profile)
        custom_core = CustomCore.objects.get(profile = profile_object)
        theme = custom_core.theme
        custom_ui = CustomUI.objects.get(theme = theme)
        return render(request, "yb_customize/profile_images/profile_image_edit.html", context = {"custom_ui": custom_ui})
    
    def post(self, request):
        pass
    
def update_profile_image(request):
    if request.POST.get('class') == 'profile':
        this_profile = Profile.objects.get(username=request.user.active_profile)
    else:
        return HttpResponse("Invalid request type")

    source_image = request.FILES.get('photo')
    crop_data = request.POST.get('crop_data')

    new_photo = modify_image('profile', request.user, source_image, crop_data)

    if request.POST.get('class') == 'profile':
        new_photo.profile = this_profile
    elif request.POST.get('class') == 'community':
        new_photo.is_community = True
        new_photo.community_profile = this_profile

    custom_core = this_profile.custom
    custom_core.profile_image = new_photo
    custom_core.save()

    return HttpResponse("success")

class CreateTheme(View):
    def get(self, request):
        return render(request, "yb_customize/themes/create_theme.html")
    
    def post(self, request):
        new_theme = Theme(
            name=request.POST.get('name'), 
            author=request.user, 
            description=request.POST.get('description'),
            visibility=request.POST.get('visibility'),
        )
        new_theme.save()

        return JsonResponse({"success": "success"})
    

def get_wallpaper(request, profile_class, type):
    from yb_photo.models import Wallpaper
    from yb_profile.models import Profile
    from yb_customize.models import CustomCore

    this_profile = None

    if profile_class == 'profile':
        this_profile = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=this_profile)
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

def update_wallpaper_settings(request):
    profile_object = Profile.objects.get(username=request.user.active_profile)
    custom_core = CustomCore.objects.get(profile=profile_object)
    if request.POST.get('action') == 'brightness':
        custom_core.wallpaper_brightness = request.POST.get('value')

    elif request.POST.get('action') == 'blur':
        custom_core.wallpaper_blur = request.POST.get('value')

    try:
        custom_core.save()
        return JsonResponse({"success": "success"})
    except:
        return JsonResponse({"error": "error"})
    
def toggle_only_my_colors(request):
    profile_object = Profile.objects.get(username=request.user.active_profile)
    custom_core = CustomCore.objects.get(profile=profile_object)
    custom_core.only_my_colors = not custom_core.only_my_colors

    if custom_core.ui_colors_on == False:
        custom_core.ui_colors_on = True

    if custom_core.bit_colors_on == False:
        custom_core.bit_colors_on = True

    custom_core.save()

    return JsonResponse({"success": "success"})

def toggle_custom_ui(request):
    profile_object = Profile.objects.get(username=request.user.active_profile)
    custom_core = CustomCore.objects.get(profile=profile_object)
    custom_core.ui_colors_on = not custom_core.ui_colors_on

    if custom_core.flat_mode_on == True:
        custom_core.flat_mode_on = False

    custom_core.save()

    return JsonResponse({"success": "success"})   

def toggle_custom_bits(request):
    profile_object = Profile.objects.get(username=request.user.active_profile)
    custom_core = CustomCore.objects.get(profile=profile_object)
    custom_core.bit_colors_on = not custom_core.bit_colors_on
    custom_core.save()

    if custom_core.flat_mode_on == True:
        custom_core.flat_mode_on = False

    return JsonResponse({"success": "success"})

def toggle_wallpaper(request):
    profile_object = Profile.objects.get(username=request.user.active_profile)
    custom_core = CustomCore.objects.get(profile=profile_object)
    custom_core.wallpaper_on = not custom_core.wallpaper_on

    if custom_core.flat_mode_on == True:
        custom_core.flat_mode_on = False

    custom_core.save()

    return JsonResponse({"success": "success"})


class CustomizeUI(View):
    def get(self, request):
        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
        theme = custom_core.theme
        custom_ui = CustomUI.objects.get(theme=theme)
        context = {
            'custom_core': custom_core,
            'primary_color': custom_ui.primary_color,
            'button_color': custom_ui.button_color,
            'icon_color': custom_ui.icon_color,
            'button_text_color': custom_ui.button_text_color,
            'text_color': custom_ui.text_color,
            'title_color': custom_ui.title_color,
        }
        return render(request, "yb_customize/ui_editor/customize_ui.html", context)
    
    def post(self, request):
        pass

class CustomizeBit(View):
    def get(self, request):
        return render(request, "yb_customize/bit_editor/bit_editor_base.html")
    
    def post(self, request):
        pass


def user_custom_repair(request):
    failures = 0
    successes = 0

    for user in User.objects.all():
        user_profile = Profile.objects.get(username=user.active_profile)
        try:
            custom_core = CustomCore.objects.get(profile=user_profile)
            theme = custom_core.theme
            custom_ui = CustomUI.objects.get(theme=theme)
            successes += 1

        except:
            failures += 1
            custom_core = CustomCore.objects.get(profile=user_profile)
            theme = custom_core.theme
            custom_ui = CustomUI.objects.create(theme=theme)
            custom_ui.save()

    return JsonResponse({"successes": successes, "failures": failures})

def user_custom_repair_bits(request):
    failures = 0
    successes = 0

    for user in User.objects.all():
        user_profile = Profile.objects.get(username=user.active_profile)
        try:
            custom_core = CustomCore.objects.get(profile=user_profile)
            theme = custom_core.theme
            custom_bit = CustomBit.objects.get(theme=theme)
            successes += 1

        except:
            failures += 1
            custom_core = CustomCore.objects.get(profile=user_profile)
            theme = custom_core.theme
            custom_bit = CustomBit.objects.create(theme=theme)
            custom_bit.save()

    return JsonResponse({"successes": successes, "failures": failures})


class CustomizeBitView(View):  
    def get(self, request):
        if request.user.is_authenticated:
            init_params = initialize_session(request)
            return render(
                request, 
                "main/index.html",
                {
                    'first_login': request.user.first_login,
                    'location': init_params['last_location'],
                    'space': init_params['current_space'],
                    'filter': init_params['filter_chain'],
                    'sort': init_params['sort_by'],   
                    'start_function': 'customize_bit_url()',    
                },

            )
        
        else:
            from yb_accounts.forms import RegistrationForm, LoginForm
            registration_form = RegistrationForm()
            login_form = LoginForm()
            return render(
                request,
                "registration/login.html",
                {
                    'state': 'home',
                    'registration_form': registration_form,
                    'login_form': login_form,
                }
            )
    
    def post(self, request):
        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
        theme = custom_core.theme
        custom_bit = CustomBit.objects.get(theme=theme)

        custom_bit.primary_color = request.POST.get('primary_color')
        custom_bit.button_color = request.POST.get('button_color')
        custom_bit.icon_color = request.POST.get('icon_color')
        custom_bit.text_color = request.POST.get('text_color')
        custom_bit.title_color = request.POST.get('title_color')
        custom_bit.save()

        return JsonResponse({"success": "success"})



class CustomizeUIView(View):
    def get(self, request):
        if request.user.is_authenticated:
            init_params = initialize_session(request)
            return render(
                request, 
                "main/index.html",
                {
                    'first_login': request.user.first_login,
                    'location': init_params['last_location'],
                    'space': init_params['current_space'],
                    'filter': init_params['filter_chain'],
                    'sort': init_params['sort_by'],   
                    'start_function': 'customize_ui_url()',    
                },

            )
        
        else:
            from yb_accounts.forms import RegistrationForm, LoginForm
            registration_form = RegistrationForm()
            login_form = LoginForm()
            return render(
                request,
                "registration/login.html",
                {
                    'state': 'home',
                    'registration_form': registration_form,
                    'login_form': login_form,
                }
            )
    
    def post(self, request):
        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
        theme = custom_core.theme
        try:
            custom_ui = CustomUI.objects.get(theme=theme)

        except:
            custom_ui = CustomUI(theme=theme)

        custom_ui.primary_color = request.POST.get('primary_color')
        custom_ui.button_color = request.POST.get('button_color')
        custom_ui.icon_color = request.POST.get('icon_color')
        custom_ui.button_text_color = request.POST.get('button_text_color')
        custom_ui.text_color = request.POST.get('text_color')
        custom_ui.title_color = request.POST.get('title_color')
        custom_ui.save()

        return HttpResponse("success")
    
class CustomizeProfileView(View):
    def get(self, request):
        if request.user.is_authenticated:
            init_params = initialize_session(request)
            
            return render(
                request, 
                "main/index.html",
                {
                    'first_login': request.user.first_login,
                    'location': init_params['last_location'],
                    'space': init_params['current_space'],
                    'filter': init_params['filter_chain'],
                    'sort': init_params['sort_by'],   
                    'start_function': 'customize_profile_splash_url();',    
                },

            )
        
        else:
            from yb_accounts.forms import RegistrationForm, LoginForm
            registration_form = RegistrationForm()
            login_form = LoginForm()
            return render(
                request,
                "registration/login.html",
                {
                    'state': 'home',
                    'registration_form': registration_form,
                    'login_form': login_form,
                }
            )
    def post(self, request):
        pass

class WallpaperUpload(View):
    def get(self, request):

        
        return render(request, "yb_customize/wallpapers/wallpaper_edit.html")
    
    def post(self, request):
        pass

def retrieve_sticker_list(query=None):
        api_key = env("GIPHY_API_KEY")
        if query:
            giphy_url = f'https://api.giphy.com/v1/stickers/search?api_key={api_key}&q={query}&limit=25&offset=0&rating=g&lang=en'
        else:
            giphy_url = f'https://api.giphy.com/v1/stickers/trending?api_key={api_key}&limit=25&offset=0&rating=g&bundle=messaging_non_clips'
        
        response = requests.get(giphy_url)
        data = response.json()
        
        
        data = data['data']

        

        sticker_list = []
        sticker_iteration = 0

        #For each key in data
        for item in data:
            print('\n\n' + str(sticker_iteration) + '\n\n')
            print(item)
            
            
            sticker_list.append({
                "url": item['images']['original']['url'],
                "title": item['title'],
                "id": item['id'],
                "username": item['username'],
            
            })
            sticker_iteration += 1



        is_stickers = True

        print(sticker_list)

        return sticker_list, is_stickers

class StickerList(View):
    def get(self, request, query=None):
        #Make API Request to giphy for random list

        
        print('\n\n\n')
        print("Retrieving search results for " + query)
        sticker_response = retrieve_sticker_list(query)

        context = {
            'sticker_list': sticker_response[0],
            'is_stickers': sticker_response[1],
        }


        return render(request, "yb_customize/profile_editor/drawers/sticker_list.html", context)
    
    def post(self, request):
        pass

class StickerBrowse(View):
    def get(self, request):
        query = request.GET.get('query')
        sticker_response = retrieve_sticker_list(query)

        context = {
            'sticker_list': sticker_response[0],
            'is_stickers': sticker_response[1],
        }

        return render(request, "yb_customize/profile_editor/drawers/sticker_browser.html", context)
    
    def post(self, request):
        pass



def edit_profile_image(request, *args, **kwargs):
    if request.user.is_authenticated:
        color_overlay = request.POST.get('color_overlay')
        overlay_strength = request.POST.get('overlay_strength')
        enable_transparency = request.POST.get("enable_transparency")
        enable_border = request.POST.get("enable_border")
        border_color = request.POST.get("border_color")

        if enable_border == "true":
            enable_border = True
        else:
            enable_border = False

        if enable_transparency == "true":
            enable_transparency = True

        else:
            enable_transparency = False

        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
        custom_core.image_overlay_color = color_overlay
        custom_core.image_overlay_strength = overlay_strength
        custom_core.image_transparency = enable_transparency
        
        if enable_border == True:
            custom_core.image_border_style = "solid"

        else:
            custom_core.image_border_style = "none"

        custom_core.image_border_color = border_color

        custom_core.save()

        return HttpResponse("success")

def edit_wallpaper_image(request, *args, **kwargs):
    if request.user.is_authenticated:

        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
     
        color_overlay = request.POST.get('color_overlay')
        overlay_strength = request.POST.get('overlay_strength')
        brightness = request.POST.get('brightness')
        blur_amount = request.POST.get('blur_amount')

        
        custom_core.wallpaper_blur = blur_amount
        custom_core.wallpaper_brightness = brightness
        custom_core.wallpaper_color = color_overlay
        custom_core.wallpaper_overlay_strength = overlay_strength

        custom_core.save()

class SplashFontEdit(View):
    def get(self, request, option):
        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
        try:
            custom_splash = CustomSplash.objects.get(theme = custom_core.theme)
        except:
            custom_splash = CustomSplash(theme = custom_core.theme)
            custom_splash.save()

    
        template = 'text_font_edit'



        context = {
            'text_color': custom_splash.username_font_color,
            'text_size':  custom_splash.username_font_size,
            'title_color': custom_splash.name_font_color,
            'title_size': custom_splash.name_font_size,
        }
        return render(request, f"yb_customize/profile_editor/drawers/{template}.html", context)
    
    def post(self, request, option):
        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
        custom_ui = CustomUI.objects.get(theme = custom_core.theme)
        custom_ui.font = request.POST.get('font')
        custom_ui.save()

        return JsonResponse({"success": "success"})
    
class SplashButtonEdit(View):
    def get(self, request):
        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
        try:
            custom_splash = CustomSplash.objects.get(theme = custom_core.theme)

        except:
            custom_splash = CustomSplash(theme = custom_core.theme)
            custom_splash.save()

        context = {
            'button_color': custom_splash.button_color,
            'button_text_color': custom_splash.button_text_color,
            'button_shape': custom_splash.button_shape,
            'text_size': custom_splash.button_text_size,
            'button_border_style': custom_splash.button_border_style,
            'button_border_color': custom_splash.button_border_color,
        }
        return render(request, "yb_customize/profile_editor/drawers/profile_button_edit.html", context)
    
    def post(self, request):
        profile_object = Profile.objects.get(username=request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=profile_object)
        custom_ui = CustomUI.objects.get(theme = custom_core.theme)
        custom_ui.button_color = request.POST.get('button_color')
        custom_ui.button_text_color = request.POST.get('button_text_color')

        custom_ui.save()

        return JsonResponse({"success": "success"})
