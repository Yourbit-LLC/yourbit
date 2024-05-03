from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template
from yb_photo.api.viewsets import PhotoUploadView
from yb_photo.views import cropper_view

urlpatterns = [
    path("list/", create_menu_template, name="photo_list"),
    path('api/upload/', PhotoUploadView.as_view(), name='photo-upload'),
    path("templates/cropper/<str:crop_type>/", cropper_view, name="cropper_template"),
]