import { useEffect, useRef } from "react";
import { playMove } from "./moves";

/**
 * Gengar's Night Shade for any Gengar button: the purple wave, the flicker and
 * then the theme switch — the same effect as using the move in the party.
 * Attach `spriteRef` to the Gengar image the wave should start from.
 */
export function useNightShade() {
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const busyUntil = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const trigger = () => {
    const now = performance.now();
    if (now < busyUntil.current) return;
    const duration = playMove("night-shade", { sprite: spriteRef.current, confusion: () => {} });
    busyUntil.current = now + duration;
  };

  return { spriteRef, trigger };
}
