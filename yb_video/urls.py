from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template
from yb_video.views import *

urlpatterns = [
    path("list/", create_menu_template, name="video_list"),
    path("video_upload_test/", video_upload_test, name="video_upload_test"),
    path("api/get_tus_url/", get_cloudflare_upload_url, name="get_tus_url"),
]