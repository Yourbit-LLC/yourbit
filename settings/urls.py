from django.urls import path, include
from .views import *

urlpatterns = [
    path('', Settings.as_view(), name="mysettings"),
    path('api/privacy/', GetPrivacySettings.as_view(), name="get_privacy_settings"),
    path('api/feed/', GetFeedSettings.as_view(), name="get_feed_settings"),
]