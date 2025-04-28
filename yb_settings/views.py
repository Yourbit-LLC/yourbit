from django.shortcuts import render
from main.utility import initialize_session
from django.views import View
from yb_settings.models import *
from yb_profile.models import Profile, ProfileInfo
from django.http import JsonResponse, HttpResponse
# import login required
from django.contrib.auth.decorators import login_required

# Create your views here.

def settings_main(request):
    return render(request, "yb_settings/yb_settings.html")

def settings_profile(request):
    return render(request, "yb_settings/yb_profileInfo.html")

def settings_privacy(request):
    active_profile = Profile.objects.get(username=request.user.active_profile)
    my_settings = MySettings.objects.get(profile = active_profile)
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

@login_required
def change_password(request):
    user = request.user
    old_password = request.POST['old_password']
    new_password = request.POST['new_password']

    if user.check_password(old_password):
        user.set_password(new_password)
        user.save()
        return JsonResponse({"success":True, "message":"Password changed successfully"})
    else:
        return JsonResponse({"success":False, "message":"Incorrect password"})
    


def settings_account(request):
    active_profile = Profile.objects.get(username=request.user.active_profile)
    my_settings = MySettings.objects.get(profile = active_profile)
    privacy = PrivacySettings.objects.get(settings = my_settings)

    context = {
        "real_name_visibility": privacy.real_name_visibility,
    }
    return render(request, "yb_settings/yb_accountSettings.html", context)

def settings_notifications(request):
    active_profile = Profile.objects.get(username=request.user.active_profile)
    my_settings = MySettings.objects.get(profile = active_profile)
    notifications = NotificationSettings.objects.get(settings = my_settings)

    context = {
        "notification_settings": notifications,
        "notifications_enabled": notifications.notifications_enabled,
        'bit_notifications': notifications.bit_notifications,
        "bits_from_friends": notifications.bits_from_friends,
        "bits_from_following": notifications.bits_from_following,
        "bits_from_communities": notifications.bits_from_communities,
        "bit_notify_list": notifications.new_bits_from,
        "bit_likes": notifications.bit_likes,
        "bit_comments": notifications.bit_comments,
        "bit_shares": notifications.bit_shares,
        "bit_mentions": notifications.bit_mentions,
        
    }
    return render(request, "yb_settings/yb_notificationSettings.html", context)

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
                    'start_function': 'yb_navigateTo("2way", "settings-profile"); yb_startBitStream();',    
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
        
    def post(self, request):
        profile = Profile.objects.get(username = request.user.active_profile)
        profile_info = ProfileInfo.objects.get(profile=profile)
        print(request.POST)
        print(request.POST["bio"])
        profile.bio = request.POST['bio']
        profile.motto = request.POST['motto']

        profile.save()
        
        profile_info.email = request.POST['email']
        profile_info.phone_number = request.POST['phone_number']
        profile_info.address = request.POST['address']
        profile_info.website = request.POST['website']

        profile_info.city = request.POST['city']
        profile_info.state = request.POST['state']
        profile_info.country = request.POST['country']

        profile_info.high_school = request.POST['high_school']
        profile_info.year_graduated_hs = request.POST.get('year_graduated_hs') or profile_info.year_graduated_hs
        profile_info.college = request.POST['college']
        profile_info.year_graduated_u = request.POST['year_graduated_u'] or profile_info.year_graduated_u
        profile_info.field_of_study = request.POST['field_of_study']

        profile_info.hometown = request.POST['hometown']
        profile_info.country_of_origin = request.POST['country_of_origin']

        profile_info.religion = request.POST['religion']
        profile_info.place_of_worship = request.POST['place_of_worship']

        profile_info.current_job = request.POST['current_job']
        profile_info.current_role = request.POST['current_role']
        profile_info.year_started = request.POST['year_started'] or profile_info.year_started

        
        profile_info.first_job = request.POST['first_job']
        profile_info.first_role = request.POST['first_role']
        profile_info.first_year_started = request.POST['first_year_started'] or profile_info.first_year_started

        profile_info.save()

        return JsonResponse({"status":"success", "message":"Profile updated"})
    
def profile_settings_template(request):
    return render(request, "yb_settings/yb_profileInfo.html")


def set_all_false(request):
    if request.user.is_admin:
        privacy_settings = PrivacySettings.objects.all()

        for setting in privacy_settings:
            setting.real_name_visibility = 'False'

    else:
        return HttpResponse("You are not an admin")

class SettingsPrivacy(View):
    def get(self, request):
        active_profile = Profile.objects.get(username=request.user.active_profile)
        my_settings = MySettings.objects.get(profile = active_profile)
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
        active_profile = Profile.objects.get(username=request.user.active_profile)
        my_settings = MySettings.objects.get(profile = active_profile)
        privacy = PrivacySettings.objects.get(settings = my_settings)

        context = {
            "real_name_visibility": privacy.real_name_visibility,
        }

        return render(request, "yb_settings/yb_accountSettings.html", context)
    def post(self, request):
        user = request.user
        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.username = request.POST['username']
        user.email = request.POST['email']
        user.phone_number = request.POST['phone_number']
        
        user.save()

        profile = Profile.objects.get(username = request.user.active_profile)
        profile.username = request.POST['username']
        if request.POST['real_name_visibility'] == 'on':
            profile.display_name = request.POST['first_name'] + " " + request.POST['last_name']
        else:
            profile.display_name = request.POST['display_name']
        profile.save()

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

class SettingsNotifications(View):
    def post(self, request):
        active_profile = Profile.objects.get(username=request.user.active_profile)
        my_settings = MySettings.objects.get(profile = active_profile)
        notifications = NotificationSettings.objects.get(settings=my_settings)

        #App Notifications
        notifications.notifications_enabled = True if request.POST.get('notifications_enabled') == 'on' else False
        notifications.app_notifications = True if request.POST.get('app_notifications') == 'on' else False
        notifications.store_notifications = True if request.POST.get('store_notifications') == 'on' else False
        
        #Bit Notifications
        print(request.POST.get('bit_notifications'))
        notifications.bit_notifications = True if request.POST.get('bit_notifications') == 'on' else False
        notifications.bits_from_friends = True if request.POST.get('bits_from_friends') == 'on' else False
        notifications.bits_from_following = True if request.POST.get('bits_from_following') == 'on' else False
        notifications.bits_from_communities = True if request.POST.get('bits_from_communities') == 'on' else False
        # notifications.new_user_bits_from = True if request.POST.get('new_user_bits_from') == 'on' else False
        # notifications.new_orbit_bits_from = True if request.POST.get('new_orbit_bits_from') == 'on' else False
        notifications.bit_likes = True if request.POST.get('bit_likes') == 'on' else False
        notifications.bit_comments = True if request.POST.get('bit_comments') == 'on' else False
        notifications.bit_shares = True if request.POST.get('bit_shares') == 'on' else False
        notifications.bit_mentions = True if request.POST.get('bit_mentions') == 'on' else False
        
        #Batching Settings
        notifications.batched_bit_notifications = True if request.POST.get('batched_bit_notifications') == 'on' else False
        notifications.batched_bit_interval = request.POST.get('batched_bit_interval')

        #Comment Notifications
        notifications.my_bit_comments = True if request.POST.get('my_bit_comments') == 'on' else False
        notifications.my_comment_replies = True if request.POST.get('my_comment_replies') == 'on' else False
        notifications.bits_commented_on = True if request.POST.get('bits_commented_on') == 'on' else False

        #Connection Notifications
        notifications.follow_notifications = True if request.POST.get('follow_notifications') == 'on' else False
        notifications.friend_request_notifications = True if request.POST.get('friend_notifications') == 'on' else False
        notifications.messages_from = request.POST.get('messages_from')

        notifications.save()

        return JsonResponse({"success":True, "message":"Notification settings updated"})
    
def change_password_template(request):
    return render(request, "yb_settings/yb_changePassword.html")


class ClusterSettings(View):
    
    def get(self, request, id = None, *args, **kwargs):
        from yb_bits.models import Cluster
        this_cluster = Cluster.objects.get(id = id)
        return render(request, "yb_settings/yb_clusterSettings.html", {"cluster": this_cluster})

    def post(self, request, id = None, *args, **kwargs):
        from yb_bits.models import Cluster
        this_cluster = Cluster.objects.get(id = id)
        this_cluster.name = request.POST['name']
        this_cluster.description = request.POST['description']
        this_cluster.visibility = request.POST['visibility']
        this_cluster.type = request.POST['type']
        this_cluster.others_can_edit = True if request.POST.get('others_can_edit') == 'on' else False
        this_cluster.save()
        return JsonResponse({"success":True, "message":"Cluster updated"})