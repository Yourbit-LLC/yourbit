from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.views import View
from django.http import JsonResponse, HttpResponse
from yb_accounts.forms import *
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
            
            message = render_to_string('yb_accounts/verification_email.html', {
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
            return render(request, 'yb_accounts/register.html', context)
        
    else:
        print("Status:\n\nWrong Request Method")
        form = RegistrationForm()
        context['registration_form'] = form
    
        return render(request, 'yb_accounts/register.html', context)

class EmailConfirmation(View):
    def get(self, request, *args, **kwargs):
        context={
            "yourbit_logo": "https://objects-in-yourbit.us-southeast-1.linodeobjects.com/images/logo-flat.png",

        }

        return render(request, 'yb_accounts/email_confirmation.html', context)
    
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
    template = get_template('yb_accounts/yb-terms.html')
    
    return HttpResponse(template.template.source, content_type='text/html')
    
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

class Onboarding(View):
    def get(self, request, *args, **kwargs):
        context = {}
        user = request.user
        if user.is_authenticated:
            if user.onboarding_complete:
                return redirect('home')
            else:
                context['user'] = user
                return render(request, 'yb_accounts/onboarding.html', context)
        else:
            return redirect('login')
    
    def post(self, request, *args, **kwargs):
        from yb_settings.models import MySettings, PrivacySettings
        from yb_settings.forms import ShortPrivacyForm
        from yb_profile.models import Profile
        user = request.user
        user_profile = Profile.objects.get(user=user)

        form = ShortPrivacyForm(request.POST)
        privacy_settings.save()

        if form.is_valid():
            privacy_settings = form.save(commit=False)
            
            print(privacy_settings.display_name)
            if privacy_settings.display_name != "":
                user_profile.display_name = privacy_settings.display_name
            else:
                user_profile.display_name = user.first_name + " " + user.last_name
            
            user_profile.username = user.username
            user_profile.save()

            if user.is_authenticated:
                user.onboarding_complete = True
                user.save()
                return redirect('home')
            else:
                return redirect('login')
        else:
            print("Form invalid")
            print(form.errors)  # Print form errors
            return redirect('onboarding')

class WelcomeTest(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'main/welcome.html')