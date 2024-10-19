from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_systems.views import EmailTest, updateTimezone, SyncTask

urlpatterns = [
    path("email-test/", EmailTest.as_view(), name="photo_list"),
    path("tasks/sync/", SyncTask, name="update_tasks"),
    path("update/timezone/", updateTimezone, name="update_timezone"),
]