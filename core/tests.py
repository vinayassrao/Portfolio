"""Tests for the contact form: saving, emailing, spam and mail failures."""
from unittest import mock

from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import ContactMessage

FORM = {"name": "Ada", "email": "ada@example.com", "message": "Hello! We have a backend role."}


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
                   CONTACT_NOTIFY_EMAIL="owner@example.com")
class ContactFormTests(TestCase):
    """Contact form behaviour with an in-memory mail backend."""

    def test_message_is_saved_and_emailed_with_reply_to_sender(self):
        """A valid message is saved and emailed to the owner, with Reply-To set to the sender."""
        r = self.client.post(reverse("contact"), FORM)
        self.assertEqual(r.status_code, 302)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 1)
        m = mail.outbox[0]
        self.assertEqual(m.to, ["owner@example.com"])
        self.assertEqual(m.reply_to, ["ada@example.com"])
        self.assertIn("Ada", m.subject)
        self.assertIn(FORM["message"], m.body)

    def test_spam_is_neither_saved_nor_emailed(self):
        """A filled honeypot means a bot: nothing is saved or sent."""
        self.client.post(reverse("contact"), {**FORM, "website": "http://spam.example"})
        self.assertEqual(ContactMessage.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_mail_failure_still_saves_and_shows_success(self):
        """If sending fails, the error is logged but the message is kept and the visitor sees success."""
        with mock.patch("core.views.EmailMessage.send", side_effect=OSError("SMTP down")), \
                self.assertLogs("core.views", level="ERROR"):
            r = self.client.post(reverse("contact"), FORM, follow=True)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertContains(r, "Message saved")

    @override_settings(CONTACT_NOTIFY_EMAIL="")
    def test_no_email_when_notifications_are_off(self):
        """An empty CONTACT_NOTIFY_EMAIL turns emails off; messages are still saved."""
        self.client.post(reverse("contact"), FORM)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 0)
