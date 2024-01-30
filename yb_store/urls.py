from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template

urlpatterns = [
    path("merch/", create_menu_template, name="shop_merchandise"),
]