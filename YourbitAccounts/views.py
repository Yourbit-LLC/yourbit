from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from YourbitAccounts.forms import RegistrationForm, LoginForm
from django.contrib import messages
from django.views import View
from django.http import JsonResponse, HttpResponse
from user_profile.forms import *
from user_profile.models import Bit, Profile
from settings.models import PrivacySettings
from .models import *
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags

from django.http import FileResponse

# Create your views here.

import random
import string

def generate_verification_token():
    """Generates a random string of characters to use as a verification token."""
    length = 30
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choices(letters_and_digits, k=length))

def generate_verification_key():
    """Generates a random string of characters to use as a verification token."""
    length = 8
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choices(letters_and_digits, k=length))

def registration_view(request):
    context = {}
    if request.POST:
        form = RegistrationForm(request.POST)
        if form.is_valid():
            print("form valid")
            form.save()
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            account = authenticate(email=email, password=raw_password)
            login(request, account)
        
            # Generate a verification token for the user
            verification_key = generate_verification_key()

            # Set the token for the user account and save it to the database
            account.verification_token = verification_key
            account.save()

            # Send a verification email to the user
            subject = 'Yourbit Account Verification'
            
            message = render_to_string('YourbitAccounts/verification_email.html', {
                'user': account,
                'verification_key': verification_key,
                'logo_image':"https://objects-in-yourbit.us-southeast-1.linodeobjects.com/images/logo-flat.png",
            })
            html_message = message
            recipient_list = [account.email]
            from_email = 'no-reply@yourbit.me'
            send_mail(subject, strip_tags(html_message), from_email, recipient_list, html_message=html_message)
            print("Status:\n\nForm Valid")
            return redirect('email_confirmation')

    
        else:
            print("Status:\n\nForm Invalid")
            for field_name, error_messages in form.errors.items():
                print(f"Errors for field '{field_name}': {', '.join(error_messages)}")
            context['registration_form'] = form
            return render(request, 'YourbitAccounts/register.html', context)
        
    else:
        print("Status:\n\nWrong Request Method")
        form = RegistrationForm()
        context['registration_form'] = form
    
        return render(request, 'YourbitAccounts/register.html', context)

class EmailConfirmation(View):
    def get(self, request, *args, **kwargs):
        context={
            "yourbit_logo": "https://objects-in-yourbit.us-southeast-1.linodeobjects.com/images/logo-flat.png",

        }

        return render(request, 'YourbitAccounts/email_confirmation.html', context)
    
    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            this_key = request.POST.get('verification_key')
            user_key = user.verification_token
            if this_key == user_key:
                return redirect('onboarding')
            else:
                return redirect('verify_error')


def terms_view(request):
    template = get_template('YourbitAccounts/yb-terms.html')
    
    return HttpResponse(template.template.source, content_type='text/html')
    
def login_view(request):

    context = {}

    user = request.user
    if user.is_authenticated:
        return redirect('home')

    elif request.subdomain == "support":
        return redirect('support')

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

        color_form = ColorForm(instance=request.user.profile)
        context = {
            'profile_image_form': profile_image_form,
            'background_image_form' : background_image_form,
            'color_form':color_form,


        }
        return render(request, 'YourbitAccounts/onboarding.html', context)

    def post(self, request, *args, **kwargs):
        page = request.POST.get('page')
        page = page
        print(page)
        user_profile = Profile.objects.get(user = request.user)
        if page == "0":
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
            

        if page == "1":
            gender = request.POST.get('gender')
            motto = request.POST.get('motto')
            bio = request.POST.get('bio')
            print(gender)
            user_profile.motto = motto
            user_profile.gender = gender
            user_profile.user_bio = bio
            user_profile.save()


        if page == "2":
            from settings.models import PrivacySettings, MySettings
            user_settings = MySettings.objects.get(user=request.user)
            privacy_settings = PrivacySettings.objects.get(settings=user_settings)
            name_visibility = request.POST.get('name_visibility')
            message_visibility = request.POST.get('message_availability')
            search_visibility = request.POST.get('search_visibility')
            followers_enabled = request.POST.get('followers_enabled')
            print(followers_enabled)
            if followers_enabled == True:
                privacy_settings.enable_followers = True
            else:
                privacy_settings.enable_followers = False
            if name_visibility == True:

                privacy_settings.real_name_visibility = True
            else:
                privacy_settings.real_name_visibility = False

            if message_visibility == "E":

                privacy_settings.message_availability = "E"
            
            elif message_visibility == "FF":
                privacy_settings.message_availability = "FF"
            
            elif message_visibility == "FO":
                privacy_settings.message_availability = "FO"
            
            else:
                privacy_settings.message_availability = "NO"

            if search_visibility == True:
                privacy_settings.search_by_name = True
            
            else:
                privacy_settings.search_by_name = False
            privacy_settings.save()
        
        if page == "3":
            user_colors_on = request.POST.get('user_colors_on')
            primary_color = request.POST.get('primary_color')
            accent_color = request.POST.get('accent_color')
            icon_color = request.POST.get('icon_color')
            feedback_icon_color = request.POST.get('feedback_icon_color')
            title_color = request.POST.get('title_color')
            text_color = request.POST.get('text_color')

            if user_colors_on == True:
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

class ValidateField(View):
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            return redirect('home')
        else:
            return render(request, 'registration/check_result.html')
        
    def post(self, request, *args, **kwargs):
        from YourbitAccounts.models import Account as User
        field = request.POST.get('field')
        print(field)
        value = request.POST.get('value')
            #Validate date of birth, check if date is valid and user is over 13 years of age
        if field == 'dob-field':
            from datetime import datetime
            try:
                print(value)
                dob = datetime.strptime(value, '%Y-%m-%d')
                today = datetime.now()
                age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
                if age < 13:
                    return JsonResponse({'success':False, 'error':'You must be 13 years of age or older to use this service!'})
                else:
                    return JsonResponse({'success':True})
            except ValueError:
                return JsonResponse({'success':False, 'error':'Invalid date of birth!'})
        
        elif field == 'fname-field':
            if len(value) < 2:
                return JsonResponse({'success':False, 'error':'First name must be at least 2 characters long!'})
            else:
                return JsonResponse({'success':True})
            
        elif field == 'lname-field':
            if len(value) < 2:
                return JsonResponse({'success':False, 'error':'Last name must be at least 2 characters long!'})
            else:
                return JsonResponse({'success':True})
        
        elif field == 'email-field':
            email_validator = EmailValidator()
            try:
                email_validator(value)
                if User.objects.filter(email=value).exists():
                    return JsonResponse({'success':False, 'error':'Email already exists!'})
                else:
                    return JsonResponse({'success':True})
            except ValidationError as e:
                return JsonResponse({'success':False, 'error':'Invalid email address!', 'message':e.message})
            
        elif field == 'uname-field':
            if User.objects.filter(username=value).exists():
                return JsonResponse({'success':False, 'error':'Username already exists!'})
            else:
                return JsonResponse({'success':True})
        elif field == 'password1-field':

            try:
                validate_password(value)
                return JsonResponse({'success':True})
            except ValidationError as e:
                return JsonResponse({'success':False, 'error':'Invalid password!'})
        elif field == 'password2-field':
            return JsonResponse({'success':True})  
        else:
            return JsonResponse({"success":"oops nothing happened"})
            

def verify_email(request, token):
    from YourbitAccounts.models import Account as User
    try:
        account = User.objects.get(verification_token=token)
        account.email_confirmed = True
        account.save()
        return redirect('login')
    except:
        return redirect('verify_email_error')


class WelcomeTest(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'registration/welcome.html')