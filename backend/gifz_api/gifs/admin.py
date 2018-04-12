from django.contrib import admin

from .models import GIFEntry


@admin.register(GIFEntry)
class GIFEntryAdmin(admin.ModelAdmin):
    pass
