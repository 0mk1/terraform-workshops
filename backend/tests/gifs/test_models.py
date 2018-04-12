import os

import pytest

from gifz_api.gifs.models import GIFEntry

from ..utils import get_error_dict_from_model_validation
from .conftest import (
    GIFS_DIR,
    UUID4Monkey,
)


class GIFEntryTest:

    @pytest.mark.django_db
    def test_has_proper_fields(self, gif_file, simple_user):
        gif_entry = GIFEntry()
        gif_entry.title = 'Funny Cats'
        gif_entry.gif_file = gif_file
        gif_entry.author = simple_user
        gif_entry.full_clean()
        gif_entry.save()
        gif_entry.tags.add('funny', 'cats')

        assert GIFEntry.objects.count() == 1
        assert GIFEntry.objects.get(pk=1) == gif_entry

    @pytest.mark.django_db
    def test_if_file_is_uploaded_properly(self, gif_entry):
        file_path = os.path.join(GIFS_DIR, '{}.gif'.format(UUID4Monkey.hex))
        assert os.path.exists(file_path)

        with open(file_path, 'rb') as f:
            gif_entry.gif_file.seek(0)
            assert gif_entry.gif_file.read() == f.read()

        assert gif_entry.gif_file.size == 1030012

    @pytest.mark.django_db
    def test_gif_file_is_required(self, simple_user):
        gif_entry = GIFEntry(
            title='Super gif',
            author=simple_user,
        )

        error_dict = get_error_dict_from_model_validation(
            gif_entry,
        )
        assert 'field cannot be blank' in str(error_dict['gif_file'])

    @pytest.mark.django_db
    def test_if_jpg_cant_be_passed(self, jpg_file, simple_user):
        gif_entry = GIFEntry(
            title='JPG',
            gif_file=jpg_file,
            author=simple_user,
        )

        error_dict = get_error_dict_from_model_validation(
            gif_entry,
        )
        assert (
            'File extension \'jpg\' is not allowed. Allowed extensions are:'
        ) in str(error_dict['gif_file'])

    @pytest.mark.django_db
    def test_if_txt_cant_be_passed(self, txt_file, simple_user):
        gif_entry = GIFEntry(
            title='TXT',
            gif_file=txt_file,
            author=simple_user,
        )

        error_dict = get_error_dict_from_model_validation(
            gif_entry,
        )
        assert (
            'File extension \'txt\' is not allowed. Allowed extensions are:'
        ) in str(error_dict['gif_file'])

    @pytest.mark.django_db
    def test_str_of_object(self, gif_entry):
        assert str(gif_entry) == 'Funny Vines'
