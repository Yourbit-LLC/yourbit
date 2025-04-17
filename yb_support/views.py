from django.shortcuts import render
from .models import Issue, BugReport, UserReport, FeatureRequest
from django.views import View
from django.http import HttpResponse
from main.utility import initialize_session


# Create your views here.
def support_center_template(request):
    issues = Issue.objects.all().order_by('-time')
    context = {
        "known_issues": issues,
    }
    return render(request, 'yb_support_home.html', context)

def report_bug_template(request):
    return render(request, 'yb_report_bug.html')

def feature_request_template(request):
    return render(request, 'yb_request_feature.html')

def contact_info_template(request):
    return render(request, 'yb_contact_info.html')

class SupportCenterView(View):
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
                    'start_function': 'yb_handleSupportClick(); yb_startBitStream();',    
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
        subject = request.POST.get('subject')
        body = request.POST.get('body')

        issue = Issue(
            subject = subject,
            body = body
        )

        issue.save()

        return HttpResponse("Issue Submitted")

class ReportBugView(View):
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
                    'start_function': 'yb_handleSupportClick(); yb_startBitStream();',    
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
        subject = request.POST.get('title')
        body = request.POST.get('description')

        bug_report = BugReport(
            subject = subject,
            body = body,
            user = request.user
        )

        bug_report.save()

        return HttpResponse("Bug Report Submitted")
    
class RequestFeatureView(View):
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
                    'start_function': 'yb_handleSupportClick(); yb_startBitStream();',    
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
        subject = request.POST.get('title')
        body = request.POST.get('description')

        feature_request = FeatureRequest(
            subject = subject,
            body = body,
            user = request.user
        )

        feature_request.save()

        return HttpResponse("Feature Request Submitted")