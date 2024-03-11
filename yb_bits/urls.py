from django.urls import path, include
from .views import *
from .api.viewsets import BitFeedAPIView



urlpatterns = [
    #URL for API
    path('api/', include('yb_bits.routers')),
    path('api/bitstream/', BitFeedAPIView.as_view(), name='bitstream'),

    #URL for views
    path('templates/builder/<int:pk>/edit/', bit_builder_view, name="bit-builder"),
    path('templates/builder/', bit_builder_view, name="bit-builder"),
    path('templates/bitstream/', bitstream_view, name="bit-feed"),
    
]
