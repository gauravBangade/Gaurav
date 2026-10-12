import { Link } from "react-router-dom";
import PsychicText from "../PsychicText";
import { ArrowRightIcon } from "./icons";
import type { Metric, PersonalProject, Project } from "../../data/site";
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
  /** A line under the title saying what I did, e.g. "Sole author". */
  role?: string;
  /** Headline numbers, shown big above the stack. */
  metrics?: Metric[];
};

/** Big numbers with a small label under each. */
function MetricRow({ metrics }: { metrics: Metric[] }) {
  return (
    <span className="mt-5 flex flex-wrap gap-x-[clamp(1.25rem,1rem+1vw,2rem)] gap-y-3">
      {metrics.map((metric) => (
        <span key={metric.label} className="flex flex-col">
          <span className="font-serif text-[clamp(1.6rem,1.4rem+0.8vw,2.1rem)] leading-none text-ink group-hover:text-accent">
            {metric.value}
          </span>
          <span className="mt-1.5 text-xs leading-snug text-ink/55">{metric.label}</span>
        </span>
      ))}
    </span>
  );
}

function CardBody({ title, text, stack, caption, status, linked = false, role, metrics }: CardBodyProps) {
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
      {role && <span className="mt-1 block text-sm text-ink/55">{role}</span>}
      <span className="mt-1.5 block text-[0.94rem] leading-relaxed text-ink/70">
        <PsychicText split="words" text={text} />
      </span>
      {metrics && metrics.length > 0 && <MetricRow metrics={metrics} />}
      <span className="mt-auto block pt-4 text-xs text-ink/45">{stack.join(" · ")}</span>
    </span>
  );
}

const GRID = "grid gap-[clamp(0.75rem,0.5rem+0.8vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3";

type WorkProjectGridProps = {
  items: Project[];
  /** Give featured projects a wide card with their role and every number; the rest show their top number. */
  showFeatured?: boolean;
};

/**
 * How many columns each card spans so no row ends in a hole: a card that would
 * leave its row short (because the next one doesn't fit, or it is last) grows
 * to fill it.
 */
function fillRows(widths: number[], columns: number) {
  const spans = widths.map((width) => Math.min(width, columns));
  let used = 0;
  spans.forEach((span, index) => {
    if (used + span > columns) {
      spans[index - 1] += columns - used;
      used = 0;
    }
    used = (used + span) % columns;
  });
  if (used > 0) spans[spans.length - 1] += columns - used;
  return spans;
}

const SM_SPAN = ["", "", "sm:col-span-2"];
const LG_SPAN = ["", "lg:col-span-1", "lg:col-span-2", "lg:col-span-3"];

/** Work projects as cards, each linking to its page. */
export function WorkProjectGrid({ items, showFeatured = false }: WorkProjectGridProps) {
  const widths = items.map((project) => (showFeatured && project.featured ? 2 : 1));
  const smSpans = showFeatured ? fillRows(widths, 2) : widths;
  const lgSpans = showFeatured ? fillRows(widths, 3) : widths;

  return (
    <ul className={GRID}>
      {items.map((project, index) => {
        const featured = showFeatured && project.featured;
        return (
          <li key={project.id} className={`flex ${SM_SPAN[smSpans[index]]} ${LG_SPAN[lgSpans[index]]}`}>
            <Link to={`/work/${project.id}`} className={`${CARD_LINK} w-full`}>
              <CardBody
                title={project.title}
                text={project.blurb}
                stack={project.stack}
                caption={project.period}
                status={project.status}
                role={featured ? project.role : undefined}
                metrics={featured ? project.metrics?.slice(0, 3) : project.metrics?.slice(0, 1)}
                linked
              />
            </Link>
          </li>
        );
      })}
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
