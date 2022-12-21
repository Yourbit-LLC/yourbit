from django.urls import path, include
from .views import *

urlpatterns = [
    path('', Settings.as_view(), name="mysettings"),
]