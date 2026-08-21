import { createContext, useCallback, useEffect, useMemo, useRef, type RefObject } from "react";

/** Tune the feel here. Buildup is deliberately long — it should feel like Psyduck is straining. */
export const PSYCHIC_TIMING = {
  chargeMs: 2800,
  burstMs: 650,
  returnMs: 900,
} as const;

const TOTAL_MS = PSYCHIC_TIMING.chargeMs + PSYCHIC_TIMING.burstMs + PSYCHIC_TIMING.returnMs;

export type PsychicPhase = "idle" | "charge" | "burst" | "return";

const easeInCubic = (t: number) => t * t * t;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
// Overshoots past the target before settling — gives the "snap back" feel.
const easeOutBack = (t: number) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;

type GlyphSeed = { phase: number; dx: number; dy: number; dist: number; spin: number };

const randomSeed = (): GlyphSeed => {
  const angle = Math.random() * Math.PI * 2;
  return {
    phase: Math.random() * Math.PI * 2,
    dx: Math.cos(angle),
    dy: Math.sin(angle),
    dist: 120 + Math.random() * 160,
    spin: (Math.random() - 0.5) * 720,
  };
};

type BlastHooks = {
  onPhase: (phase: PsychicPhase) => void;
  onDone: () => void;
};

/**
 * Animates `glyphs` through charge → burst → return by writing inline styles
 * from a single rAF loop. Returns a cancel function that also restores styles.
 */
function runBlast(glyphs: HTMLElement[], companion: HTMLElement | null, hooks: BlastHooks): () => void {
  const seeds = glyphs.map(randomSeed);
  const companionSeed = randomSeed();
  const start = performance.now();
  let frame: number | null = null;
  let phase: PsychicPhase = "idle";

  const setPhase = (next: PsychicPhase) => {
    if (next === phase) return;
    phase = next;
    hooks.onPhase(next);
  };

  glyphs.forEach((el) => {
    el.style.willChange = "transform, opacity";
  });
  if (companion) companion.style.willChange = "transform";

  const reset = () => {
    glyphs.forEach((el) => {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.willChange = "";
    });
    if (companion) {
      companion.style.transform = "";
      companion.style.willChange = "";
    }
  };

  const tick = (now: number) => {
    const t = now - start;

    if (t >= TOTAL_MS) {
      reset();
      frame = null;
      setPhase("idle");
      hooks.onDone();
      return;
    }

    if (t < PSYCHIC_TIMING.chargeMs) {
      setPhase("charge");
      // Slow wobble that tightens into a violent buzz.
      const p = t / PSYCHIC_TIMING.chargeMs;
      const amp = 1 + easeInCubic(p) * 7;
      const speed = 0.012 + 0.05 * p * p;

      glyphs.forEach((el, i) => {
        const ph = seeds[i].phase + t * speed;
        el.style.transform = `translate(${Math.sin(ph) * amp}px, ${Math.cos(ph * 1.3) * amp * 0.6}px) rotate(${Math.sin(ph) * amp}deg)`;
      });

      if (companion) {
        const ph = companionSeed.phase + t * speed;
        companion.style.transform = `translate(${Math.sin(ph) * amp * 0.7}px, ${Math.cos(ph * 1.1) * amp * 0.5}px) rotate(${Math.sin(ph * 0.9) * amp * 0.8}deg)`;
      }
    } else if (t < PSYCHIC_TIMING.chargeMs + PSYCHIC_TIMING.burstMs) {
      setPhase("burst");
      const p = easeOutCubic((t - PSYCHIC_TIMING.chargeMs) / PSYCHIC_TIMING.burstMs);

      glyphs.forEach((el, i) => {
        const s = seeds[i];
        el.style.transform = `translate(${s.dx * s.dist * p}px, ${s.dy * s.dist * p}px) rotate(${s.spin * p}deg) scale(${1 + p * 0.5})`;
        el.style.opacity = String(1 - p * 0.6);
      });

      if (companion) {
        // Quick pop: scale up hard, then ease back toward 1 as the burst spends itself.
        const pop = 1 + Math.sin(p * Math.PI) * 0.35;
        companion.style.transform = `scale(${pop}) rotate(${(1 - p) * -8}deg)`;
      }
    } else {
      setPhase("return");
      // 1 → 0, dipping slightly below 0 so glyphs overshoot home and settle.
      const q = 1 - easeOutBack((t - PSYCHIC_TIMING.chargeMs - PSYCHIC_TIMING.burstMs) / PSYCHIC_TIMING.returnMs);

      glyphs.forEach((el, i) => {
        const s = seeds[i];
        el.style.transform = `translate(${s.dx * s.dist * q}px, ${s.dy * s.dist * q}px) rotate(${s.spin * q}deg) scale(${1 + q * 0.5})`;
        el.style.opacity = String(Math.min(1, 1 - q * 0.6));
      });

      if (companion) companion.style.transform = "";
    }

    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);

  return () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    reset();
    setPhase("idle");
  };
}

/** Returns the live glyph elements of one text run. Called at blast time, never cached. */
export type GlyphSource = () => HTMLElement[];

export type PsychicGroup = {
  /** Add a text run to the group. Returns an unregister function. */
  register: (source: GlyphSource) => () => void;
  /** Blast every registered run at once. No-op while running or under reduced motion. */
  blast: () => void;
};

/**
 * Provide a group so every <PsychicText> beneath it fires together.
 * Usage: `<PsychicContext value={group}>…</PsychicContext>`
 */
export const PsychicContext = createContext<PsychicGroup | null>(null);

type Options = {
  /** Optional element (e.g. the sprite that triggers it) to shake and pop on the same clock. */
  companionRef?: RefObject<HTMLElement | null>;
  /** Called on every phase transition: charge → burst → return → idle. */
  onPhaseChange?: (phase: PsychicPhase) => void;
};

/**
 * Creates a blast group: text runs register their glyphs, `blast()` animates
 * them all on one clock. One group per trigger (e.g. one per Psyduck).
 */
export function usePsychicBlast({ companionRef, onPhaseChange }: Options = {}): PsychicGroup {
  const sourcesRef = useRef(new Set<GlyphSource>());
  const cancelRef = useRef<(() => void) | null>(null);
  const onPhaseChangeRef = useRef(onPhaseChange);

  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  });

  const register = useCallback((source: GlyphSource) => {
    sourcesRef.current.add(source);
    return () => {
      sourcesRef.current.delete(source);
    };
  }, []);

  const blast = useCallback(() => {
    if (cancelRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glyphs = Array.from(sourcesRef.current).flatMap((source) => source());
    if (glyphs.length === 0) return;

    cancelRef.current = runBlast(glyphs, companionRef?.current ?? null, {
      onPhase: (phase) => onPhaseChangeRef.current?.(phase),
      onDone: () => {
        cancelRef.current = null;
      },
    });
  }, [companionRef]);

  useEffect(() => {
    return () => {
      cancelRef.current?.();
      cancelRef.current = null;
    };
  }, []);

  return useMemo(() => ({ register, blast }), [register, blast]);
}
