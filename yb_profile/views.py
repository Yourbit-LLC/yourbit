from django.shortcuts import render
from yb_profile.models import *
from django.views import View
from django.http import JsonResponse
from yb_accounts.models import Account as User
from main.utility import initialize_session
from yb_customize.models import CustomUI, CustomCore, CustomBit, CustomSplash
from yb_bits.models import Cluster
from django.conf import settings

# Create your views here.
#Profile Page
class ProfileView(View):
    def get(self, request, username, *args, **kwargs):
        this_profile = Profile.objects.get(username = username)
        custom = CustomCore.objects.get(profile = this_profile)
        custom_ui = CustomUI.objects.get(theme = custom.theme)
        custom_splash = CustomSplash.objects.get(theme = custom.theme)

        this_wallpaper = custom.wallpaper
        wallpaper_url = f'{settings.IMAGE_BASE_URL}/{settings.CLOUDFLARE_ACCOUNT_HASH}/{this_wallpaper.background_desktop_id}/desktopCropWallpaper'
        context = {
            "location":"profile",
            "space":"global",
            "sort":"chrono",
            "custom_profile":custom,
            "current_profile":this_profile,
            "custom_ui":custom_ui,
            "custom_splash": custom_splash,
            "profile_view_mode": "live",
            "profile_wallpaper": wallpaper_url,
            
        }
        return render(request, "yb_profile/yb_profile.html", context)

#Page Profile
  
def people_list(request, filter, *args, **kwargs):
    from itertools import chain
    from operator import attrgetter

    this_profile = Profile.objects.get(user = request.user)

    results_list = []
    print(filter)
    #if filter contains fr
    if filter == 'fr-fo-fn':
        friends = this_profile.friends.all().exclude(is_orbit=True)
        followers = this_profile.followers.all().exclude(is_orbit=True)
        following = this_profile.follows.all().exclude(is_orbit=True)
        results_list.append(friends)
        results_list.append(followers)
        results_list.append(following)

    elif filter == 'fr':
        friends = this_profile.friends.all().exclude(is_orbit=True)
        results_list.append(friends)

    elif filter == 'fo':
        followers = this_profile.followers.all().exclude(is_orbit=True)
        results_list.append(followers)

    elif filter == 'fn':
        following = this_profile.follows.all().exclude(is_orbit=True)
        results_list.append(following)

    try:
        connections = sorted(
            chain(results_list), key=attrgetter('display_name'), reverse=False
        )
    except:
        print
        if len(results_list) == 0:
            connections = None
        else:
            connections = results_list[0]

    context = {
        "connections":connections,

    }
    return render(request, "yb_profile/people_list.html", context)

class PeopleViewTemplate(View):
    def get(self, request, *args, **kwargs):
        from itertools import chain
        from operator import attrgetter

        this_profile = Profile.objects.get(username = request.user.active_profile)
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
    

class StuffTemplate(View):
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(username=request.user.active_profile)
        clusters = Cluster.objects.filter(profile=profile)
        if not clusters:
            is_clusters = False
        else :
            is_clusters = True

        context = {
            'is_clusters':is_clusters,
            'clusters':clusters,
            'page_action':"view",
            "bit_page": "stuff"
        }
        return render(request, "yb_bits/yb_stuff.html", context)

class OrbitListTemplate(View):
    def get(self, request, *args, **kwargs):
        from itertools import chain
        from operator import attrgetter

        this_profile = Profile.objects.get(username = request.user.active_profile)
        
        if this_profile.managed_orbits.count() > 0:
            following = this_profile.managed_orbits.all()
        else:
            following = this_profile.follows.filter(is_orbit=True)

        context = {
            "connections":following,
        }

        return render(request, "yb_profile/yb_orbits.html", context)
    
class OrbitSetup(View):

    def get(self, request, *args, **kwargs):
        return render(request, "yb_profile/orbit_setup.html")
    
    def post(self, request, *args, **kwargs):
        
        this_profile = Profile.objects.get(username=request.user.active_profile)

        orbit_name = request.POST.get("name")
        orbit_handle = request.POST.get("username")
        orbit_type = request.POST.get("type")

        new_orbit = Profile(user = request.user, is_orbit=True, display_name = orbit_name, username=orbit_handle, type=orbit_type)
        new_orbit.save()

        this_profile.managed_orbits.add(new_orbit)
        this_profile.save()
      
        #Initialize User Settings Modules
        return JsonResponse({"success": True, "orbit": new_orbit})
    
def history_list(request, filter, *args, **kwargs):

    if filter == "liked":
        from yb_bits.models import BitLike
            
        bit_likes = BitLike.objects.filter(user=request.user).order_by('-time')

        bits = []
        if not bit_likes:
            is_bits = False
        else:
            is_bits = True
            for like in bit_likes:
                bits.append(like.bit)

    if filter == "disliked":
        from yb_bits.models import BitDislike
            
        bit_dislikes = BitDislike.objects.filter(user=request.user).order_by('-time')

        bits = []
        if not bit_dislikes:
            is_bits = False
        else:
            is_bits = True
            for dislike in bit_dislikes:
                bits.append(dislike.bit)

    if filter == "watched":
        from yb_bits.models import InteractionHistory

        profile = Profile.objects.get(username=request.user.active_profile)
        try:
            interaction_history = InteractionHistory.objects.get(profile=profile)

        except:
            interaction_history = InteractionHistory(profile=profile)
            interaction_history.save()

        interactions = interaction_history.watched.all()

        bits = []

        if not interactions:
            is_bits = False
        else:
            is_bits = True
            for interaction in interactions:
                bits.append(interaction)

    if filter == "comments":
        from yb_bits.models import InteractionHistory

        profile = Profile.objects.get(user=request.user)

        try:
            interaction_history = InteractionHistory.objects.get(profile=profile)

        except:
            interaction_history = InteractionHistory(profile=profile)
            interaction_history.save()
        interactions = interaction_history.commented_on.all()

        bits = []

        if not interactions:
            is_bits = False
        else:
            is_bits = True
            for interaction in interactions:
                bits.append(interaction)

    

        
    context = {
        'bits':bits,
        'is_bits':is_bits,
        'click_handler':"yb_viewBit(",
        "bit_page": "history"
    }

    return render(request, "yb_bits/bit_list.html", context)

class HistoryTemplate(View):
    
    def get(self, request, *args, **kwargs):
        from yb_bits.models import BitLike
        this_profile = Profile.objects.get(username=request.user.active_profile)
        bit_likes = BitLike.objects.filter(profile=this_profile).order_by('-time')

        bits = []
        if not bit_likes:
            is_bits = False
        else:
            is_bits = True
            for like in bit_likes:
                bits.append(like.bit)

        context = {
            'bits':bits,
            'is_bits':is_bits,
            'click_handler':"yb_viewBit(",
            "bit_page": "history"
        }

        return render(request, "yb_profile/yb_history.html", context)

class ProfileConnectTemplate(View):
    def get(self, request, id, *args, **kwargs):
        this_profile = Profile.objects.get(id = id)
        user_profile = Profile.objects.get(username = request.user.active_profile)

        follow_button = {}
        friend_button = {}
        block_button = {}

        if user_profile.is_following(this_profile):
            follow_button = {
                "label":"Unfollow",
                "name": "unfollow",
                "type": "profile-connect",
                "object_id": this_profile.id,
                "action":"yb_unfollowUser()",
            }
        else:
            follow_button = {
                "label":"Follow",
                "name": "follow",
                "type": "profile-connect",
                "object_id": this_profile.id,
                "action":f"yb_follow({this_profile.id})",
            }

        if user_profile.is_friends_with(this_profile):
            friend_button = {
                "label":"Unfriend",
                "name": "unfriend",
                "type": "profile-connect",
                "object_id": this_profile.id,
                "action": f"yb_unfriendUser({this_profile.id})",
            }

        else:
            friend_button = {
                "label":"Request Friend",
                "name": "request-friend",
                "type": "profile-connect",
                "object_id": this_profile.id,
                "action": f"yb_friend({this_profile.id})",
            }
        
        if user_profile.is_blocked(this_profile):
            block_button = {
                "label":"Unblock",
                "name": "unblock",
                "type": "profile-connect",
                "object_id": this_profile.id,
                "action":f"yb_unblockUser({this_profile.id})",
            }
        else:
            block_button = {
                "label":"Block",
                "name": "block",
                "type": "profile-connect",
                "object_id": this_profile.id,
                "action":f"yb_blockUser({this_profile.id})",
            }
        menu_name = "profile-connect"

        if user_profile.is_friends_with(this_profile):
        
            option_set = [
                friend_button,
                block_button,
            ]

        else:
            option_set = [
                friend_button,
                follow_button,
                block_button,
            ]

        context = {
            "menu_name":menu_name,
            "current_profile":this_profile,
            "option_set":option_set,
        }

        return render(request, "main/options_menu.html", context)

class ProfileAboutTemplate(View):
    def get(self, request, username, *args, **kwargs):
        this_user = User.objects.get(username = username)
        this_profile = Profile.objects.get(username = this_user.active_profile)
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
                    'view_mode': "live",
                    'start_function': f"yb_navigateToProfile('{request.user.active_profile}')",
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
        
class VisitProfile(View):
    def get(self, request, username, *args, **kwargs):
                     
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
                    'view_mode': "live",
                    'start_function': f"yb_navigateToProfile('{username}')",
                },

            )
        else:
            return render(
                request, 
                "main/index.html",
                {
                    'location': 'home',
                    'space': 'global',
                    'filter': 'p',
                    'sort': '-time',   
                    'view_mode': "live",
                    'start_function': f"yb_navigateToProfile('{username}')",
                },

            )
        
        
def profile_onboarding(request, *args, **kwargs):
    if request.method == "POST":
        this_profile = Profile.objects.get(username = request.user.active_profile)

        this_profile.gender = request.POST.get("gender")
        this_profile.bio = request.POST.get("bio")
        this_profile.motto = request.POST.get("motto")
        this_profile.save()

        return JsonResponse({"status": "success"})
    
    else:
        return JsonResponse({"status": "failed"})
        
class CreateOrbit(View):
    def get(self, request):
        
        return render(request, "yb_profile/create_orbit.html")
       
    
    def post(self, request):
        from yb_profile.api.serializers import ProfileResultSerializer
        from yb_customize.models import CustomCore, Theme
        orbit_name = request.POST.get("name")
        orbit_handle = request.POST.get("username")
        orbit_type = request.POST.get("type")

        this_profile = request.user.owned_profile.first()

        new_orbit = Profile(user=request.user, is_orbit=True, display_name = orbit_name, username = orbit_handle, space_focus=orbit_type)
        new_orbit.save()

        this_profile.managed_orbits.add(new_orbit)
        this_profile.save()

        serialized_data = ProfileResultSerializer(new_orbit).data
        print(serialized_data)
        
        return JsonResponse({"success": True, "orbit": serialized_data})
    
def follow_profile(request, *args, **kwargs):
    if request.method == "POST":
        profile_id = request.POST.get("profile_id")
        this_profile = Profile.objects.get(id = profile_id)
        this_user = Profile.objects.get(username=request.user.active_profile)

        this_user.follows.add(this_profile)
        this_profile.followers.add(this_user)

        this_user.save()
        this_profile.save()

        return JsonResponse({"status": "success"})
    
def block_profile(request, *args, **kwargs):
    if request.method == "POST":
        profile_id = request.POST.get("profile_id")
        this_profile = Profile.objects.get(id = profile_id)
        this_user = Profile.objects.get(username=request.user.active_profile)

        this_user.blocked.add(this_profile)
        
        this_profile.save()

        return JsonResponse({"status": "success"})

def update_profile_info(request, *args, **kwargs):
    if request.method == "POST":
        this_profile = Profile.objects.get(username = request.user.active_profile)
        profile_info = ProfileInfo.objects.get(profile = this_profile)

        this_profile.bio = request.POST.get("bio")
        this_profile.motto = request.POST.get("motto")
        profile_info.save()

        this_profile.save()

        return JsonResponse({"status": "success"})
    
def disconnect_view(request, *args, **kwargs):
    if request.method == "POST":
        profile_id = request.POST.get("id")
        this_profile = Profile.objects.get(id = profile_id)
        this_user = Profile.objects.get(username=request.user.active_profile)

        if this_user.is_friends_with(this_profile):
            this_user.friends.remove(this_profile)
            this_profile.friends.remove(this_user)

        if this_user.is_following(this_profile):
            this_user.follows.remove(this_profile)
            this_profile.followers.remove(this_user)

        this_user.save()
        this_profile.save()

        return JsonResponse({"status": "success"})
    
    else:
        return JsonResponse({"status": "failed"})
    

class CustomProfilePreview(View):
    def post(self, request, *args, **kwargs):
    
        this_profile = Profile.objects.get(user = request.user)

        custom_splash = {}
        
        custom_splash["primary_color"] = request.POST.get("primary_color")

        custom_splash["username_font_color"] = request.POST.get("username_font_color")
        custom_splash["username_font_size"] = request.POST.get("username_font_size")

        custom_splash["name_font_color"] = request.POST.get("name_font_color")
        custom_splash["name_font_size"] = request.POST.get("name_font_size")

        custom_splash["button_text_color"] = request.POST.get("button_text_color")
        custom_splash["button_color"] = request.POST.get("button_color")
        custom_splash["button_shape"] = request.POST.get("button_shape")

        context = {
            "custom_splash":custom_splash,
            "current_profile":this_profile,
            'profile_view_mode': "preview",
        }

        return render(request, "yb_profile/yb_profile_preview.html", context)
    
