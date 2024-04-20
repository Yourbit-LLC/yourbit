from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from main.views import *
from yb_bits.views import CreateCluster
from yb_profile.views import CreateOrbit

urlpatterns = [
    path("create-menu/", create_menu_template, name="create"),
    path("templates/create/bit/", create_bit_template, name="create-object"),
    path("templates/create/cluster/", CreateCluster.as_view(), name="create_cluster"),
    path("templates/create/orbit/", CreateOrbit.as_view(), name="create-orbit"),
    path("create/cluster/", CreateCluster.as_view(), name="post_cluster"),
    path("create/cluster/", CreateOrbit.as_view(), name="post_orbit"),
    path("create/", CreateElement.as_view(), name="create-element"),
]

