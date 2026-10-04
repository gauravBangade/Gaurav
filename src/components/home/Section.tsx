import type { ReactNode } from "react";
import PokeballIcon from "./PokeballIcon";
import PsychicText from "../PsychicText";

/** Pixel-font section label with a Poké Ball. `id` lets a section or tile point aria-labelledby at it. */
export function SectionTitle({ id, title }: { id?: string; title: string }) {
  return (
    <h2 id={id} className="flex items-center gap-2.5 font-pixel text-[10px] uppercase tracking-[0.18em] text-ink/60">
      <PokeballIcon className="h-3.5 w-3.5 shrink-0 text-ink/70" />
      <PsychicText text={title} />
    </h2>
  );
}

type SectionProps = {
  id: string;
  title: string;
  /** Short line on the right of the heading. */
  meta?: ReactNode;
  children: ReactNode;
};

/** A page section: heading row, then (usually) a bento grid. */
export default function Section({ id, title, meta, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="space-y-4 pt-12 sm:pt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <SectionTitle id={`${id}-title`} title={title} />
        {meta && <div className="text-xs text-ink/55 sm:text-sm">{meta}</div>}
      </div>
      {children}
    </section>
  );
}
