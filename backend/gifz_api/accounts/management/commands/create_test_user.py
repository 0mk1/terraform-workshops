from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create test user with given mail'

    def add_arguments(self, parser):
        parser.add_argument('email', nargs='+', type=str)

    def handle(self, *args, **options):
        email = options['email'][0]
        user_qs = get_user_model().objects.filter(username='admin')

        if not user_qs.exists():
            user = get_user_model().objects.create_superuser(
                'admin',
                email,
                'admin1234',
            )

            self.stdout.write(
                'User {} created with email {} and password: admin1234.'.format(  # noqa: E501
                    user.username,
                    user.email,
                ),
            )
            return

        user = user_qs.first()
        self.stdout.write(
            'User with {} username already exists with email {} and password: admin1234'.format(  # noqa: E501
                user.username,
                user.email,
            ),
        )
