from rest_framework import serializers
from taggit_serializer.serializers import (
    TaggitSerializer,
    TagListSerializerField,
)

from .models import GIFEntry


class GIFEntrySerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()

    class Meta:
        model = GIFEntry
        fields = (
            'pk',
            'title',
            'gif_file',
            'author',
            'tags',
        )
