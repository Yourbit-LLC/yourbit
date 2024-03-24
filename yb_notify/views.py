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
                    'start_function': 'yb_handleNotificationsClick()',    
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