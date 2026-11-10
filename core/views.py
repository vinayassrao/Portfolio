"""Page views. Each page renders its template with copy from content.py."""

from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse

from . import content
from .forms import ContactForm
from .notifications import notify_by_email


def _page(request, name, **context):
    """Render page `name` (core/<name>.html), with `name` as the active nav key so the nav highlights it."""
    return render(request, f"core/{name}.html", {"active": name, **context})


def home(request):
    """Home: the hero, stats, the room navigation and the featured project."""
    return _page(
        request,
        "home",
        stats=content.STATS,
        roles=content.ROLES,
        stack=content.STACK_MARQUEE,
        paths=[d for d in content.NAV if d["key"] != "home"],
        featured=content.PROJECTS[0],
        hobbies=content.HOBBIES,
    )


def about(request):
    """About: bio, character sheet, where I fit and side quests."""
    return _page(
        request,
        "about",
        bio=content.BIO,
        sheet=content.CHARACTER_SHEET,
        fits=content.WHERE_I_FIT,
        side_quests=content.SIDE_QUESTS,
    )


def projects(request):
    """Projects: every project, the featured one first."""
    return _page(request, "projects", projects=content.PROJECTS)


def experience(request):
    """Experience: jobs, competitive programming, education and certifications."""
    return _page(
        request,
        "experience",
        jobs=content.EXPERIENCE,
        cp=content.COMPETITIVE,
        education=content.EDUCATION,
        certs=content.CERTIFICATIONS,
    )


def skills(request):
    """Skills: grouped skills and what I'm learning next."""
    return _page(request, "skills", groups=content.SKILLS, unlocks=content.NEXT_UNLOCKS)


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
    return _page(request, "contact", form=form)
