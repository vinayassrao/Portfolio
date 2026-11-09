"""App config for the core app."""
from django.apps import AppConfig


class CoreConfig(AppConfig):
    """The core app: every page of the site lives here."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "core"
