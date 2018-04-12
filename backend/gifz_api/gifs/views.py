from django.db import transaction
from rest_framework import viewsets

from gifz_api.tasks import send_mail

from .models import GIFEntry
from .paginations import GIFEntryCursorPagination
from .serializers import GIFEntrySerializer


class GIFEntryViewSet(viewsets.ModelViewSet):
    queryset = GIFEntry.objects.select_related(
        'author',
    ).prefetch_related(
        'tags',
    )
    serializer_class = GIFEntrySerializer
    pagination_class = GIFEntryCursorPagination

    @transaction.atomic
    def perform_create(self, serializer):
        super().perform_create(serializer)

        send_mail.delay(
            template_name='gif_creation_email.html',
            recipients_email_list=[
                self.request.user.email,
            ],
            context_dict={
                'user': self.request.user.get_full_name(),
            },
        ),
