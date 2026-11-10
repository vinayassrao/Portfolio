/*
 * Small pixel-art icons for the page canvases (chapter cards, skill groups, the contact letter, the IBM logo).
 * Each sprite is authored as rows of characters; each character is a palette key and "." is transparent.
 * site.js paints every <canvas data-sprite="name" data-scale="n"> with the matching sprite.
 */
(function (global) {
  "use strict";

  // ---------------------------------------------------------------- creatures
  const BAT_PAL = { K: "#0d0a1a", I: "#5a43c2", i: "#2b1d70", E: "#ff3b5c", F: "#8b78ff" };
  const BAT = [
    [
      "K..............K", "KK....K..K....KK", "KIK..KKKKKK..KIK", "KIIK.KiiiiK.KIIK",
      "KIiIKiEiiEiKIiIK", ".KIiIiiiiiiIiIK.", "..KIIiiFFiiIIK..", "...KKKiiiiKKK...",
      "......KiiK......", ".......KK.......", "................", "................",
    ],
    [
      "................", "................", "......K..K......", ".....KKKKKK.....",
      ".....KiiiiK.....", "....KiEiiEiK....", "..KKIiiiiiiIKK..", ".KIIiiiFFiiiIIK.",
      "KIiIKKiiiiKKIiIK", "KiIK..KiiK..KIiK", "KIK....KK....KIK", "KK............KK",
    ],
  ];

  // ---------------------------------------------------------------- items & props
  const SHARD_PAL = { K: "#2a0610", P: "#ffb3c4", R: "#e0115f", r: "#9b111e" };
  const SHARD = [["...KK...", "..KPRK..", ".KPRRrK.", "KPRRRRrK", "KRRRRrrK", ".KRRrrK.", "..KRrK..", "...KK..."]];

  // the iron sword icon (relic): blade, guard and grip keys 1-5
  const SWORD_ICON_PAL = { K: "#121315", 1: "#dfe3dd", 2: "#8a9096", 3: "#ffffff", 4: "#b08a3e", 5: "#5a3a22" };
  const SWORD_ICON = [[
    ".........KK.", "........K31K", ".......K12K.", "......K12K..",
    ".....K12K...", "..K.K12K....", "..K412K.....", "...K4K......",
    "..K5K4K.....", ".K5K..K.....", "K5K.........", "KK..........",
  ]];

  const CHEST_PAL = { K: "#1a1210", B: "#8a5530", b: "#54321b", A: "#c4c9c2", G: "#f2c14e" };
  const CHEST = [["..KKKKKKKK..", ".KbBBBBBBbK.", "KbBBBBBBBBbK", "KAAAAGGAAAAK", "KbBBBGGBBBbK", "KbBBBBBBBBbK", "KbBBBBBBBBbK", "KAAAAAAAAAAK", "KKKKKKKKKKKK"]];

  const SCROLL_PAL = { K: "#1a1612", P: "#eadfc4", p: "#b8a77f", k: "#6b5a45", R: "#e0115f" };
  const SCROLL = [["KKKKKKKKKKK.", "KpPPPPPPPpK.", ".KPPPPPPPK..", ".KPkkkkkPK..", ".KPPPPPPPK..", ".KPkkkkPPK..", ".KPPPPPPPK..", ".KPkkkkRRK..", ".KPPPPPRRK..", "KpPPPPPPPpK.", "KKKKKKKKKKK."]];

  const LETTER_PAL = { K: "#121315", W: "#dfe3dd", w: "#9aa19c", R: "#e0115f" };
  const LETTER = [["KKKKKKKKKKKK", "KKWWWWWWWWKK", "KWKWWWWWWKWK", "KWWKWWWWKWWK", "KWWWKRRKWWWK", "KWWWWRRWWWWK", "KWWWWWWWWWWK", "KwwwwwwwwwwK", "KKKKKKKKKKKK"]];

  const DOOR_PAL = { K: "#121315", A: "#9aa19c", I: "#5a43c2", i: "#2b1d70", R: "#e0115f" };
  const DOOR_ICON = [["...KKKKKK...", "..KAAAAAAK..", ".KAIIIIIIAK.", "KAIiiiiiiIAK", "KAIiiiiiiIAK", "KAIiiiiiiIAK", "KAIiiiiRiIAK", "KAIiiiiiiIAK", "KAIiiiiiiIAK", "KAIiiiiiiIAK", "KAAAAAAAAAAK", "KKKKKKKKKKKK"]];

  // ---------------------------------------------------------------- IBM 8-bar logo, pixelated
  // 40 columns. Each of the 8 bars is 2px tall with a 1px gap. Spans are [from, to] columns,
  // traced from the logo's construction grid.
  const IBM_BARS = [
    [[2, 8], [10, 19], [22, 27], [32, 37]],
    [[2, 8], [10, 21], [22, 28], [31, 37]],
    [[4, 6], [12, 14], [18, 21], [24, 29], [31, 35]],
    [[4, 6], [12, 20], [24, 35]],
    [[4, 6], [12, 20], [24, 26], [28, 31], [33, 35]],
    [[4, 6], [12, 14], [18, 21], [24, 26], [29, 31], [33, 35]],
    [[2, 8], [10, 21], [22, 26], [29, 30], [33, 37]],
    [[2, 8], [10, 19], [22, 26], [30, 30], [33, 37]],
  ];
  const IBM_ROWS = [];
  IBM_BARS.forEach((spans, i) => {
    [0, 1].forEach((half) => {
      const row = new Array(40).fill(".");
      spans.forEach(([a, b]) => {
        let end = b;
        if (a === 10 && i === 0 && half === 0) end = b - 1;        // round the B's corners
        if (a === 10 && i === 7 && half === 1) end = b - 1;
        for (let x = a; x <= end; x++) row[x] = half === 0 ? "L" : "B";
      });
      if (i === 3 && half === 0) row[30] = ".";                    // the notch where the M's V begins
      IBM_ROWS.push(row.join(""));
    });
    if (i < IBM_BARS.length - 1) IBM_ROWS.push(".".repeat(40));
  });
  const IBM_PAL = { B: "#4589ff", L: "#78a9ff" };

  // ---------------------------------------------------------------- helpers
  /** Pads or trims every frame to exactly w x h characters ("." = transparent). */
  function normalise(frames, w, h) {
    return frames.map((rows) => Array.from({ length: h }, (_, y) => ((rows[y] || "") + ".".repeat(w)).slice(0, w)));
  }

  /** Builds a sprite record: size, palette, normalised frames and named animations ({ frames, rate }). */
  function def(w, h, palette, frames, anims) {
    return { w: w, h: h, palette: palette, frames: normalise(frames, w, h), anims: anims || {} };
  }

  const SPRITES = {
    bat: def(16, 12, BAT_PAL, BAT, { idle: { frames: [0, 1], rate: 8 } }),
    shard: def(8, 8, SHARD_PAL, SHARD),
    relic: def(12, 12, SWORD_ICON_PAL, SWORD_ICON),
    chest: def(12, 9, CHEST_PAL, CHEST),
    scroll: def(12, 11, SCROLL_PAL, SCROLL),
    letter: def(12, 9, LETTER_PAL, LETTER),
    door: def(12, 12, DOOR_PAL, DOOR_ICON),
    ibm: def(40, 23, IBM_PAL, [IBM_ROWS]),
  };

  /** Paints one frame of a sprite onto a 2D context at (dx, dy), each art pixel as a scale x scale square. */
  function drawFrame(ctx, sprite, frame, dx, dy, scale) {
    const s = scale || 1;
    const pal = sprite.palette;
    const rows = sprite.frames[frame % sprite.frames.length];
    for (let y = 0; y < sprite.h; y++) {
      const row = rows[y];
      for (let x = 0; x < sprite.w; x++) {
        const c = pal[row[x]];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(dx + x * s, dy + y * s, s, s);
      }
    }
  }

  global.PixelSprites = { SPRITES: SPRITES, drawFrame: drawFrame };
})(window);
