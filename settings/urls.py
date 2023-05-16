from django.urls import path, include
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('', Settings.as_view(), name="mysettings"),

    #REST API EndPoints
    path('api/privacy/', GetPrivacySettings.as_view(), name="get_privacy_settings"),
    path('api/feed/', GetFeedSettings.as_view(), name="get_feed_settings"),
    path('account/', UpdateAccountSettings.as_view(), name="update_account_settings"),
    
    #Templates
    path('templates/settings-html/', TemplateView.as_view(template_name='settings/settings.html')),
    path('templates/account-settings-html/', TemplateView.as_view(template_name='settings/account_settings.html')),
    path('templates/feed-settings-html/', TemplateView.as_view(template_name = 'settings/feed_settings.html')),
    path('templates/privacy-settings-html/', TemplateView.as_view(template_name = 'settings/privacy_settings.html')),
    path('templates/profile-info-html/', TemplateView.as_view(template_name = 'settings/profile_info.html')),
    path('templates/subscription-settings-html/', TemplateView.as_view(template_name = 'settings/subscription_settings.html'))

]