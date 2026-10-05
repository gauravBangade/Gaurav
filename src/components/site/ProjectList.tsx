import { Link } from "react-router-dom";
import PsychicText from "../PsychicText";
import { ArrowRightIcon } from "./icons";
import type { PersonalProject, Project } from "../../data/site";
import { CARD, CARD_LINK, PIXEL_LABEL } from "./styles";

/** "In development" and the like: a small square tag in the pixel font. */
export function StatusLabel({ text }: { text: string }) {
  return (
    <span className="inline-block border border-accent/60 px-1.5 py-[3px] font-pixel text-[7px] uppercase leading-none tracking-[0.1em] text-accent">
      {text}
    </span>
  );
}

type CardBodyProps = {
  title: string;
  text: string;
  stack: string[];
  /** Small caption at the top: a period, a status or a note. */
  caption?: string;
  status?: string;
  /** Show the arrow that marks a card as a link. */
  linked?: boolean;
};

function CardBody({ title, text, stack, caption, status, linked = false }: CardBodyProps) {
  return (
    <span className="flex h-full flex-col">
      <span className="flex min-h-5 items-center justify-between gap-3">
        {status ? <StatusLabel text={status} /> : <span className={PIXEL_LABEL}>{caption}</span>}
        {linked && (
          <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-accent" />
        )}
      </span>
      <span className="mt-3 block text-[1.05rem] font-semibold leading-snug text-ink group-hover:text-accent">
        <PsychicText split="words" text={title} />
      </span>
      <span className="mt-1.5 block text-[0.94rem] leading-relaxed text-ink/70">
        <PsychicText split="words" text={text} />
      </span>
      <span className="mt-auto block pt-4 text-xs text-ink/45">{stack.join(" · ")}</span>
    </span>
  );
}

const GRID = "grid gap-[clamp(0.75rem,0.5rem+0.8vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3";

/** Work projects as cards, each linking to its page. */
export function WorkProjectGrid({ items }: { items: Project[] }) {
  return (
    <ul className={GRID}>
      {items.map((project) => (
        <li key={project.id} className="flex">
          <Link to={`/work/${project.id}`} className={`${CARD_LINK} w-full`}>
            <CardBody
              title={project.title}
              text={project.blurb}
              stack={project.stack}
              caption={project.period}
              status={project.status}
              linked
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Side projects as cards; the ones that live on this site link to it. */
export function SideProjectGrid({ items }: { items: PersonalProject[] }) {
  return (
    <ul className={GRID}>
      {items.map((project) => (
        <li key={project.title} className="flex">
          {project.to ? (
            <Link to={project.to} className={`${CARD_LINK} w-full`}>
              <CardBody title={project.title} text={project.description} stack={project.stack} caption="Live on this site" linked />
            </Link>
          ) : (
            <div className={`${CARD} w-full`}>
              <CardBody title={project.title} text={project.description} stack={project.stack} caption="Side project" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
