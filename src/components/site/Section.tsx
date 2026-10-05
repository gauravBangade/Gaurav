import type { ReactNode } from "react";
import PsychicText from "../PsychicText";
import { BODY_TEXT, HEADING, PROSE, TITLE } from "./styles";

type SectionProps = {
  id: string;
  title: string;
  /** Optional link or control on the right of the heading. */
  action?: ReactNode;
  children: ReactNode;
};

/** A page section: serif heading (with an optional action on the right), then content. */
export function Section({ id, title, action, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 pt-[clamp(2.75rem,2rem+3vw,4.5rem)]">
      <div className="mb-[clamp(1rem,0.8rem+0.6vw,1.5rem)] flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <h2 id={`${id}-title`} className={HEADING}>
          <PsychicText split="words" text={title} />
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

type PageHeaderProps = {
  title: string;
  /** Intro line(s) under the title. */
  children?: ReactNode;
  /** Above the title, e.g. a back link. */
  before?: ReactNode;
};

/**
 * The top of every page except home. The h1 takes focus after a route change
 * (see Layout), so it is focusable but drawn without an outline.
 */
export function PageHeader({ title, children, before }: PageHeaderProps) {
  return (
    <div className="pt-[clamp(2rem,1.5rem+2.5vw,3.75rem)]">
      {before}
      <h1 tabIndex={-1} className={`${TITLE} focus:outline-none`}>
        <PsychicText split="words" text={title} />
      </h1>
      {children && <div className={`mt-4 ${PROSE} ${BODY_TEXT}`}>{children}</div>}
    </div>
  );
}
