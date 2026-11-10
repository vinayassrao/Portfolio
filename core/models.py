"""Database models."""

from django.db import models


class ContactMessage(models.Model):
    """A message sent through the contact form (also emailed to the owner, see notifications.notify_by_email)."""

    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField(max_length=4000)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class EmailStatus(models.TextChoices):
        """What happened to the email copy: pending -> sent | failed | off. Set once, via record_email_status."""

        PENDING = "pending", "Pending"
        SENT = "sent", "Emailed"
        FAILED = "failed", "Email failed (reply from here)"
        OFF = "off", "Not emailed (notifications off)"

    email_status = models.CharField(max_length=8, choices=EmailStatus, default=EmailStatus.PENDING, editable=False)

    class Meta:
        """Newest first."""

        ordering = ["-created_at"]

    def __str__(self):
        """Show the sender and the date, e.g. in the admin list."""
        return f"{self.name} <{self.email}> · {self.created_at:%Y-%m-%d}"

    @property
    def email_pending(self):
        """True until the email outcome has been recorded."""
        return self.email_status == self.EmailStatus.PENDING

    def record_email_status(self, status):
        """Record the email outcome (pending -> sent | failed | off) and save just that field.

        The status leaves "pending" only once; a second attempt raises ValueError.
        """
        if not self.email_pending:
            raise ValueError(f"message {self.pk} was already handled (email_status={self.email_status!r})")
        self.email_status = status
        self.save(update_fields=["email_status"])
