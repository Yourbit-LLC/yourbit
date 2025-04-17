from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_settings.views import *


urlpatterns = [
    # path("privacy/", , name="privacy_settings"),
    path("root/", settings_main, name="settings_main"),
    path("notifications/update/", SettingsNotifications.as_view(), name="update_notification_settings"),
    path("templates/profile/", profile_settings_template, name="template_settings_profile"),
    path("profile/", SettingsProfile.as_view(), name="view_settings_profile"),
    path("templates/privacy/", settings_privacy, name="settings_privacy"),
    path("templates/subscription/", settings_subscription, name="settings_subscription"),
    path("templates/feed/", settings_feed, name="settings_feed"),
    path("templates/notifications/", settings_notifications, name="settings_notifications"),
    path("templates/account/", AccountSettings.as_view(), name="settings_account"),
    path("templates/change-password/", change_password_template, name="settings_password"),
    path("templates/cluster/<int:id>/", ClusterSettings.as_view(), name="settings_cluster"),
    path("dev_cmd/real_name_ovrd/", set_all_false, name="real_name_ovrd"),
    path("account/change-password/", change_password, name="change_password"),
    path("", SettingsElement.as_view(), name="settings_main"),

]