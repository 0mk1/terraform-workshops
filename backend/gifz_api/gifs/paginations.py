from django.conf import settings
from rest_framework.pagination import CursorPagination


class GIFEntryCursorPagination(CursorPagination):
    page_size = settings.GIFS_PAGE_SIZE
    ordering = '-created'
