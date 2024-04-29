from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template
from .views import support_center_template, report_bug_template, feature_request_template, contact_info_template

urlpatterns = [
    path("templates/support-center/", support_center_template, name="support_center"),
    path("templates/report-bug/", report_bug_template, name="report_bug"),
    path("templates/request-feature/", feature_request_template, name="feature_request"),
    path("templates/contact-info/", contact_info_template, name="feature_request"),
    path("help/", create_menu_template, name="help"),

]