from celery import shared_task
from templated_mail.mail import BaseEmailMessage


@shared_task
def send_mail(template_name, recipients_email_list, context_dict=None):
    BaseEmailMessage(
        template_name=template_name,
        context=context_dict or {},
    ).send(
        to=recipients_email_list,
    )
