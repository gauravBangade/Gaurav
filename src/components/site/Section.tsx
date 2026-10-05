import type { ReactNode } from "react";
import PsychicText from "../PsychicText";
import { BODY_TEXT, HEADING } from "./styles";

type SectionProps = {
  id: string;
  title: string;
  /** Optional link or note on the right of the heading. */
  action?: ReactNode;
  children: ReactNode;
};

/** A page section: serif heading, then content. Spacing does the separating — no rules or boxes. */
export function Section({ id, title, action, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 pt-16 sm:pt-20">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
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
  /** Above the title, e.g. a back link or a meta line. */
  before?: ReactNode;
};

/**
 * The top of every page except home. The h1 takes focus after a route change
 * (see Layout), so it is focusable but drawn without an outline.
 */
export function PageHeader({ title, children, before }: PageHeaderProps) {
  return (
    <div className="pt-14 sm:pt-20">
      {before}
      <h1 tabIndex={-1} className="font-serif text-[2.6rem] leading-[1.05] focus:outline-none sm:text-[3.25rem]">
        <PsychicText split="words" text={title} />
      </h1>
      {children && <div className={`mt-4 max-w-xl ${BODY_TEXT}`}>{children}</div>}
    </div>
  );
}
