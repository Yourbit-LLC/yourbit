from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template
from yb_photo.api.viewsets import PhotoUploadView
from yb_photo.views import *

urlpatterns = [
    path("list/", create_menu_template, name="photo_list"),
    path('api/upload/', PhotoUploadView.as_view(), name='photo-upload'),
    # path('get-upload-url/', get_cloudflare_image_url, name='get-upload-url'),
    path('new-image-upload/', upload_image, name='new-image-upload'),
    path('image-upload-test/', test_upload, name='image-upload-test'),
    path('upload/', upload_image, name='upload_image'),
    path("templates/cropper/<str:crop_type>/", cropper_view, name="cropper_template"),
    path("reset-images-to-yb/", reset_images_to_yb, name="reset_images_to_yb")
]