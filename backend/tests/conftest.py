import pytest
from django.contrib.auth import get_user_model


@pytest.fixture()
def simple_user():
    return get_user_model().objects.create_user(
        username='t.lee',
        email='t.lee@gmail.co.uk',
        first_name='Tommy IV',
        last_name='Lee',
        is_active=True,
    )


@pytest.fixture()
def admin_user():
    return get_user_model().objects.create_superuser(
        username='admin',
        email='admin@admin.com',
        first_name='admin',
        last_name='',
        is_active=True,
        password='testing_password_123',
    )
