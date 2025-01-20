from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from .views import search, SearchElement, NewSearchPage, search_template

urlpatterns = [
    path("", SearchElement.as_view() , name="search-page"),
    path("new-search-test/", NewSearchPage.as_view(), name="new-search-page"),
    path("templates/search/", search_template, name="search-template"),
    path("results/", search, name="search-results")
]