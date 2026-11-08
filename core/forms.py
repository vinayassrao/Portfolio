from django import forms

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    # Honeypot: real people never see or fill this field.
    website = forms.CharField(required=False, widget=forms.TextInput(attrs={
        "tabindex": "-1", "autocomplete": "off",
    }))

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "message"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Your name", "autocomplete": "name"}),
            "email": forms.EmailInput(attrs={"placeholder": "you@studio.com", "autocomplete": "email"}),
            "message": forms.Textarea(attrs={"rows": 5, "placeholder": "Tell me about the role, the team or the game..."}),
        }

    def is_spam(self):
        return bool(self.cleaned_data.get("website"))
