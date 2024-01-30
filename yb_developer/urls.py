from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_developer.views import index

urlpatterns = [
    path("", index , name="dev_home"),
]