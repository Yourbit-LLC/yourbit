from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from YourbitAccounts.forms import RegistrationForm, LoginForm
from django.contrib import messages
from django.views import View
from django.http import JsonResponse
from user_profile.forms import *
from user_profile.models import Bit, Profile
from settings.models import PrivacySettings
from .models import *

# Create your views here.
def registration_view(request):
    context = {}
    if request.POST:
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            account = authenticate(email=email, password=raw_password)
            login(request, account)
            return redirect('onboarding')
    
        else:
            context['registration_form'] = form
        
    else:
        form = RegistrationForm()
        context['registration_form'] = form
    
    return render(request, 'YourbitAccounts/register.html', context)

def login_view(request):

    context = {}

    user = request.user
    if user.is_authenticated:
        return redirect('home')

    if request.POST:
        form = LoginForm(request.POST)
        if form.is_valid():
            email = request.POST['email']
            password = request.POST['password']
            user = authenticate(email=email, password=password)

            if user:
                login(request, user)
                return redirect('home')

    else:
        form = LoginForm()
    
    context['login_form'] = form
    return render(request, 'registration/login.html', context)

def logout_view(request):
    logout(request)
    messages.success(request, ("You were logged out"))
    return redirect("login")

class WelcomeView(View):
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            return redirect('home')
        else:
            return render(request, 'registration/welcome.html')

class Onboarding(View):
    def get(self,request, *args, **kwargs):        
        profile_image_form = ProfilePictureUpload()
        background_image_form = BackgroundPictureUpload()
        user_photos = Bit.objects.filter(user = request.user, bit_type="photo")
        color_form = ColorForm(instance=request.user.profile)
        context = {
            'profile_image_form': profile_image_form,
            'background_image_form' : background_image_form,
            'user_photos' : user_photos,
            'color_form':color_form,


        }
        return render(request, 'YourbitAccounts/onboarding.html', context)

    def post(self, request, *args, **kwargs):
        page = request.POST.get('page')
        page = int(page)
        print(page)
        user_profile = Profile.objects.get(user = request.user)
        if page == 0:
            print('images')
            profile_image_form = ProfilePictureUpload(instance=request.user)
            background_image_form = BackgroundPictureUpload(instance=request.user)
            profile_image = request.FILES.get('profile_image')
            background_image = request.FILES.get('background_image')
            if profile_image != None:
                user_profile.image = profile_image
                user_profile.save()
            if background_image != None:
                user_profile.background_image = background_image
                user_profile.save() 
            

        if page == 1:
            gender = request.POST.get('gender')
            bio = request.POST.get('bio')
            user_profile.gender = gender
            user_profile.user_bio = bio
            user_profile.save()


        if page == 2:
            privacy_settings = PrivacySettings.objects.get(user=request.user)
            name_visibility = request.POST.get('name_visibility')
            message_visibility = request.POST.get('message_availability')
            search_visibility = request.POST.get('search_visibility')
            followers_enabled = request.POST.get('followers_enabled')
            if followers_enabled == "on":
                privacy_settings.enable_followers = True
            else:
                privacy_settings.enable_followers = False
            if name_visibility == 'on':

                privacy_settings.real_name_visibility = True
            else:
                privacy_settings.real_name_visibility = False

            if message_visibility == "on":

                privacy_settings.message_availability = True
            
            else:
                privacy_settings.message_availability = False

            if search_visibility == "on":
                privacy_settings.search_by_name = True
            
            else:
                privacy_settings.search_by_name = False
            privacy_settings.save()
        
        if page == 3:
            user_colors_on = request.POST.get('user_colors_on')
            primary_color = request.POST.get('primary_color')
            accent_color = request.POST.get('accent_color')
            icon_color = request.POST.get('icon_color')
            feedback_icon_color = request.POST.get('feedback_icon_color')
            title_color = request.POST.get('title_color')
            text_color = request.POST.get('text_color')

            if user_colors_on == 'on':
                user_profile.user_colors_on = True
            else:
                user_profile.user_colors_on = False
            user_profile.bit_background = primary_color
            user_profile.title_color = title_color
            user_profile.text_color = text_color
            user_profile.accent_color = accent_color
            user_profile.icon_color = icon_color
            user_profile.feedback_icon_color = feedback_icon_color
            user_profile.save()
            
        return JsonResponse({'success':'success'})

