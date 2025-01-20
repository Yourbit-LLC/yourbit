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
def generate_bs_filter_chain(feed_settings):
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

    return filter_chain

def update_bs_filter_chain(profile, filter_chain):
    from yb_settings.models import FeedSettings, MySettings
    from yb_profile.models import Profile

    my_settings = MySettings.objects.get(profile=profile)
    feed_settings = FeedSettings.objects.get(settings=my_settings)

    #Update filter chain
    if 'fr' in filter_chain:
        feed_settings.show_friends = True
    else:
        feed_settings.show_friends = False
    
    if 'fo' in filter_chain:
        feed_settings.show_following = True
    else:
        feed_settings.show_following = False
    
    if 'co' in filter_chain:
        feed_settings.show_communities = True
    else:
        feed_settings.show_communities = False

    if 'p' in filter_chain:
        feed_settings.show_public = True
    else:
        feed_settings.show_public = False

    if 'me' in filter_chain:
        feed_settings.show_my_bits = True
    else:
        feed_settings.show_my_bits = False

    feed_settings.save()



def initialize_session(request):
    from yb_settings.models import MySettings, FeedSettings
    from yb_systems.models import TaskManager
    from yb_profile.models import Profile
    print(request)
    this_user = request.user
    active_profile = Profile.objects.get(username=this_user.active_profile)
    these_settings = MySettings.objects.get(profile=active_profile)
    this_state = TaskManager.objects.get(user=active_profile)
    last_location = this_state.current_location
    
    #Get active feed settings
    feed_settings = FeedSettings.objects.get(settings=these_settings)
    default_space = feed_settings.default_space

    if default_space == 'auto':
        current_space = feed_settings.current_space

    else:
        current_space = default_space
    
    sort_by = feed_settings.sort_by

    #Build filter chain
    filter_chain = generate_bs_filter_chain(feed_settings)

    return {
        "last_location": last_location,
        "current_space": current_space, 
        "sort_by": sort_by, 
        "filter_chain": filter_chain
    }

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