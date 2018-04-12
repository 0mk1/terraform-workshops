import os
import uuid

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile

from gifz_api.gifs.models import GIFEntry


GIFS_DIR = os.path.join(settings.MEDIA_ROOT, 'gifs')


class UUID4Monkey(object):
    hex = '653d1c6863404b9689b75fa930c9d0a0'


def file_fixture(test_file_path, file_path_after_save=None):
    with open(test_file_path, 'rb') as f:
        f.seek(0)
        uploaded_file = SimpleUploadedFile(f.name, f.read())

    yield uploaded_file

    uploaded_file.close()
    if (
        file_path_after_save is not None and
        os.path.exists(file_path_after_save)
    ):
        os.remove(file_path_after_save)


@pytest.fixture()
def gif_file(monkeypatch):
    monkeypatch.setitem(uuid.__dict__, 'uuid4', UUID4Monkey)

    yield from file_fixture(
        './tests/fixtures/funny_cat.gif',
        os.path.join(
            GIFS_DIR,
            '{}.gif'.format(UUID4Monkey.hex),
        ),
    )


@pytest.fixture()
def gif_entry(simple_user, gif_file):
    gif_entry = GIFEntry(
        title='Funny Vines',
        author=simple_user,
        gif_file=gif_file,
    )
    gif_entry.save()

    return gif_entry


@pytest.fixture()
def list_of_3_gifs(simple_user, gif_file):
    gif_entries = [
        GIFEntry(
            title='Funny Vines #{}'.format(i),
            author=simple_user,
            gif_file=gif_file,
        )
        for i in range(3)
    ]

    return GIFEntry.objects.bulk_create(gif_entries)


@pytest.fixture()
def jpg_file():
    yield from file_fixture(
        './tests/fixtures/panda.jpg',
    )


@pytest.fixture()
def txt_file():
    yield from file_fixture(
        './tests/fixtures/file.txt',
    )
