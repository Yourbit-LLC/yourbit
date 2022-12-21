from django.urls import path
from .views import *

urlpatterns = [
    path('', PreSearch.as_view(), name="search"),
    path('search/results/<str:query>', SearchResults.as_view(), name='search-results'),
]