from django.urls import path, re_path
from . import views
from .views import *

urlpatterns = [
    path('update/', GetNotifications.as_view(), name="get-notificatons"),
    path('status/', NotificationStatus.as_view(), name='get-notification-status'),
    path('notify/', Notify.as_view(), name='notify'),
]