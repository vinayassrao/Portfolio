"""Admin: read contact-form messages and tick them off as read."""

from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """Messages are read-only here; only the "read" flag can be changed.

    Filter by email status to find messages whose email copy failed (answer those from here).
    """

    list_display = ("name", "email", "created_at", "email_status", "is_read")
    list_filter = ("is_read", "email_status")
    search_fields = ("name", "email", "message")
    readonly_fields = ("name", "email", "message", "created_at", "email_status")
