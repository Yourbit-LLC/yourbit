from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path("templates/main/", CustomizeMenu.as_view(), name="customize_main"),
    path("templates/profile-splash/", CustomizeProfile.as_view(), name="customize_profile"),
    path("upload/profile-image/", update_profile_image, name="update_profile_image"),
    path("upload/background-image/", update_profile_background, name="update_profile_background"),
    path("get/wallpaper/<str:profile_class>/<str:type>/", get_wallpaper, name="get_profile_background"),

]