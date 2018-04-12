from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from stdimage.models import StdImageField
from stdimage.utils import UploadToUUID
from taggit.managers import TaggableManager

from .validators import validate_gif_file_extension


class GIFEntry(TimeStampedModel):
    title = models.CharField(
        _('title'),
        max_length=255,
    )
    gif_file = StdImageField(
        upload_to=UploadToUUID(path='gifs'),
        validators=[
            validate_gif_file_extension,
        ],
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_('author'),
        related_name='gif_entries',
        on_delete=models.CASCADE,
    )
    tags = TaggableManager(blank=True)

    class Meta:
        verbose_name = _('gif entry')
        verbose_name_plural = _('gif entries')

    def __str__(self):
        return self.title
