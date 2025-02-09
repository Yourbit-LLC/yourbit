from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template
from yb_video.views import *

urlpatterns = [
    path("list/", create_menu_template, name="video_list"),
    path("video_upload_test/", video_upload_test, name="video_upload_test"),
    path("api/get_tus_url/", get_cloudflare_upload_url, name="get_tus_url"),
    path("api/get-mux-url/", video_upload_endpoint, name="get_mux_url"),
    path("webhooks/ready-upload/", ready_upload, name="ready-upload"),
    path("templates/video-setup/", video_setup_template, name="video-setup")
]