"""Tests: every page renders, and the contact form saves, emails, drops spam and survives mail failures."""

from unittest import mock

from django.core import mail
from django.test import TestCase, override_settings
from django.urls import path, reverse

from .models import ContactMessage
from .notifications import notify_by_email

FORM = {"name": "Ada", "email": "ada@example.com", "message": "Hello! We have a backend role."}
PAGES = ["home", "about", "projects", "experience", "skills", "contact"]


class PageTests(TestCase):
    """Every page renders and marks itself as the current page in the nav."""

    def test_pages_render(self):
        """Each page returns 200 and its own nav link carries aria-current."""
        for name in PAGES:
            with self.subTest(page=name):
                url = reverse(name)
                r = self.client.get(url)
                self.assertEqual(r.status_code, 200)
                self.assertContains(r, f'href="{url}" aria-current="page"')

    @override_settings(DEBUG=False)
    def test_unknown_url_shows_the_404_page(self):
        """An unknown URL gets the site's own 404 page."""
        r = self.client.get("/no-such-room/")
        self.assertEqual(r.status_code, 404)
        self.assertContains(r, "Wrong door", status_code=404)

    @override_settings(DEBUG=False, ROOT_URLCONF="core.tests")
    def test_server_error_shows_the_500_page(self):
        """A crashing view gets the site's own standalone 500 page."""
        self.client.raise_request_exception = False
        with self.assertLogs("django.request", level="ERROR"):
            r = self.client.get("/boom/")
        self.assertEqual(r.status_code, 500)
        self.assertContains(r, "Something broke", status_code=500)


def _crash(request):
    """A view that always fails, to exercise the 500 page."""
    raise RuntimeError("boom")


urlpatterns = [path("boom/", _crash)]


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    CONTACT_NOTIFY_EMAIL="owner@example.com",
)
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
        self.assertEqual(ContactMessage.objects.get().email_status, ContactMessage.EmailStatus.SENT)

    def test_invalid_form_shows_errors_and_saves_nothing(self):
        """A message without an email address is rejected with a field error."""
        r = self.client.post(reverse("contact"), {**FORM, "email": ""})
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'class="err"')
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_spam_is_neither_saved_nor_emailed(self):
        """A filled honeypot means a bot: nothing is saved or sent."""
        self.client.post(reverse("contact"), {**FORM, "website": "http://spam.example"})
        self.assertEqual(ContactMessage.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_mail_failure_still_saves_and_shows_success(self):
        """If sending fails, the error is logged but the message is kept and the visitor sees success."""
        with (
            mock.patch("core.notifications.EmailMessage.send", side_effect=OSError("SMTP down")),
            self.assertLogs("core.notifications", level="ERROR"),
        ):
            r = self.client.post(reverse("contact"), FORM, follow=True)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(ContactMessage.objects.get().email_status, ContactMessage.EmailStatus.FAILED)
        self.assertContains(r, "Message saved")

    @override_settings(CONTACT_NOTIFY_EMAIL="")
    def test_no_email_when_notifications_are_off(self):
        """An empty CONTACT_NOTIFY_EMAIL turns emails off; messages are still saved."""
        self.client.post(reverse("contact"), FORM)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(ContactMessage.objects.get().email_status, ContactMessage.EmailStatus.OFF)
        self.assertEqual(len(mail.outbox), 0)

    def test_email_status_is_set_only_once(self):
        """The email status can only leave "pending" once; a second notification attempt is refused."""
        msg = ContactMessage.objects.create(**FORM)
        notify_by_email(msg)
        with self.assertRaises(ValueError):
            notify_by_email(msg)
        with self.assertRaises(ValueError):
            msg.record_email_status(ContactMessage.EmailStatus.FAILED)
        self.assertEqual(len(mail.outbox), 1)
        msg.refresh_from_db()
        self.assertEqual(msg.email_status, ContactMessage.EmailStatus.SENT)
