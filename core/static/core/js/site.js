/* Site-wide motion: page transitions, scroll reveals, parallax, embers, counters. */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  document.documentElement.classList.add("js");

  // ------------------------------------------------------------ pixel transition
  const PixelTransition = (function () {
    const COLS = 16, ROWS = 9;
    const el = document.createElement("div");
    el.className = "px-transition";
    el.setAttribute("aria-hidden", "true");
    const colors = ["#1e1450", "#140c3a", "#2f2178", "#5c0202", "#121315"];
    const cells = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const c = document.createElement("span");
      const x = i % COLS, y = (i / COLS) | 0;
      c.style.background = colors[(x * 7 + y * 3) % colors.length];
      c.style.setProperty("--d", ((x + y) * 18 + Math.random() * 90).toFixed(0) + "ms");
      cells.push(c); el.appendChild(c);
    }
    document.body.appendChild(el);

    let came = false;
    try { came = sessionStorage.getItem("px-nav") === "1"; sessionStorage.removeItem("px-nav"); } catch (e) { /* ignore */ }
    if (came && !reduced) {
      el.classList.add("is-covered", "no-anim");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.classList.remove("no-anim");
        el.classList.remove("is-covered");
      }));
    }
    window.addEventListener("pageshow", (e) => { if (e.persisted) el.classList.remove("is-covered"); });

    function go(url) {
      if (reduced) { window.location.href = url; return; }
      try { sessionStorage.setItem("px-nav", "1"); } catch (e) { /* ignore */ }
      el.classList.add("is-covered");
      setTimeout(() => { window.location.href = url; }, 520);
    }
    return { go: go };
  })();
  window.PixelTransition = PixelTransition;

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname.startsWith("/admin")) return;
    if (url.pathname === location.pathname && url.hash) return; // in-page anchor
    e.preventDefault();
    PixelTransition.go(url.href);
  });

  // ------------------------------------------------------------ nav
  const nav = $(".site-nav");
  const burger = $(".nav-toggle");
  if (burger) burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", String(open));
  });

  // ------------------------------------------------------------ nav runner
  // A small him in the nav bar (Vinaya's casual design, js/casual-hero.js). Clicking a nav link: he dashes to it
  // (~0.3s), taps it, and the page opens (the page transition starts as he arrives). Any click or key during the dash skips straight there. Desktop nav only;
  // off for prefers-reduced-motion (the CSS hides him and nothing is intercepted).
  (function navRunner() {
    const cv = $(".nav-runner"), HERO = window.CasualHero, links = $(".nav-links");
    if (!cv || !HERO || !links || reduced) return;
    const wide = window.matchMedia("(min-width: 901px)");
    const inner = cv.parentElement;
    const FW = HERO.w, FH = HERO.h;                      // a frame of his double-density sheet (2 texels per game px)
    const S = 0.58;                                      // css px per game px: he stands ~38px tall
    const cw = FW / 2 * S, ch = FH / 2 * S;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    cv.style.width = cw + "px"; cv.style.height = ch + "px";
    const ctx = cv.getContext("2d");
    const img = new Image();
    img.src = cv.dataset.sheet;
    const IDLE = HERO.anims.idle, RUN = HERO.anims.walk, JUMP = HERO.anims.jump || IDLE;
    const FIDGET = [HERO.anims.headphones, HERO.anims.phone, HERO.anims.yawn].filter(Boolean);
    let x = 0, face = 1, hop = 0, dash = null, ready = false;

    const linkX = (a) => { const r = a.getBoundingClientRect(), p = inner.getBoundingClientRect(); return r.left + r.width / 2 - p.left; };
    const current = () => $(".nav-links a[aria-current='page']") || $(".nav-links a");
    function settle() { if (!dash && wide.matches) { const a = current(); if (a) x = linkX(a); } }
    function draw(frame) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (!img.complete || !img.naturalWidth) return;
      ctx.save();
      if (face < 0) { ctx.translate(cv.width, 0); ctx.scale(-1, 1); }
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, frame * FW, 0, FW, FH, 0, 0, cv.width, cv.height);
      ctx.restore();
    }
    function finish() {
      if (!dash) return;
      const d = dash;
      dash.done = true;
      x = d.x1;
      window.removeEventListener("keydown", finish, true);
      window.removeEventListener("pointerdown", finish, true);
      d.a.classList.add("is-tapped");
      if (!d.going) { d.going = true; PixelTransition.go(d.url); }
    }
    function tick(ts) {
      let frame;
      if (dash && !dash.done) {
        const p = Math.min(1, (ts - dash.t) / dash.ms);
        x = dash.x0 + (dash.x1 - dash.x0) * (1 - Math.pow(1 - p, 2));
        frame = RUN[Math.floor((ts - dash.t) / 60) % RUN.length];
        if (p >= 0.65 && !dash.going) { dash.going = true; PixelTransition.go(dash.url); }   // cover starts as he arrives
        if (p >= 1) { hop = 4; finish(); }
      } else if (hop > 0.5) {
        frame = JUMP[0];
      } else {
        // mostly still, now and then he adjusts his headphones or checks his phone
        const cyc = ts % 9000, f = FIDGET[Math.floor(ts / 9000) % FIDGET.length];
        frame = cyc > 7400 && f ? f[Math.min(f.length - 1, Math.floor((cyc - 7400) / 420))] : IDLE[0];
      }
      hop = Math.max(0, hop - 0.5);
      cv.style.transform = "translate(" + (x - cw / 2).toFixed(1) + "px," + (-hop).toFixed(1) + "px)";
      draw(frame);
      requestAnimationFrame(tick);
    }
    links.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || !wide.matches || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (dash) { e.preventDefault(); finish(); return; }
      if (a.getAttribute("aria-current") === "page" || new URL(a.href, location.href).origin !== location.origin) return;
      e.preventDefault();
      const x1 = linkX(a);
      face = x1 >= x ? 1 : -1;
      dash = { x0: x, x1: x1, t: performance.now(), ms: Math.min(320, 120 + Math.abs(x1 - x) * 0.4), url: a.href, a: a };
      setTimeout(() => {   // skip on the next click or key (not this one)
        window.addEventListener("keydown", finish, true);
        window.addEventListener("pointerdown", finish, true);
      }, 0);
    });
    window.addEventListener("resize", settle);
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) { if (dash) dash.a.classList.remove("is-tapped"); dash = null; settle(); }
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
    window.addEventListener("load", settle);
    settle();
    if (!ready) { ready = true; requestAnimationFrame(tick); }
  })();

  // ------------------------------------------------------------ scroll driven bits
  const bar = $(".scroll-progress span");
  const parallax = $$("[data-parallax]");
  const timelines = $$("[data-timeline]");
  let lastY = window.scrollY, ticking = false, velocity = 0;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0).toFixed(4) + ")";
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 24);
      if (!document.body.classList.contains("nav-open")) nav.classList.toggle("is-hidden", y > lastY && y > 240);
    }
    velocity = y - lastY;
    lastY = y;
    if (!reduced) {
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const off = (r.top + r.height / 2 - innerHeight / 2) * -speed;
        el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
      });
    }
    timelines.forEach((tl) => {
      const r = tl.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      tl.style.setProperty("--progress", p.toFixed(4));
    });
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  // ------------------------------------------------------------ reveal on scroll
  $$("[data-stagger]").forEach((group) => {
    const step = parseInt(group.dataset.stagger, 10) || 90;
    Array.from(group.children).forEach((child, i) => {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", group.dataset.revealChildren || "up");
      child.style.setProperty("--delay", i * step + "ms");
    });
  });
  $$("[data-delay]").forEach((el) => el.style.setProperty("--delay", el.dataset.delay + "ms"));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduced) { el.textContent = target + suffix; return; }
    const dur = 1400, t0 = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(target * e) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // Fully clipped elements (pixel wipes) never "intersect", so they are revealed via their parent.
  const proxies = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (proxies.has(el)) {
        proxies.get(el).forEach((t) => t.classList.add("is-visible"));
        proxies.delete(el);
        if (!el.hasAttribute("data-reveal")) { io.unobserve(el); return; }
      }
      el.classList.add("is-visible");
      $$("[data-count]", el).concat(el.matches("[data-count]") ? [el] : []).forEach((c) => {
        if (!c.dataset.done) { c.dataset.done = "1"; animateCounter(c); }
      });
      $$("[data-fill]", el).concat(el.matches("[data-fill]") ? [el] : []).forEach((f) => {
        f.style.setProperty("--fill", f.dataset.fill + "%");
      });
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal], [data-count], [data-fill]").forEach((el) => {
    if (el.dataset.reveal === "pixel" && el.parentElement) {
      const parent = el.parentElement;
      if (!proxies.has(parent)) proxies.set(parent, []);
      proxies.get(parent).push(el);
      io.observe(parent);
    } else {
      io.observe(el);
    }
  });

  // ------------------------------------------------------------ split text (letter drop)
  $$("[data-split]").forEach((el) => {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    let i = 0;
    text.split(" ").forEach((word, wi, arr) => {
      const w = document.createElement("span");
      w.className = "word";
      w.setAttribute("aria-hidden", "true");
      for (const ch of word) {
        const s = document.createElement("span");
        s.className = "ch"; s.textContent = ch; s.style.setProperty("--i", i++);
        w.appendChild(s);
      }
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  // glitch pulses on headings
  $$("[data-glitch]").forEach((el) => {
    if (reduced) return;
    setInterval(() => {
      el.classList.add("is-glitching");
      setTimeout(() => el.classList.remove("is-glitching"), 380);
    }, 4200 + Math.random() * 2600);
  });

  // ------------------------------------------------------------ typewriter
  $$("[data-typer]").forEach((el) => {
    const words = JSON.parse(el.dataset.typer);
    if (reduced) { el.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    (function step() {
      const word = words[w];
      c += del ? -1 : 1;
      el.textContent = word.slice(0, c);
      let wait = del ? 40 : 85;
      if (!del && c === word.length) { del = true; wait = 1700; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; wait = 300; }
      setTimeout(step, wait);
    })();
  });

  // ------------------------------------------------------------ pixel sprite canvases
  function paintSprites() {
    if (!window.PixelSprites) return;
    $$("canvas[data-sprite]").forEach((cv) => {
      const sp = window.PixelSprites.SPRITES[cv.dataset.sprite];
      if (!sp) return;
      const scale = parseInt(cv.dataset.scale, 10) || 4;
      cv.width = sp.w * scale; cv.height = sp.h * scale;
      const ctx = cv.getContext("2d");
      const animName = cv.dataset.anim;
      const anim = animName && sp.anims[animName];
      const sw = cv.dataset.palette && window.PixelSprites.SWORDS[cv.dataset.palette];
      const pal = sw ? sw.pal : null;
      const draw = (f) => { ctx.clearRect(0, 0, cv.width, cv.height); window.PixelSprites.drawFrame(ctx, sp, f, 0, 0, scale, pal); };
      if (!anim || reduced) { draw(parseInt(cv.dataset.frame, 10) || 0); return; }
      let i = 0;
      draw(anim.frames[0]);
      setInterval(() => { i = (i + 1) % anim.frames.length; draw(anim.frames[i]); }, 1000 / anim.rate);
    });
  }
  paintSprites();

  // hero: Vinaya's idle sheet in the middle of the orbit, at its own pixel grid and a whole-number scale.
  // Frames: 0 stand, 1-2 phone, 3 relaxed, 4 headphones, 6-7 yawn (5 is skipped: its face drifts).
  const idleCv = $("[data-casual-idle]");
  if (idleCv && window.CasualIdle) {
    const H = window.CasualIdle;
    const ctx = idleCv.getContext("2d");
    const sheet = new Image();
    sheet.src = idleCv.dataset.sheet;
    let shown = -1;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const css = window.matchMedia("(max-width: 860px)").matches ? 4 / 3 : 2;   // css px per art pixel
      idleCv.style.width = H.w * css + "px"; idleCv.style.height = H.h * css + "px";
      const k = Math.max(1, Math.round(css * dpr));
      idleCv.width = H.w * k; idleCv.height = H.h * k;
      ctx.imageSmoothingEnabled = false; shown = -1;
    };
    fit(); window.addEventListener("resize", fit);
    // [frames, ms per frame]
    const DAY = [
      [[0], 2600], [[1, 2, 2, 2, 1], 520], [[0], 1800], [[3], 2200], [[0], 900],
      [[4, 4, 4], 480], [[0], 2200], [[6, 7, 7, 6], 520], [[0], 1600],
    ];
    const draw = (f) => {
      if (f === shown || !sheet.complete || !sheet.naturalWidth) return;
      shown = f;
      ctx.clearRect(0, 0, idleCv.width, idleCv.height);
      ctx.drawImage(sheet, f * H.w, 0, H.w, H.h, 0, 0, idleCv.width, idleCv.height);
    };
    sheet.onload = () => { shown = -1; draw(0); };
    if (!reduced) {
      let si = 0, t0 = performance.now();
      (function loop(ts) {
        let [frames, ms] = DAY[si];
        if (ts - t0 >= frames.length * ms) { si = (si + 1) % DAY.length; t0 = ts; [frames, ms] = DAY[si]; }
        draw(frames[Math.min(frames.length - 1, Math.floor((ts - t0) / ms))]);
        requestAnimationFrame(loop);
      })(t0);
    }
  }

  // ------------------------------------------------------------ tilt cards
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
        card.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
        card.style.setProperty("--mx", ((x + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--my", ((y + 0.5) * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg");
      });
    });
  }

  // ------------------------------------------------------------ copy email
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const done = () => {
        const old = btn.dataset.label || btn.textContent;
        btn.dataset.label = old;
        btn.textContent = "COPIED!";
        btn.classList.add("is-done");
        setTimeout(() => { btn.textContent = old; btn.classList.remove("is-done"); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.copy).then(done, done);
      else done();
    });
  });

  // ------------------------------------------------------------ ember / ash field
  const cv = $("#embers");
  if (cv && !reduced) {
    const ctx = cv.getContext("2d");
    let w, h, dpr;
    const N = Math.min(70, Math.round(innerWidth / 20));
    const palette = ["#e0115f", "#9b111e", "#8a0303", "#b2beb5", "#6a52d9", "#78863a"];
    const parts = [];
    const mouse = { x: -999, y: -999 };
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
    }
    function spawn(p, init) {
      p.x = Math.random() * w;
      p.y = init ? Math.random() * h : h + 10;
      p.s = (Math.random() < 0.8 ? 2 : 4) * dpr;
      p.vy = -(0.15 + Math.random() * 0.5) * dpr;
      p.vx = (Math.random() - 0.5) * 0.2 * dpr;
      p.c = palette[(Math.random() * palette.length) | 0];
      p.a = 0.25 + Math.random() * 0.55;
      p.t = Math.random() * 100;
    }
    resize();
    for (let i = 0; i < N; i++) { const p = {}; spawn(p, true); parts.push(p); }
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; }, { passive: true });
    (function frame() {
      ctx.clearRect(0, 0, w, h);
      const boost = Math.max(-6, Math.min(6, velocity)) * 0.35 * dpr;
      velocity *= 0.9;
      for (const p of parts) {
        p.t += 0.02;
        p.x += p.vx + Math.sin(p.t) * 0.25 * dpr;
        p.y += p.vy - boost;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy, R = 120 * dpr;
        if (d2 < R * R) { const f = (1 - Math.sqrt(d2) / R) * 2.2; p.x += (dx / (Math.sqrt(d2) + 1)) * f; p.y += (dy / (Math.sqrt(d2) + 1)) * f; }
        if (p.y < -10 || p.y > h + 20 || p.x < -10 || p.x > w + 10) spawn(p, false);
        ctx.globalAlpha = p.a * (0.7 + 0.3 * Math.sin(p.t * 3));
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      }
      requestAnimationFrame(frame);
    })();
  }
})();
