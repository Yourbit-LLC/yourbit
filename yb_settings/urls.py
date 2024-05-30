from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_settings.views import *


urlpatterns = [
    # path("privacy/", , name="privacy_settings"),
    path("root/", settings_main, name="settings_main"),
    path("templates/profile/", settings_profile, name="settings_profile"),
    path("templates/privacy/", settings_privacy, name="settings_privacy"),
    path("templates/subscription/", settings_subscription, name="settings_subscription"),
    path("templates/feed/", settings_feed, name="settings_feed"),
    path("templates/notifications/", settings_notifications, name="settings_notifications"),
    path("templates/account/", settings_account, name="settings_account"),
    path("", SettingsElement.as_view(), name="settings_main")
]