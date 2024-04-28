from django.shortcuts import render
from .models import Issue

# Create your views here.
def support_center_template(request):
    issues = Issue.objects.all().order_by('-time')
    context = {
        "known_issues": issues,
    }
    return render(request, 'yb_support_center.html', context)