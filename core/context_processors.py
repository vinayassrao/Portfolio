from pathlib import Path

from . import content

STATIC_DIR = Path(__file__).resolve().parent / "static" / "core"


def asset_version():
    """Newest modification time of our static files, used as a ?v= cache-buster so browsers never mix
    a stale script with a fresh one after an update."""
    try:
        return max(int(p.stat().st_mtime) for p in STATIC_DIR.rglob("*") if p.is_file())
    except ValueError:
        return 0


def site(request):
    return {
        "PROFILE": content.PROFILE,
        "NAV": content.NAV,
        "ASSET_V": asset_version(),
    }
