from django.urls import path, include
from .views import *
from django.contrib.auth import views as auth_views


urlpatterns = [
    #URL for API
    path('signup/', registration_view, name="signup"),
    path('onboarding/', Onboarding.as_view(), name="onboarding"),
    path('email_confirmation/', EmailConfirmation.as_view(), name="email_confirmation"),
    path(
        'forgot-password/',
        auth_views.PasswordResetView.as_view(template_name="yb_accounts/forgot_password.html", subject_template_name="yb_accounts/password_reset_subject.txt", email_template_name="yb_accounts/password_reset_email.html"),
        name="forgot_password"
    ),
    path(
        'reset-password-sent/',
        auth_views.PasswordResetDoneView.as_view(template_name="yb_accounts/reset_password_sent.html"), 
        name="password_reset_done"
    ),
    path(
        'reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(template_name="yb_accounts/password_reset_form.html"), 
        name="password_reset_confirm"
    ),
    path(
        'reset-password-complete/', 
        auth_views.PasswordResetCompleteView.as_view(template_name="yb_accounts/reset_password_done.html"), 
        name="password_reset_complete"
    ),
    path('reset-password/', ResetPassword.as_view(), name="reset_password"),
    path("templates/accept-terms/", terms_accept, name="accept-terms"),
    path("templates/accept-privacy/", privacy_accept, name="accept-privacy"),
    path("templates/interact-terms/", interactive_terms, name="interact-terms"),
    path("templates/interact-privacy/", interactive_privacy, name="interact-privacy"),
    path("templates/viewer/terms/", terms_view, name="view-terms"),
    path("templates/viewer/privacy/", privacy_view, name="view-privacy"),
    
]
