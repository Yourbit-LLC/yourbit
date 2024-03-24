from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_profile.views import *

urlpatterns = [
    path("user/<str:username>/", ProfileView.as_view(), name="user_profile"),
    path("page/<str:username>/", OrbitView.as_view(), name="page_profile"),
    path("templates/people/", PeopleListTemplate.as_view(), name="people_template"),
    path("templates/orbits/", OrbitListTemplate.as_view(), name="orbit_template"),
    path("templates/stuff/", StuffTemplate.as_view(), name="stuff_template"),
    path("templates/history/", HistoryTemplate.as_view(), name="history_template"),
    path("templates/about/<str:username>/", ProfileAboutTemplate.as_view(), name="history_template"),
    path("api/", include("yb_profile.routers")),
    path('', ProfilePage.as_view(), name="profile_page"),
]