from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from .models import *
from .utils import subdomain_reverse

support_home_url = subdomain_reverse('', subdomain='support')
support_faq_url = subdomain_reverse('faq', subdomain='support')
support_contact_url = subdomain_reverse('contact', subdomain='support')
# Create your views here.
class CreateBugReport(View):

    def post(self, request):
        bug_report = BugReport()
        bug_report.user = request.user
        bug_report.subject = request.POST.get('subject')
        bug_report.body = request.POST.get('body')

        bug_report.location = request.POST.get('location')

        bug_report.save()
        return JsonResponse({'success': True})
    
class CreateFeatureRequest(View):

    def post(self, request):
        feature_request = FeatureRequest()

        feature_request.subject = request.POST.get('subject')

        feature_request.body = request.POST.get('body')

        feature_request.save()

        return JsonResponse({'success': True})
    
class CreateUserReport(View):

    def post(self, request):
        user_report = UserReport()
        user_report.user = request.user

        reported_user = request.POST.get('username')
        user_report.reported_user = User.objects.get(username=reported_user)

        user_report.subject = request.POST.get('subject')

        user_report.body = request.POST.get('body')

        user_report.save()

        return JsonResponse({'success': True})

class Support(View):
    
        def get(self, request):
            return render(request, 'support/support_home.html')
