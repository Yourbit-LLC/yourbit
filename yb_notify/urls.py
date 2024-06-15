from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_notify.views import GetNotifications, notifications_html, NotificationPage, subscribeToNotifications, send_test_notification, notification_list

urlpatterns = [
    path("collect/", GetNotifications.as_view(), name="create"),
    path("template/list/", notifications_html, name="list-html"),
    path("subscribe/", subscribeToNotifications, name="notify-subscribe"),
    path("api/", include("yb_notify.routers")),
    path('notification-list/<str:filter>/', notification_list, name="notification-list"),
    path("send-push-test/", send_test_notification, name="send-push-test"),
    path('', NotificationPage.as_view(), name="notification-page"),
    
]