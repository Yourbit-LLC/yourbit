from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_notify.views import GetNotifications, notifications_html, NotificationPage, subscribeToNotifications

urlpatterns = [
    path("collect/", GetNotifications.as_view(), name="create"),
    path("template/list/", notifications_html, name="list-html"),
    path("subscribe/", subscribeToNotifications, name="notify-subscribe"),
    path("api/", include("yb_notify.routers")),
    path('', NotificationPage.as_view(), name="notification-page"),
    
]