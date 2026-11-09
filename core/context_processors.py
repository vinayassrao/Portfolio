"""Template context shared by every page: profile, nav and the static-file version."""
from functools import lru_cache
from pathlib import Path

from django.conf import settings

from . import content

STATIC_DIR = Path(__file__).resolve().parent / "static" / "core"


def _scan_static():
    """Return the newest modification time of our static files (0 if there are none)."""
    try:
        return max(int(p.stat().st_mtime) for p in STATIC_DIR.rglob("*") if p.is_file())
    except ValueError:
        return 0


@lru_cache(maxsize=1)
def _cached_version():
    """Scan once per process: in production the files only change on a deploy, which restarts the app."""
    return _scan_static()


def asset_version():
    """Return a ?v= cache-buster so browsers never mix a stale script with a fresh one after an update.

    Rescanned on every request while developing, cached in production.
    """
    return _scan_static() if settings.DEBUG else _cached_version()


def site(request):
    """Add PROFILE, NAV and ASSET_V to every template."""
    return {
        "PROFILE": content.PROFILE,
        "NAV": content.NAV,
        "ASSET_V": asset_version(),
    }
