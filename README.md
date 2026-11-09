# Vinaya S Rao · Portfolio

**Live site: [vinayassrao.pythonanywhere.com](https://vinayassrao.pythonanywhere.com)**

A pixel-art portfolio site built with **Django**. Instead of a plain menu, the home page is a pixel-art room:
click the PC, the bookshelf or the phone and a little version of me walks over, acts it out, and the page opens.

> Backend, data and infrastructure engineer who also builds games. Open to backend, data engineering,
> DevOps/SRE and game-industry roles, remote or international.

![Home page](docs/screenshots/home.png)

## The room

The room is the site's navigation. Every object is a real link, so it works with a keyboard, a screen reader or with
JavaScript turned off.

| Object | Opens | What he does there |
|---|---|---|
| Framed certificate | About | looks up at it |
| Paper pile on the table | Experience | reads a sheet, scratching his head |
| PC setup | Projects | sits down and types |
| Bookshelf | Skills | reads a book |
| Phone | Contact | takes a call |

![The room](docs/screenshots/room.png)
![Acting out the About page](docs/screenshots/room-about.png)

- Click an object: he walks over, holds the pose for about a second, then the page opens. Any click or key skips ahead.
- Or click the floor and walk him with <kbd>←</kbd> <kbd>→</kbd> (or <kbd>A</kbd> <kbd>D</kbd>), then
  <kbd>↑</kbd> / <kbd>E</kbd> to open what he's standing at.
- The PC fans pulse, the monitors flicker and the eyes on the little TV under the desk blink.
- A smaller version of him lives in the nav bar and dashes to the link you click.
- `prefers-reduced-motion` turns the walking and dashing off; links open directly.
- His behaviour is an explicit state machine (`idle`, `acting`, `strolling`, `walking`, `posing`, `leaving`), shown
  as `data-state` on the room; the nav-bar runner has its own (`idle`, `dashing`, `covering`, `arrived`).

## Tech

- **Django 5.2**, server-rendered templates, no front-end framework.
- **Vanilla JavaScript + Canvas 2D** for the room, the character animation and the page effects.
- **Pixel-art rendering:** art is drawn at a whole number of device pixels per art pixel (`image-rendering: pixelated`),
  so it stays crisp on normal and high-DPI screens.
- **Contact page:** an email card (mail link, copy button) with GitHub and LinkedIn as pixel-logo buttons, next to
  a contact form. Messages are saved (readable in the Django admin) and emailed to me through Gmail SMTP, with the
  sender as Reply-To. A honeypot field drops bot submissions; a mail failure never loses a message, and each message records whether its email was sent (filter by email status in the admin). Covered by tests
  (`manage.py test core`).
- **Hosting:** PythonAnywhere (Python 3.13, SQLite, static files served by PythonAnywhere, HTTPS forced).

## Run it locally

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py runserver
```

Open http://127.0.0.1:8000. To read contact-form messages, create an admin user
(`manage.py createsuperuser`) and visit `/admin/`.

Tests and lint (rules in `ruff.toml`):

```powershell
.\.venv\Scripts\python manage.py test core
.\.venv\Scripts\python -m pip install ruff
.\.venv\Scripts\python -m ruff check .
```

## Project layout

| Path | What |
|---|---|
| `core/content.py` | All the copy: bio, projects, experience, skills, links (edit text here, not in templates) |
| `core/templates/core/` | Page templates; `base.html` holds the nav, footer and scripts |
| `core/static/core/css/site.css` | Palette, pixel frames, the room, scroll and reveal animations |
| `core/static/core/js/room.js` | The room: hit areas, walking, poses, ambient effects |
| `core/static/core/js/site.js` | Page transitions, scroll reveals, the nav-bar runner, the home-page character loop |
| `core/static/core/js/casual-hero.js` | Frame layout and animations for the character sprite sheets |
| `core/static/core/js/sprites.js` | Small hand-authored pixel sprites (page icons) |
| `core/static/core/img/room/` | The room, its glow layers and the five pose images |
| `core/static/core/img/hero/` | Character sprite sheets (walk, idle) |
| `core/static/core/img/hobbies/` | Hobby icons orbiting the character on the home page |

## The art

All characters, the room and the icons are my own designs. The images were generated as "pixel-style" art and then
rebuilt as true pixel art: snapped to a real pixel grid (with [proper-pixel-art](https://pypi.org/project/proper-pixel-art/)),
cut out, aligned on a shared baseline, given a shared palette and scaled so the character is the same size in every
frame. The original high-resolution sheets are kept locally and are not part of this repository.

## Deploying

Set these environment variables, run `collectstatic`, and serve the static files (for example with WhiteNoise or your
host's static-file support):

| Variable | Value |
|---|---|
| `DJANGO_SECRET_KEY` | a long random string |
| `DJANGO_DEBUG` | `0` |
| `DJANGO_ALLOWED_HOSTS` | your domain(s), comma-separated |
| `EMAIL_HOST_PASSWORD` | a Gmail [App Password](https://myaccount.google.com/apppasswords) for the sending account (16 letters, no spaces). Without it, emails are only printed to the console. |
| `EMAIL_HOST_USER` | optional: the Gmail account that sends (default `vinayassrao@gmail.com`) |
| `CONTACT_NOTIFY_EMAIL` | optional: where contact messages are emailed (default `vinayassrao@gmail.com`; empty turns emails off) |

With `DJANGO_DEBUG=0` the settings trust the HTTPS proxy header, use secure cookies and allow CSRF from
`https://<each allowed host>`.

### PythonAnywhere (how the live site runs)

- **Web app:** manual configuration, Python 3.13, virtualenv at `~/.venvs/portfolio`,
  source and working directory `~/Portfolio`.
- **WSGI file:** sets `DJANGO_SETTINGS_MODULE=portfolio.settings`, the variables above, and reads the secret key and the
  Gmail App Password from private files outside the repository (never committed): `~/.portfolio_secret_key` and
  `~/.portfolio_gmail_app_password`.
- **Static files:** URL `/static/` → `~/Portfolio/staticfiles`.
- **Security:** Force HTTPS on.

To ship an update after pushing to `main`, run this in a PythonAnywhere Bash console, then click **Reload** on the Web tab:

```bash
cd ~/Portfolio && git pull
source ~/.venvs/portfolio/bin/activate
export DJANGO_SECRET_KEY="$(cat ~/.portfolio_secret_key)" DJANGO_DEBUG=0 DJANGO_ALLOWED_HOSTS=vinayassrao.pythonanywhere.com
python manage.py migrate
python manage.py collectstatic --noinput
```

The free plan disables the site after a month unless you click **Run until 1 month from today** on the Web tab.

#### Contact-form emails

Messages sent through the contact form are emailed to `CONTACT_NOTIFY_EMAIL` through Gmail. One-time setup:

1. Create a Gmail App Password at https://myaccount.google.com/apppasswords (2-Step Verification must be on).
2. Store it on PythonAnywhere, outside the repository (paste it without spaces):
   ```bash
   echo 'APP_PASSWORD' > ~/.portfolio_gmail_app_password && chmod 600 ~/.portfolio_gmail_app_password
   ```
3. In the WSGI file, next to the other `os.environ[...]` lines:
   ```python
   os.environ["EMAIL_HOST_PASSWORD"] = open("/home/vinayassrao/.portfolio_gmail_app_password").read().strip()
   ```
4. Reload the web app and send a test message from `/contact/`. If no email arrives, the web app's error log shows
   why; the message is still saved and visible in `/admin/`.

To test real sending locally, start the server with `EMAIL_HOST_PASSWORD` set in that terminal only; without it,
the email is printed to the server console instead.

## Contact

- GitHub: [vinayassrao](https://github.com/vinayassrao)
- LinkedIn: [vinayasrao](https://www.linkedin.com/in/vinayasrao/)
- Email: vinayassrao@gmail.com

## License

Code and art © Vinaya S Rao. All rights reserved unless a license is added.
