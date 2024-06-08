from django.shortcuts import render
from main.views import initialize_session
from django.views import View
from yb_settings.models import *
from yb_profile.models import Profile, ProfileInfo
from django.http import JsonResponse, HttpResponse

# Create your views here.

def settings_main(request):
    return render(request, "yb_settings/yb_settings.html")

def settings_profile(request):
    return render(request, "yb_settings/yb_profileInfo.html")

def settings_privacy(request):
    my_settings = MySettings.objects.get(user = request.user)
    privacy = PrivacySettings.objects.get(settings = my_settings)
    context = {
        'show_reputation': privacy.show_reputation,
        'enable_followers': privacy.enable_followers,
        'searchable': privacy.searchable,
        'real_name_visibility': privacy.real_name_visibility,
        'display_name': privacy.display_name,
        'message_availability': privacy.message_availability,
        'comment_visibility': privacy.comment_visibility,
        'default_public': privacy.default_public,
        'phone_number_visibility': privacy.phone_number_visibility,
        'birthday_visibility': privacy.birthday_visibility,
        'email_visibility': privacy.email_visibility,
        'enable_share': privacy.enable_share,
        'friends_of_friends': privacy.friends_of_friends,
        'friend_count_visibility': privacy.friend_count_visibility,
        'follower_count_visibility': privacy.follower_count_visibility,
    }
    return render(request, "yb_settings/yb_privacySettings.html", context)

def settings_subscription(request):
    return render(request, "yb_settings/yb_subscriptionSettings.html")

def settings_feed(request):
    return render(request, "yb_settings/yb_feedSettings.html")

def settings_account(request):
    return render(request, "yb_settings/yb_accountSettings.html")

def settings_notifications(request):
    return render(request, "yb_settings/yb_notificationSettings.html")

class SettingsElement(View):
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
                    'start_function': 'yb_toggleSettingsMenu(); yb_startBitStream();',    
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
        
class SettingsProfile(View):
    def get(self, request):
        return render(request, "yb_settings/yb_profileInfo.html")
    def post(self, request):
        profile_info = ProfileInfo.objects.get(user = request.user)
        profile = Profile.objects.get(user = request.user)

        profile.display_name = request.POST['display_name']
        profile.bio = request.POST['bio']
        profile.motto = request.POST['motto']
        
        profile_info.email = request.POST['email']
        profile_info.phone_number = request.POST['phone_number']
        profile_info.address = request.POST['address']
        profile_info.website = request.POST['website']

        profile_info.city = request.POST['city']
        profile_info.state = request.POST['state']
        profile_info.country = request.POST['country']

        profile_info.industry = request.POST['industry']

        profile_info.currently_attending_hs = request.POST['currently_attending_hs']
        profile_info.high_school = request.POST['high_school']
        profile_info.year_graduated_hs = request.POST['year_graduated_hs']
        profile_info.currently_attending_u = request.POST['currently_attending_u']
        profile_info.college = request.POST['college']
        profile_info.year_graduated_u = request.POST['year_graduated_u']
        profile_info.field_of_study = request.POST['field_of_study']

        profile_info.hometown = request.POST['hometown']
        profile_info.country = request.POST['country']
        profile_info.country_of_origin = request.POST['country_of_origin']

        profile_info.religion = request.POST['religion']
        profile_info.place_of_worship = request.POST['place_of_worship']

        profile_info.occupation = request.POST['occupation']
        profile_info.company = request.POST['company']
        profile_info.year_started = request.POST['year_started']

        profile_info.relationship_status = request.POST['relationship_status']

        profile_info.save()

class SettingsPrivacy(View):
    def get(self, request):
        my_settings = MySettings.objects.get(user = request.user)
        privacy = PrivacySettings.objects.get(settings = my_settings)
        context = {
            'show_reputation': privacy.show_reputation,
            'enable_followers': privacy.enable_followers,
            'searchable': privacy.searchable,
            'real_name_visibility': privacy.real_name_visibility,
            'display_name': privacy.display_name,
            'message_availability': privacy.message_availability,
            'comment_visibility': privacy.comment_visibility,
            'default_public': privacy.default_public,
            'phone_number_visibility': privacy.phone_number_visibility,
            'birthday_visibility': privacy.birthday_visibility,
            'email_visibility': privacy.email_visibility,
            'enable_share': privacy.enable_share,
            'friends_of_friends': privacy.friends_of_friends,
            'friend_count_visibility': privacy.friend_count_visibility,
            'follower_count_visibility': privacy.follower_count_visibility,
        }
        return render(request, "yb_settings/yb_privacySettings.html", context)
    def post(self, request):
        privacy = PrivacySettings.objects.get(user = request.user)
        privacy.show_reputation = request.POST['show_reputation']
        privacy.enable_followers = request.POST['enable_followers']
        privacy.searchable = request.POST['searchable']
        privacy.real_name_visibility = request.POST['real_name_visibility']
        privacy.display_name = request.POST['display_name']
        privacy.message_availability = request.POST['message_availability']
        privacy.comment_visibility = request.POST['comment_visibility']
        privacy.default_public = request.POST['default_public']
        privacy.phone_number_visibility = request.POST['phone_number_visibility']
        privacy.birthday_visibility = request.POST['birthday_visibility']
        privacy.email_visibility = request.POST['email_visibility']
        privacy.enable_share = request.POST['enable_share']
        privacy.friends_of_friends = request.POST['friends_of_friends']
        privacy.friend_count_visibility = request.POST['friend_count_visibility']
        privacy.follower_count_visibility = request.POST['follower_count_visibility']
        privacy.save()

class AccountSettings(View):
    def get(self, request):
        return render(request, "yb_settings/yb_accountSettings.html")
    def post(self, request):
        user = request.user
        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.username = request.POST['username']
        user.email = request.POST['email']
        user.phone_number = request.POST['phone_number']
        
        user.save()

        return JsonResponse({"success":True, "message":"Account settings updated"})

class ChangePassword(View):
    def get(self, request):
        return render(request, "yb_settings/yb_changePassword.html")
    def post(self, request):
        user = User.objects.get(username = request.user)
        user.set_password(request.POST['password'])
        user.save()


class SettingsFeed(View):
    def get(self, request):
        return render(request, "yb_settings/yb_feedSettings.html")
    def post(self, request):
        feed_settings = FeedSettings.objects.get(user = request.user)
        feed_settings.show_friends = request.POST['show_friends']
        feed_settings.show_following = request.POST['show_following']
        feed_settings.show_communities = request.POST['show_communities']
        feed_settings.show_my_bits = request.POST['show_my_bits']
        feed_settings.show_public = request.POST['show_public']
        feed_settings.show_shared_bits = request.POST['show_shared_bits']
        feed_settings.smart_filters_on = request.POST['smart_filters_on']
        feed_settings.political_suppression_on = request.POST['political_suppression_on']
        feed_settings.news_suppression_on = request.POST['news_suppression_on']
        feed_settings.foul_language_filter_on = request.POST['foul_language_filter_on']
        feed_settings.keywords = request.POST['keywords']
        feed_settings.show_links = request.POST['show_links']
        feed_settings.sort_by = request.POST['sort_by']
        feed_settings.default_space = request.POST['default_space']
        feed_settings.current_space = request.POST['current_space']
        feed_settings.save()
