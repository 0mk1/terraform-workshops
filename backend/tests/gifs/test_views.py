import pytest
from rest_framework.test import APIClient


class GIFEntryViewSetTest:

    @pytest.fixture(scope='class')
    def url(self):
        return '/v1/gifs/'

    @pytest.mark.django_db
    def test_list(self, url, simple_user, list_of_3_gifs):
        client = APIClient()
        client.force_authenticate(user=simple_user)

        response = client.get(url)
        assert response.status_code == 200
        assert len(response.data['results']) == 3
