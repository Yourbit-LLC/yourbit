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
    path('templates/bit/focus/<int:pk>/', bit_focus_view, name="bit-focus"),
    path('templates/filter/sort/', sort_panel_view, name="filter-panel-sort"),
    path('templates/filter/filter/', filter_panel_view, name="filter-panel-filter"),
    path('templates/filter/customize/', customize_panel_view, name="filter-panel-customize"),
    path('templates/cluster/<int:id>/', cluster_view, name="cluster-view"),
    
]
