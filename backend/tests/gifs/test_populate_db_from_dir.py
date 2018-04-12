import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from gifz_api.gifs.models import GIFEntry


@pytest.mark.django_db
def test_populate_db_from_dir(admin_user):
    call_command('populate_db_from_dir', './tests/fixtures/')
    assert GIFEntry.objects.count() == 4

    GIFEntry.objects.all().delete()


@pytest.mark.django_db
def test_validation_of_dir_path():
    with pytest.raises(CommandError):
        call_command('populate_db_from_dir')

    with pytest.raises(CommandError):
        call_command('populate_db_from_dir', './tests/not_Existing_folder/')
