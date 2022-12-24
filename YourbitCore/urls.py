"""YourbitCore URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from YourbitAccounts.views import (
    registration_view,
    login_view,
    logout_view,
    Onboarding
)

from main.views import EmailTest
from api.router import router

urlpatterns = [
    path('', login_view, name="login"),
    path('admin/', admin.site.urls),
    path('register/', registration_view, name="register"),
    path('login/', login_view, name="login"),
    path('logout/', logout_view, name="logout"),
    path('bitstream/', include('feed.urls')),
    path('profile/', include('user_profile.urls')),
    path('messages/', include('messenger.urls')),
    path('notifications/', include('notifications.urls')),
    path('rewards/', include('rewards.urls')),
    path('pay/', include('payment.urls')),
    path('search/', include('search.urls')),
    path('settings/', include('settings.urls')),
    path('onboarding/', Onboarding.as_view(), name='onboarding'),
    path('community/', include('community.urls')),
    path('api/', include(router.urls)),
    path('core/', include('main.urls')),
    path('emailtest/', EmailTest.as_view(), name="emailtest")

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
