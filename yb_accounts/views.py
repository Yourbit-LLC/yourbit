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
from yb_api.models import UserAPIKey
from django.http import FileResponse
from yb_profile.models import Profile

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
    user.verification_token = verification_key
    user.save()
    message = render_to_string('yb_accounts/verification_email.html', {
        'user': user,
        'verification_key': verification_key,
        'logo_image':"""
        <?xml version="1.0" encoding="UTF-8"?>
            <svg id="Layer_3" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 493.65 276.27">
            <defs>
                <style>
                @media (prefers-color-scheme: dark){
                .cls-1 {
                    fill: gray;
                    stroke-width: 0px;
                }
                }

                @media (prefers-color-scheme: light) {
                .cls-1 {
                    fill: gray;
                    stroke-width: 0px;
                }
                }
                </style>
            </defs>
            <path class="cls-1" d="m167.41,223.42c-1.39-10.1-4.62-19.17-10.1-27.4-6.84-10.28-15.7-18.36-26.96-23.42-3.82-1.72-5.33-4.51-6.6-7.93-1.92-5.17-2.25-10.67-3.19-16.04-1.44-8.19-2.17-16.47-1.89-24.81.28-8.14,1.08-16.22,2.99-24.16.5-2.08.1-4.2.8-6.34,7.39-22.64,18.81-42.78,36.33-59.17,10.02-9.37,21.35-16.84,33.79-22.61,12.07-5.6,24.78-9.06,37.93-10.67,11.83-1.45,23.68-1.1,35.47.93,22.57,3.89,42.69,13.04,60.39,27.63,2.73,2.25,5.85,4.07,8.17,6.79,5.75,6.73,11.59,13.4,16.46,20.84,6.31,9.64,11.31,19.92,14.78,30.91,3.03,9.61,4.93,19.44,5.67,29.51,1.27,17.38-1.02,34.26-6.54,50.76-.53,1.58-1.29,2.35-2.82,2.94-8.65,3.38-17.16,7.13-25.88,10.33-15.32,5.62-30.75,10.95-46.38,15.69-17.62,5.35-35.42,10.03-53.37,14.07-15.27,3.43-30.6,6.69-46.13,8.83-7.55,1.04-15.04,2.51-22.92,3.32Zm13.95-75.17c-.55.99-.38,1.45-.25,1.93,2.26,7.99,7.22,14.26,13.42,19.36,15.27,12.58,32.98,18.25,52.7,16.61,10.79-.9,21.07-4.15,30.73-9.2,11.67-6.1,20.54-15.03,27.11-26.34.47-.81,1.21-1.67.36-2.87-41.28,12.83-82.69,13.57-124.08.51Zm112.32-57.35c.02-8.1-2.76-15.16-8.07-20.45-4.09-4.07-9.01-4.86-13.17-2.05-2.11,1.43-3.56,3.46-4.58,5.75-3.01,6.77-2.67,13.69-.67,20.61.95,3.29,2.76,6.18,5,8.78,5.55,6.47,13.44,6.07,18.16-.93,2.39-3.54,3.37-7.48,3.32-11.72Zm-69.31-6.91c.08-3.21-.78-6.24-1.91-9.18-1.12-2.93-2.9-5.4-5.66-7.01-4.96-2.88-10.49.33-13.62,3.96-2.4,2.78-4.13,5.97-5.27,9.49-2.45,7.64-2.4,15.06,2.19,21.92,4.05,6.07,11.16,6.58,16.46,1.58,6.02-5.69,7.69-12.92,7.8-20.77Z"/>
            <path class="cls-1" d="m105.43,94.52c-.61,3.7-1.2,7.2-1.76,10.71-.21,1.3-1.26,1.63-2.23,2.09-11.68,5.63-22.92,12.06-33.89,18.93-10.98,6.87-21.5,14.45-31.22,23.03-7.68,6.78-14.74,14.25-20,23.1-3.17,5.34-5.7,11.16-5.51,17.59.13,4.21.97,8.25,3.61,11.89,5.07,6.99,12.11,10.98,19.8,14.33,7.68,3.34,15.78,5.02,24.19,6.9.37-4.86,2.22-9.27,4.32-13.58,3.68-7.51,8.83-13.73,15.94-18.3,5.08-3.26,10.46-5.78,16.38-6.86,16.16-2.96,30.21,1.23,41.97,12.82,8.15,8.03,12.43,17.85,13.38,29.17.93,10.95-2.24,20.82-8.19,29.9-4.59,7-10.89,12.21-18.37,15.61-11.18,5.08-22.81,5.91-34.64,1.84-11.27-3.88-19.79-11.13-25.55-21.37-2.7-4.8-4.79-10.05-5.23-15.72-.11-1.37-.55-2.12-2.17-2.39-11.1-1.85-21.77-5.35-31.85-10.2-7.8-3.76-14.71-9-19.48-16.58-3.73-5.92-5.22-12.19-4.88-19.29.35-7.46,3.07-13.98,6.61-20.1,3.47-6,7.68-11.62,12.53-16.7,11.4-11.92,24.4-21.8,38.2-30.72,14.02-9.07,28.53-17.27,43.67-24.33,1.33-.62,2.45-1.75,4.37-1.78Z"/>
            <path class="cls-1" d="m377.15,176.83c2.07-5.24,3.87-9.85,5.71-14.45.38-.95,1.07-1.5,2.07-1.96,12.68-5.83,24.83-12.66,36.8-19.78,12.56-7.46,24.55-15.84,35.51-25.5,7.1-6.27,13.92-12.95,18.97-21.19,2.9-4.73,5.08-9.7,6.2-15.06,1.55-7.35-.7-13.78-5.76-19.21-1.06-1.13-2.42-1.98-3.56-2.88-8.17,12.52-21.51,14.03-30.31,10.94-10.67-3.75-18.32-13.59-17.2-27.68-2.91-.87-5.99-.94-8.99-1.34-10.55-1.4-21.2-1.47-31.82-1.62-7.81-.11-15.65.02-23.43.68-3.18.27-4.87-.59-6.53-2.96-1.45-2.08-3.26-3.91-5.18-6.17,5.71-.49,10.96-1.11,16.23-1.35,5.82-.27,11.66-.05,17.48-.29,7.05-.29,14.08.13,21.12.31,7.62.2,15.2,1.21,22.76,2.22,1.57.21,2.53-.04,3.55-1.34,6.92-8.84,16.17-11.83,26.82-9.31,11.24,2.66,18.98,12.77,18.81,23.71-.03,2.31.87,3.49,2.66,4.78,7.18,5.16,12.54,12.03,13.94,20.71.99,6.14,1.08,12.64-1.26,18.93-4.4,11.79-11.89,21.31-20.54,30.19-9.9,10.18-21.2,18.53-32.91,26.43-13.17,8.89-27.1,16.42-41.18,23.7-6.32,3.27-12.85,6.12-19.95,9.48Z"/>
            <path class="cls-1" d="m178.93,233.27c61.04-8.7,120.19-24.59,177.57-47.64-.03,2.36-1.3,3.98-2.29,5.61-4.57,7.53-9.81,14.56-15.64,21.2-2.34,2.66-4.35,5.65-7.16,7.81-6.95,5.35-13.81,10.84-21.39,15.32-14.98,8.86-31.07,14.43-48.34,16.68-16.17,2.11-32.16,1.2-47.94-2.79-11.81-2.98-22.92-7.78-33.44-13.94-.81-.47-1.56-.98-1.38-2.27Z"/>
            </svg>""", #load image from static
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
    

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
from yb_systems.services import validate_turnstile_token, is_local_request, get_client_ip

def registration_view(request):
    context = {}
    if request.POST:
        form = RegistrationForm(request.POST)
        login_form = LoginForm()

        #Check if local request
        if not is_local_request(request):
            #Verify turnstile token
            if request.POST.get('cf-turnstile-response'):
                token = request.POST.get('cf-turnstile-response')
                user_ip = get_client_ip(request)
                if not validate_turnstile_token(token, user_ip):
                    return JsonResponse({'status': 'failed', 'message': 'Invalid Turnstile Token'}, status=400)
            else:
                return JsonResponse({'status': 'failed', 'message': 'Invalid Turnstile Token'}, status=400)
                
        if form.is_valid():
            print("form valid")

            #Check if username exists in profile objects
            username = str(form.cleaned_data.get('username'))
            username = username.lower()
            try:
                profile = Profile.objects.get(username=username)
                return JsonResponse({'status': 'failed', 'errors': {'username': 'Profile with this Username already exists.'}}, status=400)
            except Profile.DoesNotExist:
                form.save()

            # Get email and password, authenticate and login
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            account = authenticate(username=username, password=raw_password)
            login(request, account)
        
            # Generate and save verification token
            this_account = User.objects.get(username = username)

            # Send a verification email
            send_confirmation_email(this_account)

            # Respond with success status
            return JsonResponse({'status': 'success', 'message': 'Account created successfully.'})

        else:
            # Collect form errors
            error_list = {}
            for field_name, error_messages in form.errors.items():
                print(f"Errors for field '{field_name}': {', '.join(error_messages)}")
                error_list[field_name] = error_messages

            # Respond with errors and failed status
            return JsonResponse({
                'status': 'failed',
                'message': 'Form Invalid',
                'errors': error_list
            }, status=400)

    # Respond with a method not allowed error if not POST
    return JsonResponse({'status': 'failed', 'message': 'Invalid request method.'}, status=405)

    
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

    #Check if local request
    if not is_local_request(request):
        #Verify turnstile token
        if request.POST.get('cf-turnstile-response'):
            token = request.POST.get('cf-turnstile-response')
            user_ip = get_client_ip(request)
            if not validate_turnstile_token(token, user_ip):
                return JsonResponse(
                    {
                        'status': 'failed', 
                        'message': 'Invalid Turnstile Token'
                    },
                    status=400
                )
        else:
            return JsonResponse(
                {
                    'status': 'failed', 
                    'message': 'Invalid Turnstile Token'
                },
                status=400
            )
            

    if request.POST:
        
        if login_form.is_valid():
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=str(username).lower(), password=password)

            if user:
                login(request, user)

                try: 
                    user_session = UserSession.objects.get(user=user)
                
                except:
                    user_session = UserSession(user=user)
                    user_session.save()
                    
                return JsonResponse({'status': 'success', 'message': 'Login Successful'}, status=200)

    return JsonResponse({'status': 'failed', 'message': 'Check your username and password combination and try again.'}, status=400)

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
        user_profile = Profile.objects.get(username=user.active_profile)
        

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


class RequestAPIKey(View):
    
    def get(self, request, *args, **kwargs):
        context = {}
        return render(request, 'yb_accounts/request_api_key.html', context)
    
    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            this_profile = Profile.objects.get(username=user.active_profile)
            this_name = request.POST.get('name')
            api_key, key = UserAPIKey.objects.create_key(name=this_name, profile=this_profile)
            user_api_key = UserAPIKey.objects.get_from_key(key)
            return JsonResponse({'status': 'success', 'message': 'API key created successfully.', 'response': key})
        else:
            return JsonResponse({'status': 'failed', 'message': 'User not authenticated.'}, status=401)
        

        
def validate_field(request, field, *args, **kwargs):
    if field == "username":
        username = request.POST.get('field_value')
        try:

            user = User.objects.get(username=username)
            if user == request.user:
                return JsonResponse({'status': 'success', 'message': 'is_default'})
            else:
                return JsonResponse({'status': 'failed', 'message': 'Profile with this Username already exists.'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'success', 'message': 'Username available.'})
        
    elif field == "email":
        email = request.POST.get('field_value')
        try:
            user = User.objects.get(email=email)
            return JsonResponse({'status': 'failed', 'message': 'Profile with this Email already exists.'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'success', 'message': 'Email available.'})
        


class LoginPage(View):
    def get(self, request, *args, **kwargs):
        return render(request,'registration/login_form.html')

class SignupPage(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'registration/signup_form.html')
