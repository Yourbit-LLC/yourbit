from django.shortcuts import render
from django.views import View
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth import authenticate, login, logout
from yb_accounts.models import Account as User
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from main.views import initialize_session

# Create your views here.
class GetNotifications(View):
    def get(self, request):
        return render(request, "yb_notify/notifications.html")
    
    def post(self, request):
        pass


def notifications_html(request):
    from yb_profile.models import Profile
    from .models import NotificationCore
    this_profile = Profile.objects.get(user=request.user)
    notification_core = NotificationCore.objects.get(profile=this_profile)
    unseen_notifications = notification_core.unseen_notifications.all().order_by('-time')
    seen_notifications = notification_core.seen_notifications.all().order_by('-time')

    #chain together seen and unseen notificaitons
    notifications = unseen_notifications | seen_notifications

    context = {
        'results': notifications,
    }

    return render(request, "yb_notify/notifications.html", context)

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
        

@method_decorator(login_required, name='dispatch')
def subscribeToNotifications(request):
    from .models import UserDevice, PushSubscription
    import json
    data = json.loads(request.body)
    user = User.objects.get(username=data['username'])
    device_info = json.loads(data['device_info'])

    device = UserDevice.objects.get_or_create(user=user, device_id=data['device_id'], defaults={'device_type': device_info['deviceType']})
    
    subscription = PushSubscription(
        user_device = device,
        endpoint = data['endpoint'],
        p256dh = data['p256dh'],
        auth = data['auth']
    )

    subscription.save()
    return HttpResponse("Success")

@method_decorator(login_required, name='dispatch')
def unsubscribeToNotifications(request):
    from .models import UserDevice, PushSubscription
    import json
    data = json.loads(request.body)
    user = User.objects.get(username=data['username'])
    device = UserDevice.objects.get(user=user, device_id=data['device_id'])
    subscription = PushSubscription.objects.get(user_device=device, endpoint=data['endpoint'])
    subscription.delete()
    return HttpResponse("Success")


def notifyUser(request):
    from .models import PushSubscription, UserDevice
    import json
    from webpush import send_user_notification

    data = json.loads(request.body)
    user = User.objects.get(username=data['username'])

    subscription = PushSubscription.objects.get(user_device=device)

    device = UserDevice.objects.get(user=user, device_id=data['device_id'])

    if device.device_type == 'iOS':
        device.send_message_ios(data['message'])

    else:

        payload = {
            'head': data['head'],
            'body': data['body'],
            'icon': data['icon'],
            'tag': data['tag'],
            'data': data['data']
        }

        device.send_message_web(payload)
    return HttpResponse("Success")

def notifyAllUsers(request):
    from .models import PushSubscription, UserDevice
    import json
    from webpush import send_user_notification

    data = json.loads(request.body)
    users = User.objects.all()

    for user in users:
        device = UserDevice.objects.get(user=user, device_id=data['device_id'])
        subscription = PushSubscription.objects.get(user_device=device)

        if device.device_type == 'iOS':
            device.send_message_ios(data['message'])

        else:
            payload = {
                'head': data['head'],
                'body': data['body'],
                'icon': data['icon'],
                'tag': data['tag'],
                'data': data['data']
            }

            device.send_message_web(payload)
    return HttpResponse("Success")