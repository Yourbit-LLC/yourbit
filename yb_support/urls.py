from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import index, create_menu_template
from .views import *

urlpatterns = [
    path("templates/support-center/", support_center_template, name="support_center"),
    path("templates/report-bug/", report_bug_template, name="report_bug"),
    path("templates/request-feature/", feature_request_template, name="feature_request"),
    path("templates/contact-info/", contact_info_template, name="feature_request"),
    path('report-bug/', ReportBugView.as_view(), name='bug_report'),
    path('feature-request/', RequestFeatureView.as_view(), name='feature_request'),
    path('', SupportCenterView.as_view(), name='support_center'),
    

]