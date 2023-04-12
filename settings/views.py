from django.shortcuts import render
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.views import View
from .models import *
from settings.api.serializers import *
from django.http import JsonResponse

# Create your views here.

#Render user settings page

class Settings(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        context = {
            "location":"settings",
            "space":"global",
            "filter":"all",
            "sort":"chrono"
        }        
        return render(request, "main/home.html", context)
    

class GetPrivacySettings(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        this_profile = request.user.profile
        
        these_settings = MySettings.objects.get(profile=this_profile)

        privacy_settings = PrivacySettings.objects.get(settings=these_settings)

        settings_serialized = PrivacySettingsSerializer(privacy_settings, many=False)

        return JsonResponse(settings_serialized.data, safe=False)
    
class GetFeedSettings(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        this_profile = request.user.profile
        
        these_settings = MySettings.objects.get(profile=this_profile)

        feed_settings = FeedSettings.objects.get(settings=these_settings)

        settings_serialized = FeedSettingsSerializer(feed_settings, many=False)

        return JsonResponse(settings_serialized.data, safe=False)
    
