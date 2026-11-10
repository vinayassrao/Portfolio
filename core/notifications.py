"""Emailing contact-form messages to the site owner."""

import logging

from django.conf import settings
from django.core.mail import EmailMessage

log = logging.getLogger(__name__)


def notify_by_email(msg):
    """Email a saved contact message to the site owner; Reply-To is the sender, so replying answers them.

    A mail failure never loses the message (it is already saved) and never breaks the form; the outcome is
    recorded on the message (email_status), so the admin shows which messages never reached the inbox.
    Each message is emailed at most once: a message that was already handled raises ValueError.
    """
    status = msg.EmailStatus
    if not msg.email_pending:
        raise ValueError(f"message {msg.pk} was already handled (email_status={msg.email_status!r})")
    to = settings.CONTACT_NOTIFY_EMAIL
    if not to:
        msg.record_email_status(status.OFF)
        return
    body = f"{msg.message}\n\n-- \n{msg.name} <{msg.email}>\nSent from the contact form on your portfolio."
    try:
        EmailMessage(subject=f"Portfolio message from {msg.name}", body=body, to=[to], reply_to=[msg.email]).send()
    except Exception:
        log.exception("Could not email contact message %s", msg.pk)
        msg.record_email_status(status.FAILED)
    else:
        msg.record_email_status(status.SENT)
