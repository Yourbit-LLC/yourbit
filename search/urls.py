from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('', ContextSearch.as_view(), name="search"),
    path('results/query=<str:query>/type=<str:type>/', SearchResults.as_view(), name='search-results'),
    path('templates/search-results-html/', TemplateView.as_view(template_name = 'search/search_results.html')),
    path('trending-stickers/', get_trending_stickers, name="view-profile"),
]