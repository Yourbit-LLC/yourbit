from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_profile.views import *

urlpatterns = [
    path("user/<str:username>/", ProfileView.as_view(), name="user_profile"),
    path("profile-info/update/", update_profile_info, name="update_profile_info"),
    path("info/onboarding/", profile_onboarding, name="onboarding"),
    path("templates/people/", PeopleViewTemplate.as_view(), name="people_template"),
    path("templates/orbits/", OrbitListTemplate.as_view(), name="orbit_template"),
    path("templates/stuff/", StuffTemplate.as_view(), name="stuff_template"),
    path("templates/history/", HistoryTemplate.as_view(), name="history_template"),
    path("templates/about/<str:username>/", ProfileAboutTemplate.as_view(), name="history_template"),
    path("templates/friend_request/<int:id>/", FriendRequestTemplate.as_view(), name="friend_request_template"),
    path("templates/connect_menu/<int:id>/", ProfileConnectTemplate.as_view(), name="connect_menu_template"),
    path("templates/orbit-setup/<int:id>/", OrbitSetup.as_view(), name="orbit_menu_template"),
    path("create/orbit/", CreateOrbit.as_view(), name="create_orbit"),
    path("people-list/<str:filter>/", people_list, name="people_list"),
    path("history-list/<str:filter>/", history_list, name="history_list"),
    path("disconnect/", disconnect_view, name="disconnect"),
    path("api/", include("yb_profile.routers")),
    path('', ProfilePage.as_view(), name="profile_page"),
]