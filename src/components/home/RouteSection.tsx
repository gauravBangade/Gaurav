import PsychicText from "../PsychicText";
import Section from "./Section";
import { timeline } from "../../data/site";
import { TILE } from "./styles";

/**
 * The two years as a route map in one wide tile: a vertical list on phones,
 * a horizontal track (scrollable, snapping per stop) on large screens.
 */
export default function RouteSection() {
  return (
    <Section id="route" title="Route map" meta={<PsychicText split="words" text="Nov 2024 → now" />}>
      <div className={TILE}>
        <ol
          tabIndex={0}
          aria-label="Timeline"
          className="relative grid gap-5 border-l-2 border-dashed border-ink/15 pl-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:auto-cols-[minmax(11.5rem,1fr)] lg:grid-flow-col lg:gap-6 lg:overflow-x-auto lg:border-l-0 lg:pb-2 lg:pl-0 lg:pt-8 lg:[scroll-snap-type:x_mandatory]"
        >
          {timeline.map((stop, index) => {
            const current = index === timeline.length - 1;
            return (
              // On large screens each stop draws its own stretch of the dashed track (inside the
              // scroll box's padding, so overflow-x doesn't clip the dots).
              <li
                key={stop.period}
                className="relative lg:[scroll-snap-align:start] lg:before:absolute lg:before:-right-6 lg:before:-top-5 lg:before:left-0 lg:before:border-t-2 lg:before:border-dashed lg:before:border-ink/15"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 lg:-top-[26px] lg:left-0 ${
                    current ? "you-are-here border-accent bg-accent" : "border-ink/40 bg-card"
                  }`}
                />
                <p className="font-pixel text-[8px] uppercase tracking-wider text-ink/50">
                  <PsychicText split="words" text={stop.period} />
                  {current && (
                    <span className="ml-1.5 text-accent">
                      <PsychicText split="words" text="· here" />
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
                  <PsychicText split="words" text={stop.focus} />
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
