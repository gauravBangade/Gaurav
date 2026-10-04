import { useEffect, useState, type RefObject } from "react";
import PokemonDialog from "../PokemonDialog";
import type { PsychicPhase } from "../../hooks/usePsychicBlast";

/** How long the intro prompt and the post-blast punchline stay on screen. */
const DIALOG_LINGER_MS = 6000;

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

/** The sitting Psyduck at the top of the page. Click it and it uses Confusion on the whole page. */
export default function PsyduckHero({ spriteRef, phase, aftermath, onBlast }: PsyduckHeroProps) {
  const [introVisible, setIntroVisible] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroVisible(false), DIALOG_LINGER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const dialogLine =
    phase === "charge"
      ? DIALOG_LINES.charge
      : phase === "burst" || phase === "return"
        ? DIALOG_LINES.attack
        : aftermath
          ? DIALOG_LINES.aftermath
          : DIALOG_LINES.prompt;

  const dialogVisible = hovered || introVisible || aftermath || phase !== "idle";

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
        className="float-psyduck cursor-pointer select-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <img
          ref={spriteRef}
          src="/sitting-psyduck.webp"
          alt=""
          aria-hidden="true"
          className="h-16 w-16 opacity-90"
          draggable="false"
        />
      </button>

      <div
        id="psyduck-dialog"
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute left-[4.75rem] top-0 z-10 w-max max-w-[min(17rem,calc(100vw-7.5rem))]"
      >
        {dialogVisible && (
          <PokemonDialog key={dialogLine} text={dialogLine} className="poke-dialog--tail-left poke-dialog--enter" />
        )}
      </div>
    </div>
  );
}
