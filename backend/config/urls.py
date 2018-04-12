from django.conf import settings
from django.conf.urls import (
    include,
    url,
)
from django.conf.urls.static import static
from django.contrib import admin


app_urls_v1 = [
    url(r'', include('gifz_api.accounts.urls_v1')),
    url(r'', include('gifz_api.gifs.urls_v1')),
    url(r'auth/', include('djoser.urls')),
    url(r'auth/', include('djoser.urls.authtoken')),
    # url(r'auth/', include('djoser.social.urls')),
]

urlpatterns = [
    url(
        r'^jet/',
        include('jet.urls', 'jet'),
    ),
    url(
        r'^jet/dashboard/',
        include('jet.dashboard.urls', 'jet-dashboard'),
    ),
    url(
        r'^admin/',
        admin.site.urls,
    ),
    url(
        r'^v1/',
        include(app_urls_v1, 'v1'),
    ),
]


if settings.DEBUG:
    import debug_toolbar
    from rest_framework.documentation import include_docs_urls

    urlpatterns += [
        url(
            r'^__debug__/',
            include(debug_toolbar.urls),
        ),
        url(
            r'^api-auth/',
            include(
                'rest_framework.urls',
                namespace='rest_framework',
            ),
        ),
        url(
            r'^docs/',
            include_docs_urls(title='GIFZ API'),
        ),
    ]

    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT,
    )
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
