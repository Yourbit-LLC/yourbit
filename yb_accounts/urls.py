from django.urls import path, include
from .views import *


urlpatterns = [
    #URL for API
    path('signup/', registration_view, name="signup"),
    path('onboarding/', Onboarding.as_view(), name="onboarding"),
    path('email_confirmation/', EmailConfirmation.as_view(), name="email_confirmation"),
    path('forgot-password/', ForgotPassword.as_view(), name="forgot_password"),
    path('reset-password/', ResetPassword.as_view(), name="reset_password"),
]
