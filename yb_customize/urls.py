from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path("bit/", CustomizeBitView.as_view(), name="customize_bit"),
    path("ui/", CustomizeUIView.as_view(), name="customize_ui"),
    path("profile/", CustomizeProfileView.as_view(), name="customize_profile_view"),
    path("pfp/edit/", edit_profile_image, name="customize_profile_image"),
    path("stickers/search/<str:query>/", StickerList.as_view(), name="search_stickers"),
    path("repair-custom-ui/", user_custom_repair, name="repair_custom_ui"),
    path("repair-custom-bit/", user_custom_repair, name="repair_custom_bit"),
    path("bit/toggle/", toggle_custom_bits, name="toggle_bit"),
    path("ui/toggle/", toggle_custom_ui, name="toggle_ui"),
    path("stickers/browse/", StickerBrowse.as_view(), name="browse_stickers"),
    path("templates/main/", CustomizeMenu.as_view(), name="customize_main"),
    path("templates/profile-splash/", CustomizeProfile.as_view(), name="customize_profile"),
    path("upload/profile-image/", update_profile_image, name="update_profile_image"),
    path("upload/background-image/", update_profile_background, name="update_profile_background"),
    path("get/wallpaper/<str:profile_class>/<str:type>/", get_wallpaper, name="get_profile_background"),
    path("get/wallpaper/<str:profile_class>/connection/<str:username>/<str:type>/", get_wallpaper, name="get_profile_background_connection"),
    path("templates/customize-ui/", CustomizeUI.as_view(), name="customize_ui"),
    path("templates/customize-bit/", CustomizeBit.as_view(), name="customize_core"),
    path("templates/profile-image/", ProfileImageUpload.as_view(), name="customize_profile_image"),
    path("templates/wallpaper/", WallpaperUpload.as_view(), name="customize_wallpaper"),
    path("templates/profile/edit/font/<str:option>/", SplashFontEdit.as_view(), name="edit_font"),
    path("templates/profile/edit/button/", SplashButtonEdit.as_view(), name="edit_button"),

    path('', CustomizeMain.as_view(), name = "customize-main")

]