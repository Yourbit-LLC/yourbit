from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from .views import search, SearchElement

urlpatterns = [
    path("", SearchElement.as_view() , name="search"),
]