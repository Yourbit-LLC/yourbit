from django.urls import path, re_path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('api/validation/signup/', ValidateField.as_view(), name='validate_field'),
    path('verify_email/<str:token>/', verify_email, name='verify_email'),
    path('verify_error/', verify_email, name='verify_email_error'),
    path('email_confirmation/', EmailConfirmation.as_view(), name='email_confirmation'),
    path('documents/terms/', terms_view, name='terms'),
]