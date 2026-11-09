"""Database models."""
from django.db import models


class ContactMessage(models.Model):
    """A message sent through the contact form (also emailed to the owner, see views.notify_by_email)."""

    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField(max_length=4000)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        """Newest first."""

        ordering = ["-created_at"]

    def __str__(self):
        """Show the sender and the date, e.g. in the admin list."""
        return f"{self.name} <{self.email}> · {self.created_at:%Y-%m-%d}"
