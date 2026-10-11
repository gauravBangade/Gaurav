import { useEffect, useRef, useState } from "react";
import PokemonDialog from "../PokemonDialog";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { contact, profile } from "../../data/site";
import { boxed, rollShiny, spriteSrc } from "../../data/party";
import { playMove } from "../../pokemon/moves";
import { CONTAINER, FOCUS_RING } from "./styles";

const LINGER_MS = 5000;

const LINES = {
  offer: "You found SINISTCHA! It offers you a cup of matcha. Drink it?",
  yes: "You take a sip... SINISTCHA used MATCHA GOTCHA!",
  no: "SINISTCHA doesn’t take no for an answer! It used MATCHA GOTCHA!",
  again: "SINISTCHA used MATCHA GOTCHA!",
};

const MENU_BUTTON = `flex items-center gap-1.5 rounded px-1 py-0.5 text-left before:content-['▶'] before:text-[8px] before:opacity-0 hover:before:opacity-100 focus-visible:before:opacity-100 ${FOCUS_RING}`;

/**
 * Sinistcha isn't in the party: it peeks out of the footer, waiting to be
 * found. Find it and it offers you tea — and whatever you answer, it pranks
 * the page with Matcha Gotcha (counterfeit matcha, like the real thing).
 */
function SinistchaPeek({ allShiny }: { allShiny: boolean }) {
  const [shinyRoll] = useState(rollShiny);
  const [found, setFound] = useState(false);
  const [asking, setAsking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const yesRef = useRef<HTMLButtonElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  // The menu takes focus so keyboard users can answer straight away.
  useEffect(() => {
    if (asking) yesRef.current?.focus();
  }, [asking]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const prank = (line: string) => {
    setAsking(false);
    setBusy(true);
    setMessage(line);
    const duration = playMove(boxed.move.id, { sprite: spriteRef.current, confusion: () => {} });
    later(() => {
      setBusy(false);
      setMessage(boxed.aftermath);
      later(() => setMessage(null), LINGER_MS);
    }, duration);
  };

  const onClick = () => {
    if (busy || asking) return;
    if (found) return prank(LINES.again);
    setFound(true);
    setAsking(true);
    setMessage(LINES.offer);
  };

  const shiny = allShiny || shinyRoll;

  return (
    <div className="relative">
      <div className="absolute bottom-full left-0 z-10 mb-1 flex w-max max-w-[min(16rem,calc(100vw-2.5rem))] flex-col items-start gap-1">
        <div role="status" aria-live="polite" className="pointer-events-none">
          {message && <PokemonDialog key={message} text={message} className="poke-dialog--enter" />}
        </div>
        {asking && (
          // A Game Boy YES/NO box. Either answer ends the same way; Escape counts as no.
          <div
            role="group"
            aria-label="Drink the matcha?"
            onKeyDown={(event) => event.key === "Escape" && prank(LINES.no)}
            className="poke-dialog poke-dialog--enter flex flex-col gap-1 !py-2 !pl-3 !pr-5"
          >
            <button ref={yesRef} type="button" onClick={() => prank(LINES.yes)} className={MENU_BUTTON}>
              YES
            </button>
            <button type="button" onClick={() => prank(LINES.no)} className={MENU_BUTTON}>
              NO
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onClick}
        aria-label={found ? "Sinistcha uses Matcha Gotcha" : "Something is hiding here"}
        className={`block overflow-hidden rounded-lg ${FOCUS_RING}`}
      >
        <img
          ref={spriteRef}
          src={spriteSrc(boxed.id, shiny)}
          alt=""
          aria-hidden="true"
          draggable="false"
          className={`pixelated h-14 w-14 transition duration-300 ${
            found ? "translate-y-0 opacity-100" : "translate-y-6 opacity-50 hover:translate-y-3 hover:opacity-90"
          }`}
        />
      </button>
    </div>
  );
}

/** A route inside the site (`to`) or an external page (`href`, opens in a new tab). */
const SOCIAL = [
  { label: "GitHub", href: contact.github, Icon: GitHubIcon, external: true },
  { label: "LinkedIn", href: contact.linkedin, Icon: LinkedInIcon, external: true },
  { label: "Email", href: `mailto:${contact.email}`, Icon: MailIcon, external: false },
];

/** One quiet line: Sinistcha peeking, the copyright, and where else to find me. */
export default function Footer({ allShiny }: { allShiny: boolean }) {
  return (
    <footer className="print-hidden mt-20 border-t border-ink/[0.08]">
      <div className={`${CONTAINER} flex items-end justify-between gap-4`}>
        <div className="flex items-end gap-3">
          <SinistchaPeek allShiny={allShiny} />
          <p className="whitespace-nowrap pb-4 text-xs text-ink/50 sm:text-sm">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
        <ul className="flex items-center gap-1 pb-2.5">
          {SOCIAL.map(({ label, href, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={external ? `${label} (opens in a new tab)` : label}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className={`grid h-9 w-9 place-items-center rounded-full text-ink/50 transition hover:text-ink ${FOCUS_RING}`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
