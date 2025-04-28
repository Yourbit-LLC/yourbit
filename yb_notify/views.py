from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.contrib.auth import authenticate, login, logout
from yb_accounts.models import Account as User
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from main.utility import initialize_session
import webpush

# Create your views here.
class GetNotifications(View):
    def get(self, request):
        return render(request, "yb_notify/notifications.html")
    
    def post(self, request):
        pass

def click_notification(request, notification_id):
    from yb_profile.models import Profile
    from .models import NotificationCore
    this_profile = Profile.objects.get(username=request.user.active_profile)
    notification_core = NotificationCore.objects.get(profile=this_profile)
    notification = notification_core.unseen_notifications.get(id=notification_id)

    if notification.type == 3:
        this_bit = notification.bit

        context = {
            "bit": this_bit,
            "comment": notification.comment,

        }
        return render(request, "yb_bits/bit_focus.html", context)

    notification_core.unseen_notifications.remove(notification)
    notification_core.seen_notifications.add(notification)

    return HttpResponse("Success")

def notifications_html(request):
    from yb_profile.models import Profile
    from .models import NotificationCore
    this_profile = Profile.objects.get(username=request.user.active_profile)
    notification_core = NotificationCore.objects.get(profile=this_profile)
    unseen_notifications = notification_core.unseen_notifications.all().order_by('-time')
    seen_notifications = notification_core.seen_notifications.all().order_by('-time')

    #chain together seen and unseen notificaitons
    notifications = unseen_notifications | seen_notifications

    context = {
        'results': notifications,
    }

    return render(request, "yb_notify/notifications.html", context)

def notification_list(request, filter, *args, **kwargs):
    from yb_profile.models import Profile
    from .models import NotificationCore
    #Get show seen from request params
    show_seen = request.GET.get('seen', False)
    this_profile = Profile.objects.get(username=request.user.active_profile)
    notification_core = NotificationCore.objects.get(profile=this_profile)

    if filter == 'all':
        unseen_notifications = notification_core.unseen_notifications.all().order_by('-time')
        if show_seen:
            seen_notifications = notification_core.seen_notifications.all().order_by('-time')
            notifications = unseen_notifications | seen_notifications
        else:
            notifications = unseen_notifications

    else:
        unseen_notifications = notification_core.unseen_notifications.filter(notify_class=int(filter)).order_by('-time')
        if show_seen:
            seen_notifications = notification_core.seen_notifications.filter(notify_class=int(filter)).order_by('-time')
            notifications = seen_notifications | unseen_notifications
        else:
            notifications = unseen_notifications

    context = {
        'results': notifications,
    }

    return render(request, "yb_notify/notification_list.html", context)






class NotificationPage(View):
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
                    'start_function': 'yb_startBitStream(); yb_handleNotificationsClick();',    
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
        

# def checkSubscription(request):
#     from webpush.models import SubscriptionInfo, PushInformation

#     is_subscribed = False

#     if SubscriptionInfo.objects.filter(
#         endpoint=request.GET.get('endpoint'),
#         auth=request.GET.get('auth'),
#         p256dh=request.GET.get('p256dh'),
#     ).exists():
        

#     return HttpResponse(is_subscribed)

def subscribeToNotifications(request):
    import json
    from webpush.models import SubscriptionInfo, PushInformation
    from webpush import send_user_notification

    data = json.loads(request.body)

    print(data)

    is_subscribed = False

    #check if subscribed
    if SubscriptionInfo.objects.filter(
        endpoint=data['endpoint'],
        auth=data["keys"]['auth'],
        p256dh=data["keys"]['p256dh'],
    ).exists():
        is_subscribed = True
        return JsonResponse({"is_subscribed":is_subscribed})
    
    subscription = SubscriptionInfo.objects.create(
        endpoint=data['endpoint'],
        auth=data["keys"]['auth'],
        browser="none",
        user_agent="none",
        p256dh=data["keys"]['p256dh'],
    )

    subscription.save()
    
    push_info = PushInformation.objects.create(
        user=request.user,
        subscription=subscription,
        group=None,
        
    )

    push_info.save()

    send_user_notification(
        user=request.user,
        payload={
            'title': 'Welcome to Yourbit!',
            'body': 'You are now subscribed to notifications from Yourbit.',
            'icon': '/static/images/yourbit_logo.png',
            'tag': 'yourbit',
            'data': {
                'url': '/notify/',
                'action': 'open_url'  # Specify the action as 'open_url'
            }
        },
        ttl=1000,
    )


    return JsonResponse({"Success" : "Success", "is_subscribed": is_subscribed})

def send_test_notification(request):
    from webpush.models import SubscriptionInfo, PushInformation
    from webpush import send_user_notification

    send_user_notification(
        user=request.user,
        payload={
            'title': 'Testing 1... 2... 3...',
            'body': 'This is a test notification you requested. Let us know what you find!',
            'icon': '/static/images/yourbit_logo.png',
            'tag': 'yourbit',
            'actions': [
                {
                    'action': 'open_url',
                    'title': 'Open Yourbit',
                    'icon': '/static/images/yourbit_logo.png'
                }
            ],
            'data': {
                'url': '/notify/',
            }
            
        },
        ttl=1000,
    )

    return HttpResponse("Success")

@method_decorator(login_required, name='dispatch')
def unsubscribeToNotifications(request):
    import json
    from webpush.models import SubscriptionInfo, PushInformation

    data = json.loads(request.body)
    user = request.user

    subscription = SubscriptionInfo.objects.get(
        endpoint=data['endpoint'],
        auth=data['auth'],
        p256dh=data['p256dh'],
    )

    push_info = PushInformation.objects.get(
        user=user,
        subscription=subscription,
    )

    push_info.delete()
    subscription.delete()

    return HttpResponse("Success")


@method_decorator(login_required, name='dispatch')
def notify_all_users(request):
    from webpush.models import SubscriptionInfo, PushInformation
    from webpush import send_user_notification

    users = User.objects.all()
    for user in users:
        
        send_user_notification(
            user=user,
            payload={
                'head': 'New Notification',
                'body': 'This is a test notification.',
                'icon': '/static/images/yourbit_logo.png',
                'tag': 'yourbit',
                'data': {
                    'url': '/notify/',
                }
            },
            ttl=1000,
        )

    return HttpResponse("Success")