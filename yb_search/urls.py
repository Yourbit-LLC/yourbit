from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from .views import search

urlpatterns = [
    path("", search, name="search"),
]