from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse

from . import content
from .forms import ContactForm


def _ctx(active, **extra):
    return {"active": active, **extra}


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
                form.save()
            messages.success(request, "Message saved. I'll get back to you soon.")
            return redirect(reverse("contact") + "#message")
    else:
        form = ContactForm()
    return render(request, "core/contact.html", _ctx("contact", form=form))
