from rest_framework import routers
from yb_search.api.viewsets import search

router = routers.DefaultRouter()
# Register your viewsets here

router.register(r'search', search)

urlpatterns = router.urls


