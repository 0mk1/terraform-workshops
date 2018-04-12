from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
