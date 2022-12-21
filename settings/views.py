from django.shortcuts import render
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.views import View

# Create your views here.

#Render user settings page

class Settings(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        return render(request, "settings/settings.html")