from django.conf.urls import (
    include,
    url,
)
from rest_framework import routers

from .views import GIFEntryViewSet


app_name = 'gifs'

router = routers.DefaultRouter()
router.register(
    r'gifs',
    GIFEntryViewSet,
    base_name='gif',
)


urlpatterns = [
    url(
        r'^',
        include(router.urls),
    ),
]
