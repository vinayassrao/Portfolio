import logging

from django.conf import settings
from django.contrib import messages
from django.core.mail import EmailMessage
from django.shortcuts import redirect, render
from django.urls import reverse

from . import content
from .forms import ContactForm


log = logging.getLogger(__name__)


def _ctx(active, **extra):
    return {"active": active, **extra}


def notify_by_email(msg):
    """Email a saved contact message to the site owner; Reply-To is the sender, so replying answers them.
    A mail failure never loses the message (it is already saved) and never breaks the form."""
    to = settings.CONTACT_NOTIFY_EMAIL
    if not to:
        return
    body = (f"{msg.message}\n\n-- \n{msg.name} <{msg.email}>\n"
            "Sent from the contact form on your portfolio.")
    try:
        EmailMessage(subject=f"Portfolio message from {msg.name}", body=body, to=[to], reply_to=[msg.email]).send()
    except Exception:
        log.exception("Could not email contact message %s", msg.pk)


def home(request):
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
    return render(request, "core/about.html", _ctx(
        "about",
        bio=content.BIO,
        sheet=content.CHARACTER_SHEET,
        fits=content.WHERE_I_FIT,
        side_quests=content.SIDE_QUESTS,
    ))


def projects(request):
    return render(request, "core/projects.html", _ctx("projects", projects=content.PROJECTS))


def experience(request):
    return render(request, "core/experience.html", _ctx(
        "experience",
        jobs=content.EXPERIENCE,
        cp=content.COMPETITIVE,
        education=content.EDUCATION,
        certs=content.CERTIFICATIONS,
    ))


def skills(request):
    return render(request, "core/skills.html", _ctx(
        "skills", groups=content.SKILLS, unlocks=content.NEXT_UNLOCKS,
    ))


def contact(request):
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
