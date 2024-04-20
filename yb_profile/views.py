from django.shortcuts import render
from yb_profile.models import *
from django.views import View
from django.http import JsonResponse
from yb_accounts.models import Account as User
from main.views import initialize_session
from yb_customize.models import CustomUI, CustomCore

# Create your views here.
#Profile Page
class ProfileView(View):
    def get(self, request, username, *args, **kwargs):
        that_user = User.objects.get(username = username)
        this_profile = Profile.objects.get(user = that_user)
        context = {
            "location":"profile",
            "space":"global",
            "sort":"chrono",
            "current_profile":this_profile,
        }
        return render(request, "yb_profile/yb_profile.html", context)

#Page Profile
class OrbitView(View):
    def get(self, request, username, *args, **kwargs):
        this_profile = Orbit.objects.get(handle = username)
        context = {
            "location":"profile",
            "space":"global",
            "sort":"chrono",
            "current_profile":this_profile,
        }
        return render(request, "yb_profile/yb_profile.html", context)

class PeopleListTemplate(View):
    def get(self, request, *args, **kwargs):
        from itertools import chain
        from operator import attrgetter

        this_profile = Profile.objects.get(user = request.user)
        friends = this_profile.friends.all()
        followers = this_profile.followers.all()
        following = this_profile.follows.all()

        try:
            connections = sorted(
                chain(friends, followers, following), key=attrgetter('display_name'), reverse=True
            )
        except:
            connections = None

        context = {
            "connections":connections,

        }
        return render(request, "yb_profile/yb_people.html", context)
    
class FriendRequestTemplate(View):
    def get(self, request, id, *args, **kwargs):

        this_request = FriendRequest.objects.get(id = id)

        context = {
            "friend_request": this_request,
        }

        return render(request, "yb_profile/yb_friend_request.html", context)

class OrbitListTemplate(View):
    def get(self, request, *args, **kwargs):
        from itertools import chain
        from operator import attrgetter

        this_profile = Profile.objects.get(user = request.user)
        
        following = this_profile.followers.filter(is_orbit = True)

        context = {
            "following":following,
        }
        return render(request, "yb_profile/yb_orbits.html", context)

class StuffTemplate(View):
    def get(self, request, *args, **kwargs):

        return render(request, "yb_bits/yb_stuff.html")

class HistoryTemplate(View):
    def get(self, request, *args, **kwargs):

        return render(request, "yb_profile/yb_history.html")
    
class ProfileAboutTemplate(View):
    def get(self, request, username, *args, **kwargs):
        this_user = User.objects.get(username = username)
        this_profile = Profile.objects.get(user = this_user)
        this_info = ProfileInfo.objects.get(profile = this_profile)

        context = {
            "current_profile":this_profile,
            "profile_info": this_info,
        }
        return render(request, "yb_profile/yb_about.html", context)
    
class ProfilePage(View):
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
                    'start_function': f"yb_navigateToProfile('{request.user.username}')",
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
        
class CreateOrbit(View):
       
    
    def post(self, request):
        orbit_name = request.POST.get("name")
        orbit_type = request.POST.get("type")

        this_custom = CustomCore.objects.get(profile = request.user.profile)
        custom_ui = CustomUI.objects.get(theme = this_custom.theme)

        new_orbit = Orbit(profile = request.user.profile, name = orbit_name, type=orbit_type, custom = custom_ui)
        new_orbit.save()

        return JsonResponse({"orbit": new_orbit})
    
