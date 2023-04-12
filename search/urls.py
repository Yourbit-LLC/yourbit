from django.urls import path
from .views import *

urlpatterns = [
    path('', ContextSearch.as_view(), name="search"),
    path('results/query=<str:query>/type=<str:type>/', SearchResults.as_view(), name='search-results'),
]