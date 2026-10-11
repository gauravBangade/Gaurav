import { useState, type RefObject } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PokemonDialog from "../PokemonDialog";
import type { PsychicPhase } from "../../hooks/usePsychicBlast";
import { FOCUS_RING } from "./styles";

const DIALOG_LINES = {
  prompt: "PSYDUCK is staring at you. (Click it!)",
  charge: "PSYDUCK is concentrating...",
  attack: "PSYDUCK used CONFUSION!",
  aftermath: "Sorry... my head hurts when I read. Psy!",
} as const;

type PsyduckButtonProps = {
  spriteRef: RefObject<HTMLImageElement | null>;
  phase: PsychicPhase;
  /** True for a while after a blast finishes, for the punchline. */
  aftermath: boolean;
  onBlast: () => void;
};

/**
 * Psyduck in the header, beside the name. It stays still and quiet until you
 * hover or focus it (then it stares back); click it and it takes you home and
 * uses Confusion there. Its text box drops down below the header.
 */
export default function PsyduckButton({ spriteRef, phase, aftermath, onBlast }: PsyduckButtonProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onClick = () => {
    if (pathname === "/") return onBlast();
    navigate("/");
    // Let the home page render first, so its text joins the blast.
    window.setTimeout(onBlast, 150);
  };

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
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label="Home — Psyduck uses Confusion"
        aria-describedby="psyduck-dialog"
        className={`grid h-8 w-8 cursor-pointer select-none place-items-center rounded-full border border-ink/10 bg-card transition hover:border-ink/30 sm:h-9 sm:w-9 ${FOCUS_RING}`}
      >
        <img
          ref={spriteRef}
          src="/sitting-psyduck.webp"
          alt=""
          aria-hidden="true"
          className="h-7 w-7 sm:h-8 sm:w-8"
          draggable="false"
        />
      </button>

      <div
        id="psyduck-dialog"
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute left-0 top-[calc(100%+0.85rem)] z-10 w-max max-w-[min(17rem,calc(100vw-2rem))] [--tail-left:9px] sm:[--tail-left:11px]"
      >
        {dialogVisible && (
          <PokemonDialog key={dialogLine} text={dialogLine} className="poke-dialog--tail-up poke-dialog--enter" />
        )}
      </div>
    </div>
  );
}
