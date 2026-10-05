import { useState, type RefObject } from "react";
import PokemonDialog from "../PokemonDialog";
import type { PsychicPhase } from "../../hooks/usePsychicBlast";

const DIALOG_LINES = {
  prompt: "PSYDUCK is staring at you. (Click it!)",
  charge: "PSYDUCK is concentrating...",
  attack: "PSYDUCK used CONFUSION!",
  aftermath: "Sorry... my head hurts when I read. Psy!",
} as const;

type PsyduckHeroProps = {
  spriteRef: RefObject<HTMLImageElement | null>;
  phase: PsychicPhase;
  /** True for a while after a blast finishes, for the punchline. */
  aftermath: boolean;
  onBlast: () => void;
};

/**
 * Psyduck as the profile picture. It stays still and quiet until you hover or
 * focus it (then it stares back); click it and it uses Confusion on the page.
 */
export default function PsyduckHero({ spriteRef, phase, aftermath, onBlast }: PsyduckHeroProps) {
  const [hovered, setHovered] = useState(false);

  const dialogLine =
    phase === "charge"
      ? DIALOG_LINES.charge
      : phase === "burst" || phase === "return"
        ? DIALOG_LINES.attack
        : aftermath
          ? DIALOG_LINES.aftermath
          : DIALOG_LINES.prompt;

  const dialogVisible = hovered || aftermath || phase !== "idle";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onBlast}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label="Psyduck uses Confusion"
        aria-describedby="psyduck-dialog"
        className="grid h-[5.5rem] w-[5.5rem] cursor-pointer select-none place-items-center rounded-full border border-ink/10 bg-card shadow-sm transition hover:border-ink/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <img ref={spriteRef} src="/sitting-psyduck.webp" alt="" aria-hidden="true" className="h-[4.5rem] w-[4.5rem]" draggable="false" />
      </button>

      <div
        id="psyduck-dialog"
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute left-[6.5rem] top-2 z-10 w-max max-w-[min(17rem,calc(100vw-9rem))]"
      >
        {dialogVisible && (
          <PokemonDialog key={dialogLine} text={dialogLine} className="poke-dialog--tail-left poke-dialog--enter" />
        )}
      </div>
    </div>
  );
}
