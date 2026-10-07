import { Link } from "react-router-dom";
import PsychicText from "../PsychicText";
import RichText from "../RichText";
import PokeballIcon from "./PokeballIcon";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { FOCUS_RING, formatMonth } from "./styles";
import { contact, featuredSkills, profile, projects, spokenLanguages } from "../../data/site";

const LABEL = "font-pixel text-[8px] uppercase leading-relaxed tracking-[0.1em] text-[rgb(var(--tc-label))]";

/** Whole years and months since an ISO year-month, as the card's PLAY TIME. */
function playTime(isoMonth: string) {
  const [year, month] = isoMonth.split("-").map(Number);
  const now = new Date();
  const total = Math.max(0, (now.getFullYear() - year) * 12 + now.getMonth() + 1 - month);
  return `${Math.floor(total / 12)}Y ${String(total % 12).padStart(2, "0")}M`;
}

function ResumeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 1.75h5.5L12.5 4.75v9.5h-8.5z" strokeLinejoin="round" />
      <path d="M6.5 8h4M6.5 10.5h4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The home page intro as a Game Boy–era trainer card: stats on the left and
 * the trainer sprite on the right, links along the bottom like the badge
 * case. On phones it reads top to bottom like a TCG card instead — artwork
 * first, then name and stats.
 */
export default function TrainerCardHero() {
  const rows: [string, string][] = [
    ["Class", profile.role],
    ["Guild", profile.company],
    ["Region", profile.location],
    ["Focus", profile.focus],
    ["Langs", spokenLanguages.join(" · ")],
  ];
  const counters: [string, string][] = [
    ["Play time", playTime(profile.since)],
    ["Skill dex", String(featuredSkills.length)],
    ["Quests", String(projects.length)],
  ];
  const links = [
    { label: "GitHub", href: contact.github, Icon: GitHubIcon, external: true },
    { label: "LinkedIn", href: contact.linkedin, Icon: LinkedInIcon, external: true },
    { label: "Email", href: `mailto:${contact.email}`, Icon: MailIcon, external: false },
  ];
  const linkClass = `trainer-card__link flex min-h-11 items-center justify-center gap-2 px-3 font-pixel text-[8px] uppercase tracking-[0.08em] ${FOCUS_RING}`;

  return (
    <section aria-label="Introduction" className="pt-[clamp(1.75rem,1rem+3vw,3.5rem)]">
      <div className="trainer-card">
        <header className="trainer-card__bar flex items-center justify-between gap-3 px-4 py-2.5">
          <span className="flex items-center gap-2 font-pixel text-[9px] uppercase tracking-[0.12em]">
            <PokeballIcon className="h-3.5 w-3.5" />
            Trainer card
          </span>
          <span className="font-pixel text-[8px] uppercase tracking-[0.1em] opacity-90">
            ID No.{profile.since.replace("-", "")}
          </span>
        </header>

        <div className="grid gap-[clamp(1rem,0.7rem+1vw,1.75rem)] p-[clamp(0.85rem,0.6rem+1vw,1.5rem)] md:grid-cols-[minmax(0,1fr)_clamp(12rem,22vw,16rem)]">
          {/* First in the DOM so phones get the artwork on top, TCG style. */}
          <figure className="md:col-start-2 md:row-start-1">
            <div className="trainer-card__art flex h-[clamp(18rem,95vw,26rem)] justify-center overflow-hidden md:aspect-[2/3] md:h-auto">
              <img
                src="/trainer-sprite.webp"
                alt={`Pixel-art trainer sprite of ${profile.name}`}
                width={421}
                height={1000}
                draggable="false"
                className="h-full w-auto select-none object-contain"
              />
            </div>
            <figcaption className="mt-2 text-center font-pixel text-[7px] uppercase leading-relaxed tracking-[0.1em] text-[rgb(var(--tc-label))]">
              Trainer · Since {formatMonth(profile.since)}
            </figcaption>
          </figure>

          <div className="min-w-0 md:col-start-1 md:row-start-1">
            <span className={LABEL}>Name/</span>
            <h1 tabIndex={-1} className="mt-2 font-pixel text-[clamp(1.05rem,0.8rem+1.6vw,1.9rem)] uppercase leading-[1.35] focus:outline-none">
              <PsychicText split="words" text={profile.name} />
            </h1>

            <dl className="mt-5 grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
              {rows.map(([label, value]) => (
                <div key={label} className="trainer-card__row contents">
                  <dt className={`${LABEL} py-2.5`}>{label}</dt>
                  <dd className="py-2 font-pixel text-[9px] uppercase leading-[1.9] sm:text-[10px]">
                    <PsychicText split="words" text={value} />
                  </dd>
                </div>
              ))}
            </dl>

            <dl className="mt-5 grid grid-cols-3 gap-2">
              {counters.map(([label, value]) => (
                <div key={label} className="trainer-card__stat flex flex-col items-center gap-2 px-1 py-2.5 text-center">
                  <dt className={LABEL}>{label}</dt>
                  <dd className="order-first font-pixel text-[11px] sm:text-[13px]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="poke-dialog trainer-card__intro md:col-span-2">
            <RichText text={profile.intro} />
          </div>
        </div>

        <nav aria-label="Links" className="trainer-card__links grid grid-cols-2 sm:grid-cols-4">
          {links.map(({ label, href, Icon, external }) => (
            <a key={label} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className={linkClass}>
              <Icon />
              {label}
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          ))}
          <Link to="/resume" className={linkClass}>
            <ResumeIcon />
            Resume
          </Link>
        </nav>
      </div>
    </section>
  );
}
