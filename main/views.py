from django.shortcuts import render
from django.views import View
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth import authenticate, login, logout
from yb_accounts.models import Account as User
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import *
from main.utility import initialize_session

# Create your views here.

def fix_user_sessions(request):
    if request.user.is_admin:
        for user in User.objects.all():
            new_session = UserSession.objects.create(user=user)
            new_session.save()

    return HttpResponse("Success")

def index(request, *args, **kwargs):



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
                'start_function': '',    
            },

        )
    else:
        return render(
            request, 
            "main/index.html",
            {
                'space': 'global',
                'filter': 'p',
                'sort': '-time',    
                'start_function': '',    
            },

        )
        
def sign_up(request, *args, **kwargs):
    from yb_accounts.forms import RegistrationForm
    registration_form = RegistrationForm()
    return render(
        request,
        "main/welcome.html",
        {
            'state': 'sign_up',
            'registration_form': registration_form,
        }
    )

# Create your views here.
def create_menu_template(request, *args, **kwargs):
    return render(request, "main/create_menu.html")

def create_bit_template(request, *args, **kwargs):
    
    return render(request, "yb_bits/bit_builder/yb_bitBuilder.html", {"build_mode":"create"})

def create_cluster_template(request, *args, **kwargs):
    return render(request, "yb_bits/create_cluster.html")
    
class CreateElement(View):
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
                    'start_function': 'yb_toggleCreateMenu(); yb_startBitStream();',    
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
def change_user_perspective(request, *args, **kwargs):

    this_user = request.user
    this_user.active_profile = request.POST.get('username')
    this_user.save()

    return HttpResponse("success")

def child_safety_policy(request, *args, **kwargs):
    return render(request, "main/child_safety_policy.html", {
        'title': "Child Safety Policy",
        'content': "This is the child safety policy content.",
    })