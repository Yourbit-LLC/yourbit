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
    
class UpdateAccountSettings(View):
    def post(self, request, *args, **kwargs):
        field = request.POST.get("field")
        value = request.POST.get("value")
        this_user = User.objects.get(username=request.user.username)

        if field == "first-name":
            this_user.first_name = value
            this_user.save()
            return JsonResponse({"message":"success"}, safe=False)
        elif field == "last-name":
            this_user.last_name = value
            this_user.save()
            return JsonResponse({"message":"success"}, safe=False)
        elif field == "email-address":
            this_user.email = value
            this_user.save()
            return JsonResponse({"message":"success"}, safe=False)
        elif field == "username":
            this_user.username = value
            this_user.save()
            return JsonResponse({"message":"success"}, safe=False)

class UpdatePrivacySettings(View):
    def post(self, request, *args, **kwargs):
        field = request.POST.get("field")
        value = request.POST.get("value")

        this_profile = request.user.profile
        
        my_settings = MySettings.objects.get(profile=this_profile)
        privacy_settings = PrivacySettings.objects.get(settings=my_settings)

        if field == "real-name":
            privacy_settings.real_name_visibility = value
            privacy_settings.save()
            return JsonResponse({"message":"success"}, safe=False)
        
        elif field == "birthday":
            privacy_settings.birthday_visibility = value
            privacy_settings.save()
            return JsonResponse({"message":"success"}, safe=False)

        elif field == "phone-number":
            privacy_settings.phone_number_visibility = value
            privacy_settings.save()
            return JsonResponse({"message":"success"}, safe=False)

        elif field == "email":
            privacy_settings.email_visibility = value
            privacy_settings.save()
            return JsonResponse({"message":"success"}, safe=False)

