from django.urls import path, re_path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('', RewardsView.as_view(), name='rewards'),
    path('templates/rewards-html/', TemplateView.as_view(template_name = 'rewards/rewards.html') )
]