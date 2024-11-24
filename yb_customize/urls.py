from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from .views import *
from yb_profile.views import CustomProfilePreview

urlpatterns = [
    path("bit/", CustomizeBitView.as_view(), name="customize_bit"),
    path("ui/", CustomizeUIView.as_view(), name="customize_ui"),
    path("complete-tutorial/<str:type>/", complete_tutorial, name="complete_tutorial"),
    path("profile/", CustomizeProfileView.as_view(), name="customize_profile_view"),
    path("pfp/edit/", edit_profile_image, name="customize_profile_image"),
    path("stickers/search/<str:query>/", StickerList.as_view(), name="search_stickers"),
    path("repair-custom-ui/", user_custom_repair, name="repair_custom_ui"),
    path("repair-custom-bit/", user_custom_repair, name="repair_custom_bit"),
    path("bit/toggle/", toggle_custom_bits, name="toggle_bit"),
    path("ui/toggle/", toggle_custom_ui, name="toggle_ui"),
    path("flat-ui/toggle/", toggle_flat_mode, name="toggle_flat_ui"),
    path("only-my-colors/toggle/", toggle_only_my_colors, name="toggle_only_my_colors"),
    path("stickers/browse/", StickerBrowse.as_view(), name="browse_stickers"),
    path("templates/main/", CustomizeMenu.as_view(), name="customize_main"),
    path("templates/profile-splash/", CustomizeProfile.as_view(), name="customize_profile"),
    path("upload/profile-image/", update_profile_image, name="update_profile_image"),
    path("get/wallpaper/<str:profile_class>/<str:type>/", get_wallpaper, name="get_profile_background"),
    path("get/wallpaper/<str:profile_class>/connection/<str:username>/<str:type>/", get_wallpaper, name="get_profile_background_connection"),
    path("update-wallpaper-setting/", update_wallpaper_settings, name="apply_wallpaper_settings"),
    path("templates/customize-ui/", CustomizeUI.as_view(), name="customize_ui"),
    path("templates/customize-bit/", CustomizeBit.as_view(), name="customize_core"),
    path("templates/profile-image/", ProfileImageUpload.as_view(), name="customize_profile_image"),
    path("templates/wallpaper/", WallpaperUpload.as_view(), name="customize_wallpaper"),
    path("templates/profile/edit/font/<str:option>/", SplashFontEdit.as_view(), name="edit_font"),
    path("templates/profile/edit/button/", SplashButtonEdit.as_view(), name="edit_button"),
    path("templates/create-theme/", CreateTheme.as_view(), name="create_theme"),
    path("templates/profile/preview/mobile/", CustomProfilePreview.as_view(), name="preview_mobile"),
    path('', CustomizeMain.as_view(), name = "customize-main")

]