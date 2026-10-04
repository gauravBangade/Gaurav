import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ExternalMark from "./ExternalMark";
import PokemonDialog from "../PokemonDialog";
import { builtThings, contact, profile, sections } from "../../data/site";
import { boxed, rollShiny, spriteSrc } from "../../data/party";
import { playMove } from "../../pokemon/moves";
import { FOCUS_RING } from "./styles";

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

type FooterLink = { label: string; href: string; external?: boolean; internalRoute?: boolean };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-2 font-pixel text-[8px] uppercase tracking-wider text-ink/50">{title}</h2>
      <ul className="grid gap-0.5">
        {links.map((link) => {
          const className = `inline-flex min-h-9 items-center rounded text-sm text-ink/75 transition hover:text-ink hover:underline ${FOCUS_RING}`;
          return (
            <li key={link.label}>
              {link.internalRoute ? (
                <Link to={link.href} className={className}>
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className={className}
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {link.label}
                  {link.external && <ExternalMark />}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type FooterProps = {
  allShiny: boolean;
  onCopyEmail: () => void;
};

export default function Footer({ allShiny, onCopyEmail }: FooterProps) {
  const explore: FooterLink[] = [
    ...sections.filter((section) => section.id !== "contact").map((section) => ({ label: section.label, href: `#${section.id}` })),
    ...builtThings.map((thing) => ({ label: thing.title, href: thing.to, internalRoute: true })),
  ];
  const reach: FooterLink[] = [
    { label: "Email me", href: "#contact" },
    { label: "GitHub", href: contact.github, external: true },
    { label: "LinkedIn", href: contact.linkedin, external: true },
  ];

  return (
    <footer className="mt-14 border-t border-ink/10 bg-card/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-7">
        <div className="grid grid-cols-2 gap-7 pb-5 pt-9 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="col-span-2 space-y-2 lg:col-span-1">
            <a href="#top" className={`inline-flex items-center gap-2 rounded-lg font-semibold ${FOCUS_RING}`}>
              <img src={spriteSrc("psyduck")} alt="" aria-hidden="true" className="pixelated -my-2 h-10 w-10" draggable="false" />
              {profile.name}
            </a>
            <p className="max-w-[36ch] text-sm leading-relaxed text-ink/60">
              Software engineer building offline-first platforms, real-time tools and type-safe React front ends.
            </p>
            <p className="hidden font-pixel text-[7px] uppercase tracking-wider text-ink/45 sm:block">Psst: ↑↑↓↓←→←→BA</p>
          </div>
          <FooterColumn title="Explore" links={explore} />
          <div>
            <FooterColumn title="Contact" links={reach} />
            <button
              type="button"
              onClick={onCopyEmail}
              className={`inline-flex min-h-9 items-center rounded text-sm text-ink/75 transition hover:text-ink hover:underline ${FOCUS_RING}`}
            >
              Copy email
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-ink/10 text-xs text-ink/50">
          <div className="flex items-end gap-2.5">
            <SinistchaPeek allShiny={allShiny} />
            <p className="pb-3">© {new Date().getFullYear()} {profile.name}</p>
          </div>
          <a href="#top" className={`mb-1.5 inline-flex min-h-11 items-center gap-1.5 rounded px-1 transition hover:text-ink ${FOCUS_RING}`}>
            Back to top <span aria-hidden="true">▲</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
