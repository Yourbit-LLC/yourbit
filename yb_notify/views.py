from django.shortcuts import render
from django.views import View

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