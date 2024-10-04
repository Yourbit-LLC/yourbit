from django.shortcuts import render
from django.views import View
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth import authenticate, login, logout
from yb_accounts.models import Account as User
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import *

# Create your views here.
def initialize_session(request):
    from yb_settings.models import MySettings, FeedSettings
    from yb_systems.models import TaskManager
    print(request)
    this_user = request.user
    these_settings = MySettings.objects.get(user=this_user)
    this_state = TaskManager.objects.get(user=this_user)
    last_location = this_state.last_location
    
    #Get active feed settings
    feed_settings = FeedSettings.objects.get(settings=these_settings)
    default_space = feed_settings.default_space

    if default_space == 'auto':
        current_space = feed_settings.current_space

    else:
        current_space = default_space
    
    sort_by = feed_settings.sort_by

    #Build filter chain
    filter_chain = ""
    if feed_settings.show_friends:
        filter_chain += '-fr'
    
    if feed_settings.show_following:
        filter_chain += '-fo'
    
    if feed_settings.show_communities:
        filter_chain += '-co'

    if feed_settings.show_public:
        filter_chain += '-p'

    if feed_settings.show_my_bits:
        filter_chain += '-me'

    return {
        "last_location": "home",
        "current_space": current_space, 
        "sort_by": sort_by, 
        "filter_chain": filter_chain
    }



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
    
    return render(request, "yb_bits/yb_bitBuilder.html", {"build_mode":"create"})

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

    user_session = UserSession.objects.get(user=request.user)
    user_session.current_context = request.POST.get('username')
    user_session.save()

    return HttpResponse("success")