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
from .models import Account as User
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

def send_confirmation_email(user):
    subject = 'Yourbit Account Verification'
    verification_key = generate_verification_key()
    message = render_to_string('yb_accounts/verification_email.html', {
        'user': user,
        'verification_key': verification_key,
        'logo_image':"https://www.yourbit.me/static/images/main/2023-logo-draft.png", #load image from static
    })
    html_message = message
    recipient_list = [user.email]
    from_email = 'no-reply@yourbit.me'
    send_mail(subject, strip_tags(html_message), from_email, recipient_list, html_message=html_message)
    print("Status:\n\nForm Valid")
    return redirect('interact-terms')

def test_verification_email(request):
    user = request.user
    if user.is_authenticated:
        if user.is_admin:
            send_confirmation_email(user)
            return HttpResponse("Email Sent")
    

def registration_view(request):
    context = {}
    if request.POST:
        form = RegistrationForm(request.POST)
        login_form = LoginForm()
        if form.is_valid():
            print("form valid")
            form.save()
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            account = authenticate(email=str(email).lower(), password=raw_password)
            login(request, account)
        
            # Generate a verification token for the user
            verification_key = generate_verification_key()

            # Set the token for the user account and save it to the database
            account.verification_token = verification_key
            account.active_profile = account.username
            account.save()

            # Send a verification email to the user
            send_confirmation_email(account)
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
        context["login_form"] = LoginForm()
    
        return render(request, 'registration/login.html', context)
    
class ForgotPassword(View):
    def get(self, request, *args, **kwargs):
        context = {}
        return render(request, 'yb_accounts/forgot_password.html', context)
    
    def post(self, request, *args, **kwargs):
        email = request.POST.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return redirect('forgot_password')
        
        verification_key = generate_verification_key()
        user.verification_token = verification_key
        user.save()

        subject = 'Yourbit Password Reset'
        message = render_to_string('yb_accounts/password_reset_email.html', {
            'user': user,
            'verification_key': verification_key,
            'logo_image':"https://objects-in-yourbit.us-southeast-1.linodeobjects.com/images/logo-flat.png",
        })
        html_message = message
        recipient_list = [user.email]
        from_email = 'no-reply@yourbit.me'
        send_mail(subject, strip_tags(html_message), from_email, recipient_list, html_message=html_message)
        return redirect('email_confirmation')
    

class ResetPassword(View):
    def get(self, request, *args, **kwargs):
        context = {}
        return render(request, 'yb_accounts/reset_password.html', context)
    
    def post(self, request, *args, **kwargs):
        email = request.POST.get('email')
        verification_key = request.POST.get('verification_key')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return redirect('forgot_password')
        
        if verification_key == user.verification_token:
            if new_password == confirm_password:
                try:
                    validate_password(new_password)
                except ValidationError as e:
                    return redirect('reset_password')
                
                user.set_password(new_password)
                user.save()
                return redirect('login')
            else:
                return redirect('reset_password')
        else:
            return redirect('reset_password')

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
    context = {
        "document": "yb_accounts/tos.htm",
        "view_mode": "view",
        "document_name": "terms"
    }
    return render(request, 'yb_accounts/yb_doc_viewer.html', context)

def interactive_terms(request):
    context = {

        "document": "yb_accounts/tos.htm",
        "view_mode": "interactive",
        "document_name": "terms"
    }
    return render(request, 'yb_accounts/yb_doc_viewer.html', context)

def terms_accept(request):
    user = request.user
    if user.is_authenticated:
        action = request.POST.get('action')
        #split action by -
        action = action.split("-")
        if action[0] == "accept":

            user.terms_accepted = True
            user.save()

        elif action[0] == "decline":
            
            #delete user account
            user.delete()

        return JsonResponse({'success':'success'})
    else:
        return redirect('login')

def privacy_view(request):
    context = {
        "document": "yb_accounts/privacy_policy.htm",
        "view_mode": "view",
        "document_name": "privacy"
    }
    return render(request, 'yb_accounts/yb_doc_viewer.html', context)

def interactive_privacy(request):
    context = {
        "document": "yb_accounts/privacy_policy.htm",
        "view_mode": "interactive",
        "document_name": "privacy"
    }
    return render(request, 'yb_accounts/yb_doc_viewer.html', context)

def privacy_accept(request):
    user = request.user
    if user.is_authenticated:
        action = request.POST.get('action')
        #split action by -
        action = action.split("-")
        if action[0] == "accept":
            user.privacy_accepted = True
            user.save()

        elif action[0] == "decline":
            user.delete()
        
        return redirect('email_confirmation')
    else:
        return redirect('login')
def login_view(request):
    from main.models import UserSession

    context = {}

    user = request.user
    if user.is_authenticated:
        return redirect('home')
    
    login_form = LoginForm(request.POST)
    registration_form = RegistrationForm()

    if request.POST:
        
        if login_form.is_valid():
            email = request.POST['email']
            password = request.POST['password']
            user = authenticate(email=str(email).lower(), password=password)

            if user:
                login(request, user)
                try: 
                    user_session = UserSession.objects.get(user=user)
                
                except:
                    user_session = UserSession(user=user)
                    user_session.save()
                    
                return redirect('home')

    context['login_form'] = login_form
    context['registration_form'] = registration_form
    return render(request, 'registration/login.html', context)

def logout_view(request):
    logout(request)
    messages.success(request, ("You were logged out"))
    return redirect("home")

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

        privacy_settings = form.save(commit=False)
        privacy_settings.save()

        if form.is_valid():
            
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
                return redirect('customize_profile_view')
            else:
                return redirect('login')
        else:
            print("Form invalid")
            print(form.errors)  # Print form errors
            return redirect('onboarding')

class WelcomeTest(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'main/welcome.html')