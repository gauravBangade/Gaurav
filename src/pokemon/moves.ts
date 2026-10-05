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
  color: string;
  keyframes: Keyframe[];
  duration: number;
  delay?: number;
  easing?: string;
};

function particle({ x, y, text, size, color, keyframes, duration, delay = 0, easing = "ease-out" }: ParticleOptions) {
  const el = document.createElement("span");
  el.className = text ? "fx-glyph" : "fx-dot";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  if (text) {
    el.textContent = text;
    el.style.fontSize = `${size}px`;
    el.style.color = color;
  } else {
    el.style.width = el.style.height = `${size}px`;
    el.style.background = color;
  }
  fxLayer().append(el);
  const animation = el.animate(keyframes, { duration, delay, easing, fill: "both" });
  animation.onfinish = animation.oncancel = () => el.remove();
}

/** Keyframe transforms keep the particle centred on its (left, top) point. */
const at = (dx: number, dy: number, extra = "") => `translate(-50%, -50%) translate(${dx}px, ${dy}px) ${extra}`;

function darkestLariat({ sprite }: MoveContext) {
  sprite?.animate([{ transform: "rotate(0)" }, { transform: "rotate(-720deg)" }], {
    duration: 800,
    easing: "cubic-bezier(.5,0,.3,1)",
  });
  const { x, y } = originOf(sprite);
  for (let i = 0; i < 32; i++) {
    const dx = random(-160, 160);
    const rise = random(60, 200);
    particle({
      x,
      y,
      size: random(5, 11),
      color: pick(["#ff6b1a", "#ffb02e", "#e3350d", "#ffd36b"]),
      keyframes: [
        { transform: at(0, 0, "scale(1)"), opacity: 1 },
        { transform: at(dx * 0.7, -rise * 0.6, "scale(.8)"), opacity: 1, offset: 0.5 },
        { transform: at(dx, -rise, "scale(.2)"), opacity: 0 },
      ],
      duration: random(700, 1200),
      delay: random(150, 450),
    });
  }
  return 1700;
}

function sandStream({ sprite }: MoveContext) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  for (let i = 0; i < 110; i++) {
    const y = random(0, height);
    particle({
      x: -20,
      y,
      size: random(2, 5),
      color: pick(["#d6b46e", "#c49a55", "#e8d29a", "#a87d45"]),
      keyframes: [
        { transform: at(0, 0), opacity: 0 },
        { transform: at(width * 0.15, random(-20, 20)), opacity: 0.9, offset: 0.1 },
        { transform: at(width * 0.6, random(-50, 50)), opacity: 0.9, offset: 0.6 },
        { transform: at(width + 40, random(-80, 80)), opacity: 0 },
      ],
      duration: random(1100, 2000),
      delay: random(0, 1400),
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
  return 3400;
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

function fairyWind({ sprite }: MoveContext) {
  const { x, y } = originOf(sprite);
  for (let i = 0; i < 26; i++) {
    const sway = random(30, 70) * (Math.random() < 0.5 ? -1 : 1);
    const rise = random(160, 320);
    particle({
      x: x + random(-30, 30),
      y,
      text: pick(["♥", "♥", "✦", "❀"]),
      size: random(12, 22),
      color: pick(["#f4a6c8", "#e86aa6", "#8fd3f4", "#ffffff"]),
      keyframes: [
        { transform: at(0, 0, "rotate(0) scale(.4)"), opacity: 0 },
        { transform: at(sway, -rise * 0.33, "rotate(-15deg) scale(1)"), opacity: 1, offset: 0.25 },
        { transform: at(-sway, -rise * 0.66, "rotate(15deg) scale(1)"), opacity: 1, offset: 0.65 },
        { transform: at(sway * 0.5, -rise, "rotate(0) scale(.8)"), opacity: 0 },
      ],
      duration: random(1500, 2200),
      delay: random(0, 500),
      easing: "ease-in-out",
    });
  }
  sprite?.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 500 });
  return 2600;
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

function matchaGotcha({ sprite }: MoveContext) {
  const { x, y } = originOf(sprite);
  sprite?.animate(
    [-12, 12, -8, 8, 0].map((deg) => ({ transform: `rotate(${deg}deg)` })),
    { duration: 600, easing: "ease-in-out" },
  );
  for (let i = 0; i < 30; i++) {
    const dx = random(-180, 180);
    const peak = random(80, 220);
    particle({
      x,
      y,
      size: random(5, 10),
      color: pick(["#7fb24a", "#a6cf6b", "#5a8a32", "#d9ecb1"]),
      keyframes: [
        { transform: at(0, 0), opacity: 1 },
        { transform: at(dx * 0.5, -peak), opacity: 1, offset: 0.4 },
        { transform: at(dx, random(60, 160)), opacity: 0 },
      ],
      duration: random(1000, 1500),
      delay: random(200, 450),
      easing: "cubic-bezier(.25,.6,.6,1)",
    });
  }
  return 2000;
}

const MOVES: Record<MoveId, (ctx: MoveContext) => number> = {
  "darkest-lariat": darkestLariat,
  confusion: (ctx) => {
    ctx.confusion();
    return 4400;
  },
  "sand-stream": sandStream,
  "night-shade": nightShade,
  "fairy-wind": fairyWind,
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
