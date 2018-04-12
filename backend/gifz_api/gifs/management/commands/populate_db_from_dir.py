import glob
import os
import secrets

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management.base import (
    BaseCommand,
    CommandError,
)

from gifz_api.gifs.models import GIFEntry


class Command(BaseCommand):
    help = 'Populate gifs database from directory'

    def add_arguments(self, parser):
        parser.add_argument('dir_path', nargs='+', type=str)

    def handle(self, *args, **options):
        if GIFEntry.objects.count() > 1000:
            self.stdout.write('You already have 1000 gifs in db.')
            return

        dir_path = options['dir_path'][0]

        if os.path.exists(dir_path):
            for filename in glob.glob(os.path.join(dir_path, '*.gif')):
                with open(filename, 'rb') as f:
                    f.seek(0)
                    inmemory_file = SimpleUploadedFile(filename, f.read())
                    gif_entry = GIFEntry(
                        title=secrets.token_hex(nbytes=16),
                        author=get_user_model().objects.get(username='admin'),
                        gif_file=inmemory_file,
                    )
                    gif_entry.save()
                    gif_entry.tags.add('funny', 'animals', 'dogs')
                    inmemory_file.close()
            self.stdout.write('Gifs created.')
        else:
            raise CommandError('Directory not exists.')
