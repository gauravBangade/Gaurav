import { Link } from "react-router-dom";
import PsychicText from "../PsychicText";
import { ArrowRightIcon } from "./icons";
import type { PersonalProject, Project } from "../../data/site";
import { LIST_BOX } from "./styles";

const ROW = "group flex items-start gap-4 px-5 py-4 transition hover:bg-ink/[0.025] focus:outline-none focus-visible:bg-ink/[0.04]";

type RowTextProps = {
  title: string;
  text: string;
  stack: string[];
  /** Dates or a note, on the right. */
  meta?: string;
  /** A status like "In development", drawn as a small label after the title. */
  status?: string;
};

function RowText({ title, text, stack, meta, status }: RowTextProps) {
  return (
    <span className="block min-w-0 flex-1">
      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-medium text-ink group-hover:text-accent">
            <PsychicText split="words" text={title} />
          </span>
          {status && <StatusLabel text={status} />}
        </span>
        {meta && <span className="text-xs text-ink/45">{meta}</span>}
      </span>
      <span className="mt-1 block text-sm leading-relaxed text-ink/65">
        <PsychicText split="words" text={text} />
      </span>
      <span className="mt-1.5 block text-xs text-ink/45">{stack.join(" · ")}</span>
    </span>
  );
}

/** "In development" and the like: small, outlined, accent-coloured. */
export function StatusLabel({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-accent/40 px-2 py-px text-[11px] font-medium leading-4 text-accent">{text}</span>
  );
}

const Arrow = () => (
  <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-accent" />
);

/** Work projects as rows, each linking to its page. */
export function WorkProjectList({ items }: { items: Project[] }) {
  return (
    <ul className={LIST_BOX}>
      {items.map((project) => (
        <li key={project.id}>
          <Link to={`/work/${project.id}`} className={ROW}>
            <RowText
              title={project.title}
              text={project.blurb}
              stack={project.stack}
              meta={project.status ? undefined : project.period}
              status={project.status}
            />
            <Arrow />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Side projects as rows; the ones that live on this site link to it. */
export function SideProjectList({ items }: { items: PersonalProject[] }) {
  return (
    <ul className={LIST_BOX}>
      {items.map((project) => (
        <li key={project.title}>
          {project.to ? (
            <Link to={project.to} className={ROW}>
              <RowText title={project.title} text={project.description} stack={project.stack} meta="Live on this site" />
              <Arrow />
            </Link>
          ) : (
            <div className="flex items-start gap-4 px-5 py-4">
              <RowText title={project.title} text={project.description} stack={project.stack} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
