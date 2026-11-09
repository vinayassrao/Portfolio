"""The contact form."""
from django import forms

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    """Name, email and message, plus a hidden honeypot field that only bots fill in."""

    # Honeypot: real people never see or fill this field.
    website = forms.CharField(required=False, widget=forms.TextInput(attrs={
        "tabindex": "-1", "autocomplete": "off",
    }))

    class Meta:
        """Build the form from ContactMessage, with placeholders and autocomplete hints."""

        model = ContactMessage
        fields = ["name", "email", "message"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Your name", "autocomplete": "name"}),
            "email": forms.EmailInput(attrs={"placeholder": "you@studio.com", "autocomplete": "email"}),
            "message": forms.Textarea(attrs={
                "rows": 5, "placeholder": "Tell me about the role, the team or the game...",
            }),
        }

    def is_spam(self):
        """Return True when the honeypot was filled in (a bot): the message is then silently dropped."""
        return bool(self.cleaned_data.get("website"))
