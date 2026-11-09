/* The room: Vinaya's tech/gamer room (img/room/room.png, 429x248 pixel art) as the home page's navigation.
 *
 * Each object is a real link (keyboard, screen readers and no-JS all work). With JS he walks to whatever you click,
 * taps it and the page opens; any second click or key skips straight there. In the room (click its floor or Tab
 * into it) the arrows / A-D walk him and Up / W / E / Enter opens what he's standing at.
 * Reduced motion: no walking, links open directly.
 */
(function () {
  "use strict";
  const stage = document.querySelector("[data-room]");
  if (!stage) return;
  const HERO = window.CasualHero;                 // his frames (img/hero/herohd-casual.png): 1 texel = 1 room pixel
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NW = 429, NH = 248, FEET = 215;          // room size in art pixels; the floor line his feet stand on
  const POSE_MS = 950;                            // how long he holds the pose before the page opens
  const img = stage.querySelector(".room-img");
  const cv = stage.querySelector(".room-fx");
  const ctx = cv.getContext("2d");
  // each .room-obj link: placed over its object from data-rect (art px), with where he stands and his pose there
  const objs = Array.from(stage.querySelectorAll(".room-obj")).map((a) => {
    const r = a.dataset.rect.split(",").map(Number);
    a.style.left = (r[0] / NW * 100) + "%"; a.style.top = (r[1] / NH * 100) + "%";
    a.style.width = ((r[2] - r[0]) / NW * 100) + "%"; a.style.height = ((r[3] - r[1]) / NH * 100) + "%";
    const o = { a: a, rect: r, stand: Number(a.dataset.stand) };
    // what he does there (Vinaya's pose art, already on the room grid): image + its box in art px
    if (a.dataset.pose) { o.pose = new Image(); o.pose.src = stage.dataset.room + a.dataset.pose; o.box = a.dataset.box.split(",").map(Number); }
    return o;
  });

  // ---- crisp size: a whole number of device pixels per art pixel
  let k = 1;
  /** Sizes the room to the container at a whole number of device pixels per art pixel. */
  function fit() {
    const dpr = window.devicePixelRatio || 1;
    const avail = stage.parentElement.clientWidth;
    k = Math.max(1, Math.floor(avail * dpr / NW));
    let css = NW * k / dpr;
    // high-DPI screens (phones): fill the width; at 2-3 device px per css px uneven art pixels can't be seen
    if (dpr >= 2 && css < avail) { k = Math.ceil(avail * dpr / NW); css = avail; }
    if (css > avail) css = avail;                // tiny screens: shrink to fit
    stage.style.width = css + "px";
    stage.style.height = (css * NH / NW) + "px";
    cv.width = NW * k; cv.height = NH * k;
    ctx.imageSmoothingEnabled = false;
  }
  fit();
  window.addEventListener("resize", fit);

  // ---- art
  // starts loading an image and returns it
  const load = (src) => { const im = new Image(); im.src = src; return im; };
  const base = stage.dataset.room;
  const L = {
    fans: load(base + "glow-fans.png"), screens: load(base + "glow-screens.png"),
    eyes: load(base + "glow-eyes.png"), shut: load(base + "eyes-closed.png"),
  };
  const sheet = load(stage.dataset.hero);
  const FW = HERO ? HERO.w : 0, FH = HERO ? HERO.h : 0;
  const A = HERO ? HERO.anims : { idle: [0], walk: [0] };
  const IDLE = A.idle, RUN = A.walk;
  // little things he does while standing around
  const ACTS = ["phone", "headphones", "relax", "yawn", "phone", "headphones"].filter((n) => A[n]);
  let act = null, nextAct = performance.now() + 3500;
  // true once an image has loaded
  const ok = (im) => im.complete && im.naturalWidth;

  // ---- him
  let x = 196, face = 1, hop = 0, walking = 0, trip = null, near = null, focused = false;
  const keys = { left: false, right: false };

  /** Opens an object's page, with the pixel transition when site.js is loaded. */
  function go(o) {
    if (window.PixelTransition) window.PixelTransition.go(o.a.href); else window.location.href = o.a.href;
  }
  // A trip: walk to the object -> act it out (his pose there) -> the page opens. Any click or key skips ahead.
  /** Ends the trip and opens the page (also bound to any click or key, to skip ahead). */
  function leave() {
    if (!trip || trip.phase === "gone") return;
    trip.phase = "gone"; x = trip.to;
    window.removeEventListener("keydown", leave, true);
    window.removeEventListener("pointerdown", leave, true);
    trip.o.a.classList.add("is-tapped");
    go(trip.o);
  }
  /** He reached the object: hold its pose, or (no pose art) hop and open the page. */
  function arrive(ts) {
    x = trip.to;
    trip.o.a.classList.add("is-tapped");
    if (trip.o.pose && ok(trip.o.pose)) { trip.phase = "pose"; trip.pt = ts; stage.classList.add("is-posing"); } else { hop = 4; leave(); }
  }
  /** Starts a trip to object o; the walk takes longer the further he is. */
  function walkTo(o) {
    const dist = Math.abs(o.stand - x);
    face = o.stand >= x ? 1 : -1;
    trip = { o: o, from: x, to: o.stand, t: performance.now(), ms: dist < 2 ? 0 : Math.min(720, 120 + dist * 3.6), phase: "walk" };
    setTimeout(() => {
      window.addEventListener("keydown", leave, true);
      window.addEventListener("pointerdown", leave, true);
    }, 0);
  }

  // a click on an object sends him there instead of opening the link at once (a second click skips ahead)
  objs.forEach((o) => {
    o.a.addEventListener("click", (e) => {
      if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      if (trip) { leave(); return; }
      walkTo(o);
    });
  });

  // walking with the keyboard once the room has focus
  stage.addEventListener("focus", () => { focused = true; stage.classList.add("is-active"); });
  stage.addEventListener("blur", () => { focused = false; keys.left = keys.right = false; stage.classList.remove("is-active"); });
  stage.addEventListener("pointerdown", (e) => { if (e.target === stage || e.target === cv) stage.focus(); });
  stage.addEventListener("keydown", (e) => {
    if (e.target !== stage || trip) return;
    const k2 = e.key;
    if (k2 === "ArrowLeft" || k2 === "a" || k2 === "A") { keys.left = true; e.preventDefault(); }
    else if (k2 === "ArrowRight" || k2 === "d" || k2 === "D") { keys.right = true; e.preventDefault(); }
    else if (k2 === "ArrowUp" || k2 === "w" || k2 === "W" || k2 === "e" || k2 === "E" || k2 === "Enter") {
      e.preventDefault();
      if (near) walkTo(near);
    } else if (k2 === "Escape") stage.blur();
  });
  stage.addEventListener("keyup", (e) => {
    const k2 = e.key;
    if (k2 === "ArrowLeft" || k2 === "a" || k2 === "A") keys.left = false;
    if (k2 === "ArrowRight" || k2 === "d" || k2 === "D") keys.right = false;
  });
  // coming back with the browser's Back button: reset the room
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    trip = null; stage.classList.remove("is-posing");
    objs.forEach((o) => o.a.classList.remove("is-tapped"));
  });

  // ---- frame loop
  let last = performance.now();
  /** Frame loop: moves him (trip, keyboard or idle acts), then draws the glow layers, the TV blink and him or his pose. */
  function tick(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000); last = ts;
    let frame;
    if (trip && trip.phase === "walk") {
      const p = trip.ms ? Math.min(1, (ts - trip.t) / trip.ms) : 1;
      x = trip.from + (trip.to - trip.from) * (1 - Math.pow(1 - p, 2));
      frame = RUN[Math.floor((ts - trip.t) / 110) % RUN.length];
      if (p >= 1) arrive(ts);
    } else if (trip && trip.phase === "pose") {
      frame = IDLE[0];
      if (ts - trip.pt > POSE_MS) leave();
    } else if (!trip && !reduced && (keys.left !== keys.right)) {
      face = keys.right ? 1 : -1;
      x = Math.max(14, Math.min(NW - 14, x + face * 96 * dt));
      walking += dt;
      frame = RUN[Math.floor(walking / 0.12) % RUN.length];
    } else {
      walking = 0;
      if (!act && !reduced && ts > nextAct && !trip) act = { f: A[ACTS[Math.floor(Math.random() * ACTS.length)]], t: ts };
      if (act) {
        const i = Math.floor((ts - act.t) / 420);
        if (i >= act.f.length) { act = null; nextAct = ts + 3500 + Math.random() * 4000; frame = IDLE[0]; }
        else frame = act.f[i];
      } else frame = IDLE[0];
    }
    if (trip || keys.left !== keys.right) { act = null; nextAct = ts + 4000; }
    if (hop > 0.5 && A.jump) frame = A.jump[0];
    hop = Math.max(0, hop - 30 * dt);

    // what he's standing at (keyboard walking)
    let n = null;
    if (focused) objs.forEach((o) => { if (Math.abs(o.stand - x) < 20 && (!n || Math.abs(o.stand - x) < Math.abs(n.stand - x))) n = o; });
    if (n !== near) { if (near) near.a.classList.remove("is-near"); near = n; if (near) near.a.classList.add("is-near"); }

    ctx.clearRect(0, 0, cv.width, cv.height);
    const t = ts / 1000;
    ctx.globalCompositeOperation = "lighter";
    if (ok(L.fans)) { ctx.globalAlpha = 0.18 + 0.16 * Math.sin(t * 2.1); ctx.drawImage(L.fans, 0, 0, cv.width, cv.height); }
    if (ok(L.screens)) { ctx.globalAlpha = 0.1 + 0.06 * Math.sin(t * 7.3) * Math.sin(t * 1.7); ctx.drawImage(L.screens, 0, 0, cv.width, cv.height); }
    if (ok(L.eyes)) { ctx.globalAlpha = 0.15 + 0.15 * Math.sin(t * 1.3); ctx.drawImage(L.eyes, 0, 0, cv.width, cv.height); }
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    const blink = (t % 4.6) < 0.14 || ((t + 0.3) % 9.1) < 0.12;   // the eyes on the old TV blink now and then
    if (blink && ok(L.shut)) ctx.drawImage(L.shut, 0, 0, cv.width, cv.height);

    const posing = trip && trip.phase !== "walk" && trip.o.pose && ok(trip.o.pose) && trip.pt;
    if (posing) {
      const b = trip.o.box;
      ctx.drawImage(trip.o.pose, b[0] * k, b[1] * k, b[2] * k, b[3] * k);
    } else if (HERO && ok(sheet)) {
      ctx.save();
      const dx = Math.round(x - FW / 2), dy = Math.round(FEET - FH - hop);
      if (face < 0) { ctx.translate((dx * 2 + FW) * k, 0); ctx.scale(-1, 1); }
      ctx.drawImage(sheet, frame * FW, 0, FW, FH, dx * k, dy * k, FW * k, FH * k);
      ctx.restore();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  stage.classList.add("is-live");
})();
