from django.shortcuts import render
from main.views import initialize_session
from django.views import View
# Create your views here.

def settings_main(request):
    return render(request, "yb_settings/yb_settings.html")


def settings_profile(request):
    return render(request, "yb_settings/yb_profileInfo.html")


def settings_privacy(request):
    return render(request, "yb_settings/yb_privacySettings.html")

def settings_subscription(request):
    return render(request, "yb_settings/yb_subscriptionSettings.html")

def settings_feed(request):
    return render(request, "yb_settings/yb_feedSettings.html")

def settings_account(request):
    return render(request, "yb_settings/yb_accountSettings.html")

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
                    'start_function': 'yb_toggleSettingsMenu()',    
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