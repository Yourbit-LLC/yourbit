from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template, support_center_template

urlpatterns = [
    path("templates/support-center/", support_center_template, name="support_center"),
    path("help/", create_menu_template, name="help"),

]