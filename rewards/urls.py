from django.urls import path, re_path
from .views import *

urlpatterns = [
    path('', RewardsView.as_view(), name='rewards'),
]