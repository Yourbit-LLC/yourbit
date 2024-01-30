"""YourbitGold URL Configuration

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
from main.views import index
from yb_accounts.views import login_view, logout_view, registration_view


from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('profile/', include('yb_profile.urls')),
    path('accounts/', include('yb_accounts.urls')),
    path('bits/', include('yb_bits.urls')),
    path('messages/', include('yb_messages.urls')),
    path('notify/', include('yb_notify.urls')),
    path('customize/', include('yb_customize.urls')),
    path('video/', include('yb_video.urls')),
    path('photo/', include('yb_photo.urls')),
    path('search/', include('yb_search.urls')),
    path('systems/', include('yb_systems.urls')),
    path('settings/', include('yb_settings.urls')),
    path('core/', include('main.urls')),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', registration_view, name='register'),
    path('', index, name='home'),
]
