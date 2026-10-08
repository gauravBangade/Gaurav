import type { MoveId } from "../data/party";
import { prefersReducedMotion } from "../hooks/prefersReducedMotion";
import { toggleTheme } from "../hooks/useTheme";

/**
 * Move effects. Each one draws throwaway particles into a fixed overlay with
 * the Web Animations API — no React state, nothing left behind — and returns
 * how long it runs, which callers use as a cooldown and to time the
 * aftermath line. Under reduced motion only the meaningful part (Night
 * Shade's theme switch, Confusion's own no-op guard) happens.
 */

export type MoveContext = {
  /** The sprite that used the move; particles start from its centre. */
  sprite: HTMLElement | null;
  /** Psyduck's page-wide Confusion (usePsychicBlast). */
  confusion: () => void;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

let layer: HTMLDivElement | null = null;

function fxLayer() {
  if (layer?.isConnected) return layer;
  layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.className = "fx-layer";
  document.body.append(layer);
  return layer;
}

function originOf(el: HTMLElement | null) {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

type ParticleOptions = {
  x: number;
  y: number;
  /** A glyph (♥, ✦) or nothing for a plain dot. */
  text?: string;
  size: number;
  /** Stretch a dot into a streak: overrides `size` for its width and height. */
  width?: number;
  height?: number;
  color: string;
  keyframes: Keyframe[];
  duration: number;
  delay?: number;
  easing?: string;
};

function particle({ x, y, text, size, width, height, color, keyframes, duration, delay = 0, easing = "ease-out" }: ParticleOptions) {
  const el = document.createElement("span");
  el.className = text ? "fx-glyph" : "fx-dot";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  if (text) {
    el.textContent = text;
    el.style.fontSize = `${size}px`;
    el.style.color = color;
  } else {
    el.style.width = `${width ?? size}px`;
    el.style.height = `${height ?? size}px`;
    el.style.background = color;
  }
  fxLayer().append(el);
  const animation = el.animate(keyframes, { duration, delay, easing, fill: "both" });
  animation.onfinish = animation.oncancel = () => el.remove();
}

/** Keyframe transforms keep the particle centred on its (left, top) point. */
const at = (dx: number, dy: number, extra = "") => `translate(-50%, -50%) translate(${dx}px, ${dy}px) ${extra}`;

/** A full-screen layer (tint, vignette or flash) that fades through `opacities` and removes itself. */
function screenWash(background: string, opacities: number[], duration: number, delay = 0) {
  const show = () => {
    const wash = document.createElement("span");
    wash.className = "fx-flash";
    wash.style.background = background;
    fxLayer().append(wash);
    const fade = wash.animate(
      opacities.map((opacity) => ({ opacity })),
      { duration, easing: "ease-out", fill: "both" },
    );
    fade.onfinish = fade.oncancel = () => wash.remove();
  };
  // A tint with no delay goes in now, beneath the particles added after it; a
  // delayed flash goes in only when it starts, on top, so it can't show early.
  if (delay > 0) window.setTimeout(show, delay);
  else show();
}

/** Shakes the page content; `strength` is the first swing in px. */
function shakePage(strength: number, duration: number, delay = 0) {
  const s = strength;
  document.getElementById("page-root")?.animate(
    [0, -s, s, -s * 0.75, s * 0.75, -s * 0.4, s * 0.4, 0].map((d) => ({ transform: `translate(${d}px, ${d / 2}px)` })),
    { duration, delay },
  );
}

function darkestLariat({ sprite }: MoveContext) {
  sprite?.animate([{ transform: "rotate(0)" }, { transform: "rotate(-720deg)" }], {
    duration: 800,
    easing: "cubic-bezier(.5,0,.3,1)",
  });
  const width = window.innerWidth;
  const height = window.innerHeight;

  // The arena heats up: a dark-red vignette closes in from every edge.
  screenWash("radial-gradient(ellipse at center, transparent 30%, rgba(140, 20, 0, 0.6) 100%)", [0, 1, 1, 0], 1800);

  // A wall of flame rising along the whole bottom of the screen...
  for (let i = 0; i < 110; i++) {
    const rise = random(height * 0.25, height * 0.85);
    particle({
      x: random(-20, width + 20),
      y: height + 20,
      size: random(8, 20),
      color: pick(["#ff6b1a", "#ffb02e", "#e3350d", "#ffd36b"]),
      keyframes: [
        { transform: at(0, 0, "scale(1)"), opacity: 0.95 },
        { transform: at(random(-40, 40), -rise * 0.6, "scale(.8)"), opacity: 0.9, offset: 0.5 },
        { transform: at(random(-80, 80), -rise, "scale(.2)"), opacity: 0 },
      ],
      duration: random(900, 1500),
      delay: random(100, 700),
    });
  }
  // ...and embers drifting up all over it.
  for (let i = 0; i < 45; i++) {
    particle({
      x: random(0, width),
      y: random(height * 0.2, height),
      size: random(3, 6),
      color: pick(["#ffd36b", "#ffb02e"]),
      keyframes: [
        { transform: at(0, 0), opacity: 0 },
        { transform: at(random(-30, 30), -60), opacity: 1, offset: 0.3 },
        { transform: at(random(-60, 60), -random(140, 260)), opacity: 0 },
      ],
      duration: random(1000, 1600),
      delay: random(200, 800),
    });
  }

  // The lariat lands: an orange flash and the whole page shakes.
  screenWash("#ff8a3d", [0.4, 0], 450, 650);
  shakePage(9, 450, 650);
  return 1900;
}

/** Sand reads against the page: dark grains on the light theme, pale ones at night. */
const SAND = {
  light: { grains: ["#8f5f22", "#a87531", "#7a4f1c", "#c18f45"], haze: "rgba(176, 124, 52, 0.22)" },
  dark: { grains: ["#f0d79c", "#e2c07a", "#f7e7bf", "#d1aa64"], haze: "rgba(222, 186, 112, 0.14)" },
};

function sandStream({ sprite }: MoveContext) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const sand = SAND[document.documentElement.dataset.theme === "dark" ? "dark" : "light"];
  const duration = 3600;

  // The battle-screen tint: a wide band of haze drifting across the page while the storm blows.
  const haze = document.createElement("span");
  haze.className = "fx-haze";
  haze.style.setProperty("--sand-haze", sand.haze);
  fxLayer().append(haze);
  const drift = haze.animate(
    [
      { transform: "translateX(-50%)", opacity: 0 },
      { opacity: 1, offset: 0.15 },
      { opacity: 1, offset: 0.75 },
      { transform: "translateX(0)", opacity: 0 },
    ],
    { duration, easing: "linear", fill: "both" },
  );
  drift.onfinish = drift.oncancel = () => haze.remove();

  // Wind-stretched streaks plus a scatter of fine grains, all blowing left to right.
  for (let i = 0; i < 220; i++) {
    const streak = i < 150;
    const tilt = random(-4, 9);
    const y = random(-20, height + 20);
    const peak = streak ? random(0.6, 0.9) : random(0.7, 1);
    particle({
      x: -30,
      y,
      size: random(2, 4),
      ...(streak ? { width: random(10, 26), height: random(1.5, 3) } : {}),
      color: pick(sand.grains),
      keyframes: [
        { transform: at(0, 0, `rotate(${tilt}deg)`), opacity: 0 },
        { transform: at(width * 0.2, random(-25, 25), `rotate(${tilt}deg)`), opacity: peak, offset: 0.12 },
        { transform: at(width * 0.7, random(-60, 60), `rotate(${tilt}deg)`), opacity: peak, offset: 0.7 },
        { transform: at(width + 60, random(-90, 90), `rotate(${tilt}deg)`), opacity: 0 },
      ],
      duration: random(850, 1600),
      delay: random(0, duration - 1500),
      easing: "linear",
    });
  }

  sprite?.animate(
    [
      { transform: "translateY(0)" },
      { transform: "translateY(-14px)" },
      { transform: "translateY(0)" },
      { transform: "translateY(-6px)" },
      { transform: "translateY(0)" },
    ],
    { duration: 600, easing: "ease-in" },
  );
  document.getElementById("page-root")?.animate(
    [0, -5, 5, -4, 4, -2, 2, 0].map((dx) => ({ transform: `translateX(${dx}px)` })),
    { duration: 520, delay: 380, easing: "linear" },
  );
  return duration;
}

function nightShade({ sprite }: MoveContext) {
  const { x, y } = originOf(sprite);
  const reach = Math.hypot(window.innerWidth, window.innerHeight) * 2;
  particle({
    x,
    y,
    size: 20,
    color: "rgba(80, 40, 120, 0.55)",
    keyframes: [
      { transform: at(0, 0, "scale(0)"), opacity: 0.9 },
      { transform: at(0, 0, `scale(${reach / 20})`), opacity: 0 },
    ],
    duration: 900,
    easing: "cubic-bezier(.3,0,.2,1)",
  });
  sprite?.animate([{ opacity: 1 }, { opacity: 0.15 }, { opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: 700 });
  window.setTimeout(toggleTheme, 220);
  return 1000;
}

function moonblast({ sprite }: MoveContext) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const moonSize = Math.min(width, height) * 0.2;
  const mx = width / 2;
  const my = height * 0.26;
  const duration = 2900;

  // Night falls over the whole screen while the moon gathers power.
  screenWash("linear-gradient(180deg, rgba(28, 10, 48, 0.62), rgba(70, 20, 70, 0.42))", [0, 1, 1, 0], duration);
  sprite?.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.15) translateY(-6px)" }, { transform: "scale(1)" }],
    { duration: 900, easing: "ease-in-out" },
  );

  // Stars twinkle everywhere.
  for (let i = 0; i < 70; i++) {
    particle({
      x: random(0, width),
      y: random(0, height),
      text: pick(["✦", "✧", "·"]),
      size: random(8, 18),
      color: pick(["#ffffff", "#ffe3f1", "#fbc4e0"]),
      keyframes: [
        { transform: at(0, 0, "scale(0)"), opacity: 0 },
        { transform: at(0, 0, "scale(1)"), opacity: 1, offset: 0.3 },
        { transform: at(0, 0, "scale(.6)"), opacity: 0.6, offset: 0.6 },
        { transform: at(0, 0, "scale(1.1)"), opacity: 1, offset: 0.8 },
        { transform: at(0, 0, "scale(0)"), opacity: 0 },
      ],
      duration: random(1600, 2400),
      delay: random(0, 600),
      easing: "ease-in-out",
    });
  }

  // The moon rises, glows brighter as it charges, then fires.
  const moon = document.createElement("span");
  moon.className = "fx-moon";
  Object.assign(moon.style, { left: `${mx}px`, top: `${my}px`, width: `${moonSize}px`, height: `${moonSize}px` });
  fxLayer().append(moon);
  const rise = moon.animate(
    [
      { transform: "translate(-50%, 40%) scale(.3)", opacity: 0 },
      { transform: "translate(-50%, -50%) scale(1)", opacity: 1, offset: 0.3 },
      { transform: "translate(-50%, -50%) scale(1.08)", opacity: 1, filter: "brightness(1.5)", offset: 0.5 },
      { transform: "translate(-50%, -50%) scale(.9)", opacity: 1, offset: 0.56 },
      { transform: "translate(-50%, -50%) scale(1.4)", opacity: 0 },
    ],
    { duration: 2300, easing: "ease-in-out", fill: "both" },
  );
  rise.onfinish = rise.oncancel = () => moon.remove();

  // The blast: a pink shockwave rolls out from the moon over the entire screen...
  const fire = 1250;
  const reach = Math.hypot(width, height) * 2.2;
  particle({
    x: mx,
    y: my,
    size: 40,
    color: "radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(255, 150, 205, 0.7) 45%, rgba(255, 150, 205, 0) 70%)",
    keyframes: [
      { transform: at(0, 0, "scale(0)"), opacity: 1 },
      { transform: at(0, 0, `scale(${reach / 40})`), opacity: 0 },
    ],
    duration: 1000,
    delay: fire,
    easing: "cubic-bezier(.2,.6,.3,1)",
  });
  // ...sparkles fly to every edge...
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2 + random(-0.1, 0.1);
    const distance = reach / 2;
    particle({
      x: mx,
      y: my,
      text: pick(["✦", "♥", "✦", "❀"]),
      size: random(14, 26),
      color: pick(["#ffffff", "#f4a6c8", "#e86aa6", "#ffd1e8"]),
      keyframes: [
        { transform: at(0, 0, "scale(.4)"), opacity: 0 },
        { transform: at(0, 0, "scale(.6)"), opacity: 1, offset: 0.04 },
        { transform: at(Math.cos(angle) * distance, Math.sin(angle) * distance, "scale(1.2) rotate(180deg)"), opacity: 0 },
      ],
      duration: random(900, 1300),
      delay: fire + random(0, 120),
      easing: "cubic-bezier(.2,.6,.4,1)",
    });
  }
  // ...then a pink flash and the page shakes.
  screenWash("#ffc2e1", [0.75, 0], 600, fire + 80);
  shakePage(8, 480, fire + 80);
  return duration;
}

function braveBird({ sprite }: MoveContext) {
  if (!(sprite instanceof HTMLImageElement)) return 0;
  const rect = sprite.getBoundingClientRect();
  const glow = "drop-shadow(0 0 12px #7ab8ff) brightness(1.5)";

  // 1. Charge: glow and pull back.
  const charge = sprite.animate(
    [
      { filter: "none", transform: "none" },
      { filter: glow, transform: "translate(14px, 10px) rotate(8deg)" },
    ],
    { duration: 500, easing: "ease-in", fill: "forwards" },
  );

  window.setTimeout(() => {
    // 2. Dash: the bird rockets off the top-left of the screen, a streak trailing behind it.
    sprite.style.visibility = "hidden";
    const sx = rect.left + rect.width / 2;
    const sy = rect.top + rect.height / 2;
    const ex = -120;
    const ey = Math.max(-120, sy - window.innerWidth * 0.5);
    const angle = Math.atan2(ey - sy, ex - sx);

    const streak = document.createElement("span");
    streak.className = "fx-streak";
    Object.assign(streak.style, { left: `${sx}px`, top: `${sy - 11}px`, width: `${Math.hypot(ex - sx, ey - sy)}px` });
    fxLayer().append(streak);
    const trail = streak.animate(
      [
        { transform: `rotate(${angle}rad) scaleX(0)`, opacity: 1 },
        { transform: `rotate(${angle}rad) scaleX(1)`, opacity: 1, offset: 0.5 },
        { transform: `rotate(${angle}rad) scaleX(1)`, opacity: 0 },
      ],
      { duration: 650, easing: "ease-out", fill: "forwards" },
    );
    trail.onfinish = trail.oncancel = () => streak.remove();

    const bird = sprite.cloneNode() as HTMLImageElement;
    bird.className = "fx-sprite";
    Object.assign(bird.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      visibility: "visible",
      filter: glow,
    });
    fxLayer().append(bird);
    bird.animate([{ transform: "none" }, { transform: `translate(${ex - sx}px, ${ey - sy}px) scale(1.8)` }], {
      duration: 340,
      easing: "cubic-bezier(.6,0,.9,.4)",
      fill: "forwards",
    });

    // 3. Impact: white flash and a page shake.
    window.setTimeout(() => {
      const flash = document.createElement("span");
      flash.className = "fx-flash";
      fxLayer().append(flash);
      const fade = flash.animate([{ opacity: 0.75 }, { opacity: 0 }], { duration: 450, fill: "forwards" });
      fade.onfinish = fade.oncancel = () => flash.remove();
      document.getElementById("page-root")?.animate(
        [0, -8, 8, -6, 6, -3, 3, 0].map((d) => ({ transform: `translate(${d}px, ${d / 2}px)` })),
        { duration: 420 },
      );
    }, 320);

    // 4. Swoop back down onto its perch.
    window.setTimeout(() => {
      bird.remove();
      charge.cancel();
      sprite.style.visibility = "";
      sprite.animate(
        [
          { transform: "translateY(-140px)", opacity: 0 },
          { transform: "translateY(6px)", opacity: 1, offset: 0.8 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 500, easing: "ease-out" },
      );
    }, 950);
  }, 520);

  return 2000;
}

/** Tea, not slime: one splash of matcha that hits the screen, flings droplets and runs down it. */
function splash(x: number, y: number, delay: number) {
  const size = random(60, 130);
  const group = document.createElement("span");
  group.className = "fx-splash";
  Object.assign(group.style, { left: `${x}px`, top: `${y}px` });
  fxLayer().append(group);

  // The puddle: thin and see-through, with a splash edge of rounded lobes — a
  // curve from each valley to the next that bulges out through a random peak —
  // and it squashes flat on impact.
  const puddle = document.createElement("span");
  puddle.className = "fx-splash__puddle";
  const half = size / 2;
  const lobes = Math.round(random(8, 12));
  const valleys = Array.from({ length: lobes }, (_, k) => {
    const angle = (k / lobes) * Math.PI * 2;
    const reach = half * random(0.62, 0.74);
    return [half + Math.cos(angle) * reach, half + Math.sin(angle) * reach];
  });
  const edge = valleys.map((_, k) => {
    const [vx, vy] = valleys[(k + 1) % lobes];
    const angle = ((k + 0.5) / lobes) * Math.PI * 2;
    const reach = half * random(0.95, 1.25);
    return `Q ${half + Math.cos(angle) * reach} ${half + Math.sin(angle) * reach} ${vx} ${vy}`;
  });
  Object.assign(puddle.style, {
    width: `${size}px`,
    height: `${size}px`,
    clipPath: `path("M ${valleys[0][0]} ${valleys[0][1]} ${edge.join(" ")} Z")`,
  });
  group.append(puddle);
  puddle.animate(
    [
      { transform: "translate(-50%, -50%) scale(.2, .2)" },
      { transform: "translate(-50%, -50%) scale(1.35, .7)", offset: 0.4 },
      { transform: "translate(-50%, -50%) scale(.95, 1.05)", offset: 0.7 },
      { transform: "translate(-50%, -50%) scale(1)" },
    ],
    { duration: 260, delay, easing: "ease-out", fill: "both" },
  );

  // Droplets flung out from the impact, which land and stay.
  for (let d = 0; d < 9; d++) {
    const drop = document.createElement("span");
    drop.className = "fx-splash__drop";
    const dot = random(4, 13);
    Object.assign(drop.style, { width: `${dot}px`, height: `${dot}px` });
    group.append(drop);
    const angle = random(0, Math.PI * 2);
    const reach = size * random(0.6, 1.25);
    drop.animate(
      [
        { transform: "translate(-50%, -50%) scale(0)" },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * reach}px), calc(-50% + ${Math.sin(angle) * reach}px)) scale(1)` },
      ],
      { duration: 220, delay: delay + 20, easing: "cubic-bezier(.2,.8,.4,1)", fill: "both" },
    );
  }

  // Drips: thin trails that start a moment after impact and run down under gravity.
  const drips = Math.round(random(2, 4));
  for (let d = 0; d < drips; d++) {
    const drip = document.createElement("span");
    drip.className = "fx-splash__drip";
    Object.assign(drip.style, {
      left: `${random(-size * 0.35, size * 0.35)}px`,
      top: `${size * random(0.05, 0.25)}px`,
      width: `${random(4, 9)}px`,
      height: `${random(90, 260)}px`,
    });
    group.append(drip);
    drip.animate([{ transform: "translateX(-50%) scaleY(0)" }, { transform: "translateX(-50%) scaleY(1)" }], {
      duration: random(1400, 2200),
      delay: delay + random(250, 550),
      easing: "cubic-bezier(.45,0,.75,.6)",
      fill: "both",
    });
  }

  // Then the whole splash thins out and slides away.
  const fade = group.animate(
    [{ opacity: 1, transform: "translateY(0)" }, { opacity: 1, offset: 0.7 }, { opacity: 0, transform: "translateY(24px)" }],
    { duration: 3300, delay, easing: "ease-in", fill: "both" },
  );
  fade.onfinish = fade.oncancel = () => group.remove();
}

function matchaGotcha({ sprite }: MoveContext) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  sprite?.animate(
    [-12, 12, -8, 8, 0].map((deg) => ({ transform: `rotate(${deg}deg)` })),
    { duration: 600, easing: "ease-in-out" },
  );

  // The whole screen steeps green...
  screenWash("rgba(110, 160, 60, 0.28)", [0, 1, 1, 0], 2300, 150);
  // ...while matcha pours down across every part of it.
  for (let i = 0; i < 150; i++) {
    const drop = i < 110;
    const fall = height + 80;
    particle({
      x: random(-10, width + 10),
      y: -30,
      size: random(5, 10),
      ...(drop ? { width: random(3, 6), height: random(10, 20) } : {}),
      color: pick(["#7fb24a", "#a6cf6b", "#5a8a32", "#d9ecb1"]),
      keyframes: [
        { transform: at(0, 0), opacity: 0 },
        { transform: at(random(-10, 10), fall * 0.15), opacity: 0.95, offset: 0.12 },
        { transform: at(random(-30, 30), fall), opacity: 0.85 },
      ],
      duration: random(900, 1500),
      delay: random(150, 1100),
      easing: "cubic-bezier(.5,0,.9,.6)",
    });
  }
  // Foam bubbles rising from the bottom as the bowl fills.
  for (let i = 0; i < 40; i++) {
    particle({
      x: random(0, width),
      y: height + 10,
      text: "○",
      size: random(10, 18),
      color: "#eaf6d3",
      keyframes: [
        { transform: at(0, 0, "scale(.6)"), opacity: 0 },
        { transform: at(random(-20, 20), -random(80, 220), "scale(1)"), opacity: 0.9, offset: 0.6 },
        { transform: at(random(-30, 30), -random(240, 360), "scale(1.2)"), opacity: 0 },
      ],
      duration: random(1200, 1700),
      delay: random(700, 1300),
    });
  }
  // The prank: matcha splashes across the screen and runs down it like real liquid.
  for (let i = 0; i < 8; i++) splash(random(80, width - 80), random(60, height * 0.75), random(260, 1000));

  // ...and it signs its work.
  const stamp = document.createElement("span");
  stamp.className = "fx-stamp";
  stamp.textContent = "GOTCHA!";
  fxLayer().append(stamp);
  const slam = stamp.animate(
    [
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(3)", opacity: 0 },
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(.92)", opacity: 1, offset: 0.12 },
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(1)", opacity: 1, offset: 0.16 },
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(1)", opacity: 1, offset: 0.8 },
      { transform: "translate(-50%, -50%) rotate(-8deg) scale(1.1)", opacity: 0 },
    ],
    { duration: 2600, delay: 1000, easing: "ease-out", fill: "both" },
  );
  slam.onfinish = slam.oncancel = () => stamp.remove();
  shakePage(6, 360, 1300);
  return 4300;
}

const MOVES: Record<MoveId, (ctx: MoveContext) => number> = {
  "darkest-lariat": darkestLariat,
  confusion: (ctx) => {
    ctx.confusion();
    return 4400;
  },
  "sand-stream": sandStream,
  "night-shade": nightShade,
  moonblast,
  "brave-bird": braveBird,
  "matcha-gotcha": matchaGotcha,
};

/** Plays a move; returns how many ms until it has finished. */
export function playMove(id: MoveId, ctx: MoveContext): number {
  if (prefersReducedMotion()) {
    if (id === "night-shade") toggleTheme();
    return 600;
  }
  return MOVES[id](ctx);
}
