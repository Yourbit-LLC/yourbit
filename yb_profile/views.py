from django.shortcuts import render
from yb_profile.models import *
from django.views import View
from yb_accounts.models import Account as User

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