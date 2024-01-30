from django.shortcuts import render

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