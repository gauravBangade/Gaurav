import { useEffect, useState } from "react";

type PokemonDialogProps = {
  text: string;
  /** Milliseconds per character. Gen 1 "fast" text is roughly this. */
  charMs?: number;
  className?: string;
};

/**
 * A Game Boy–era Pokémon text box: double-line frame, pixel font, typewriter
 * reveal, blinking ▼ when done.
 *
 * Typing state lives here; mount it with `key={text}` so a new message
 * restarts the reveal from the first character.
 */
export default function PokemonDialog({ text, charMs = 28, className = "" }: PokemonDialogProps) {
  const [shown, setShown] = useState(0);
  const done = shown >= text.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setShown(text.length), 0);
      return () => window.clearTimeout(id);
    }

    let count = 0;
    const id = window.setInterval(() => {
      count += 1;
      setShown(count);
      if (count >= text.length) window.clearInterval(id);
    }, charMs);

    return () => window.clearInterval(id);
  }, [text, charMs]);

  return (
    <div className={`poke-dialog ${className}`}>
      <span className="sr-only select-none">{text}</span>
      <span aria-hidden="true" className="poke-dialog__text">
        {text.slice(0, shown)}
      </span>
      {done && (
        <span aria-hidden="true" className="poke-dialog__cursor">
          ▼
        </span>
      )}
    </div>
  );
}
