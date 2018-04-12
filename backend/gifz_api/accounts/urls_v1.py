from django.conf.urls import (
    include,
    url,
)
from rest_framework import routers


app_name = 'accounts'

router = routers.DefaultRouter()


urlpatterns = [
    url(
        r'^',
        include(router.urls),
    ),
]
