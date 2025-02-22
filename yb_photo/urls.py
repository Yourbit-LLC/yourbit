from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template
from yb_photo.views import *

urlpatterns = [
    path('api/', include('yb_photo.routers')),
    path("list/", create_menu_template, name="photo_list"),
    # path('get-upload-url/', get_cloudflare_image_url, name='get-upload-url'),
    path('new-image-upload/', upload_image, name='new-image-upload'),
    path('image-upload-test/', test_upload, name='image-upload-test'),
    path('upload/', upload_image, name='upload_image'),
    path("templates/cropper/<str:crop_type>/", cropper_view, name="cropper_template"),
    path("reset-images-to-yb/", reset_images_to_yb, name="reset_images_to_yb"),
    path("camera-test/", camera_test, name="camera_test"),
    path("dev/generate-wallpaper-urls/", generate_wallpaper_urls, name="generate_wallpaper_urls"),
    path("ai/generate-wallpaper/", generate_ai_wallpaper, name="generate_wallpaper"),
]