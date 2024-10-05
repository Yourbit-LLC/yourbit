from django.urls import path, include
from .views import *
from .api.viewsets import BitFeedAPIView



urlpatterns = [
    #URL for API
    path('api/', include('yb_bits.routers')),
    path('api/bitstream/', BitFeedAPIView.as_view(), name='bitstream'),
    path("delete-cluster/", delete_cluster, name="delete-cluster"),
    path("add-to-cluster/", add_to_cluster, name="add-to-cluster"),
    path("remove-from-cluster/", remove_from_cluster, name="remove-from-cluster"),
    path("edit-bit/<int:pk>/", edit_bit_view, name="edit-bit"),
    path("set-user-bitstreams/", set_user_bitstreams, name="set-user-bitstreams"),
    path("view/<int:id>/", view_bit, name="bit-view"),
    

    #URL for views
    path("templates/list-clusters/", list_clusters, name="list-clusters"),
    path("templates/select-clusters/<int:bit_id>/", select_clusters, name="list-clusters"),
    path('templates/builder/edit/<int:pk>/', bit_builder_view, name="bit-builder"),
    path('templates/builder/share/<int:pk>/', bit_builder_share_view, name="bit-builder"),
    path('templates/builder/', bit_builder_view, name="bit-builder"),
    path('templates/bitstream/', bitstream_view, name="bit-feed"),
    path('templates/bit/focus/<int:pk>/', bit_focus_view, name="bit-focus"),
    path('templates/filter/sort/', sort_panel_view, name="filter-panel-sort"),
    path('templates/filter/filter/', filter_panel_view, name="filter-panel-filter"),
    path('templates/filter/customize/', customize_panel_view, name="filter-panel-customize"),
    path('templates/cluster/<int:id>/', cluster_view, name="cluster-view"),
    path("templates/options/<int:id>/", bit_options_menu, name="bit-options"),
    path("templates/builder/options/", BitBuildOptions.as_view(), name="build-bit-options"),
    path("templates/builder/scheduling/", BitBuildScheduling.as_view(), name="build-bit-scheduling"),
    path("templates/builder/monetization/", BitBuildMonetize.as_view(), name="build-bit-monetization"),
    path("templates/builder/customize/", BitBuildCustomize.as_view(), name="build-bit-customize"),
    path("templates/builder/thumbnail/", BitThumbnailSetup.as_view(), name="build-bit-customize"),
    path("templates/share-menu/<int:id>/", ShareMenuTemplate.as_view(), name="share-menu-template")
    
]
