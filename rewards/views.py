from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from user_profile.models import Profile
from .models import *

# Create your views here.
class RewardsView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        user = request.user

        context = {
            'location':'rewards',
            'space': 'global',
            'filter':'all',
            'sort':'chrono',

        }
        return render(request, "main/home.html", context)
