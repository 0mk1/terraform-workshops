from .settings import *  # noqa
from .settings import (
    INSTALLED_APPS,
    root,
)


INSTALLED_APPS = [
    app for app in INSTALLED_APPS
    if app != 'cachalot'
]

CACHALOT_ENABLED = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    },
}

MEDIA_ROOT = (root - 1)('test_media')

EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

CELERY_TASK_ALWAYS_EAGER = True
