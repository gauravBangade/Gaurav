import { useEffect, useRef, useState } from "react";
import PokemonDialog from "../PokemonDialog";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { contact, profile } from "../../data/site";
import { boxed, rollShiny, spriteSrc } from "../../data/party";
import { playMove } from "../../pokemon/moves";
import { CONTAINER, FOCUS_RING } from "./styles";

const LINGER_MS = 5000;

/** Sinistcha isn't in the party: it peeks out of the footer, waiting to be found. */
function SinistchaPeek({ allShiny }: { allShiny: boolean }) {
  const [shinyRoll] = useState(rollShiny);
  const [found, setFound] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const onClick = () => {
    if (busy) return;
    const duration = playMove(boxed.move.id, { sprite: spriteRef.current, confusion: () => {} });
    setBusy(true);
    setMessage(`${found ? "" : "You found SINISTCHA! "}SINISTCHA used MATCHA GOTCHA!`);
    setFound(true);
    later(() => {
      setBusy(false);
      setMessage(boxed.aftermath);
      later(() => setMessage(null), LINGER_MS);
    }, duration);
  };

  const shiny = allShiny || shinyRoll;

  return (
    <div className="relative">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-1 w-max max-w-[min(16rem,calc(100vw-2.5rem))]"
      >
        {message && <PokemonDialog key={message} text={message} className="poke-dialog--enter" />}
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
