from django.shortcuts import render
from .models import Issue

# Create your views here.
def support_center_template(request):
    issues = Issue.objects.all().order_by('-time')
    context = {
        "known_issues": issues,
    }
    return render(request, 'yb_support_center.html', context)

def report_bug_template(request):
    return render(request, 'yb_report_bug.html')

def feature_request_template(request):
    return render(request, 'yb_request_feature.html')

def contact_info_template(request):
    return render(request, 'yb_contact_info.html')