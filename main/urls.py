from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template, create_object_template

urlpatterns = [
    path("create-menu/", create_menu_template, name="create"),
    path("create/<str:object>/", create_object_template, name="index")
]