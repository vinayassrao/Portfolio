"""Page views. Each page renders its template with copy from content.py."""
import logging

from django.conf import settings
from django.contrib import messages
from django.core.mail import EmailMessage
from django.shortcuts import redirect, render
from django.urls import reverse

from . import content
from .forms import ContactForm
from .models import ContactMessage

log = logging.getLogger(__name__)


def _ctx(active, **extra):
    """Build a template context; `active` is the nav key of the current page."""
    return {"active": active, **extra}


def notify_by_email(msg):
    """Email a saved contact message to the site owner; Reply-To is the sender, so replying answers them.

    A mail failure never loses the message (it is already saved) and never breaks the form; the outcome is
    recorded on the message (email_status), so the admin shows which messages never reached the inbox.
    """
    status = ContactMessage.EmailStatus
    if msg.email_status != status.PENDING:   # each message is emailed at most once
        raise ValueError(f"message {msg.pk} was already handled (email_status={msg.email_status!r})")
    to = settings.CONTACT_NOTIFY_EMAIL
    if not to:
        _set_email_status(msg, status.OFF)
        return
    body = (f"{msg.message}\n\n-- \n{msg.name} <{msg.email}>\n"
            "Sent from the contact form on your portfolio.")
    try:
        EmailMessage(subject=f"Portfolio message from {msg.name}", body=body, to=[to], reply_to=[msg.email]).send()
    except Exception:
        log.exception("Could not email contact message %s", msg.pk)
        _set_email_status(msg, status.FAILED)
    else:
        _set_email_status(msg, status.SENT)


def _set_email_status(msg, new):
    """Record the email outcome (pending -> sent | failed | off), saving just that field."""
    msg.email_status = new
    msg.save(update_fields=["email_status"])


def home(request):
    """Home: the hero, stats, the room navigation and the featured project."""
    return render(request, "core/home.html", _ctx(
        "home",
        stats=content.STATS,
        roles=content.ROLES,
        stack=content.STACK_MARQUEE,
        paths=[d for d in content.NAV if d["key"] != "home"],
        featured=content.PROJECTS[0],
        hobbies=content.HOBBIES,
    ))


def about(request):
    """About: bio, character sheet, where I fit and side quests."""
    return render(request, "core/about.html", _ctx(
        "about",
        bio=content.BIO,
        sheet=content.CHARACTER_SHEET,
        fits=content.WHERE_I_FIT,
        side_quests=content.SIDE_QUESTS,
    ))


def projects(request):
    """Projects."""
    return render(request, "core/projects.html", _ctx("projects", projects=content.PROJECTS))


def experience(request):
    """Experience: jobs, competitive programming, education and certifications."""
    return render(request, "core/experience.html", _ctx(
        "experience",
        jobs=content.EXPERIENCE,
        cp=content.COMPETITIVE,
        education=content.EDUCATION,
        certs=content.CERTIFICATIONS,
    ))


def skills(request):
    """Skills: grouped skills and what I'm learning next."""
    return render(request, "core/skills.html", _ctx(
        "skills", groups=content.SKILLS, unlocks=content.NEXT_UNLOCKS,
    ))


def contact(request):
    """Contact: show the form; on a valid POST save and email it, then redirect back (post/redirect/get)."""
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            if not form.is_spam():
                notify_by_email(form.save())
            messages.success(request, "Message saved. I'll get back to you soon.")
            return redirect(reverse("contact") + "#message")
    else:
        form = ContactForm()
    return render(request, "core/contact.html", _ctx("contact", form=form))
