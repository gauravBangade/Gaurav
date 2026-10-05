/** Shared class strings for the site. */

export const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

/**
 * Inline text link. PsychicText renders each glyph as an inline-block span,
 * which blocks text-decoration from propagating down — so the underline is
 * drawn on the glyph spans themselves.
 */
export const LINK_CLASS =
  `cursor-pointer font-medium text-ink underline decoration-ink/25 decoration-1 underline-offset-4 transition hover:text-accent hover:decoration-accent ${FOCUS_RING} ` +
  "[&_[data-glyph]]:underline [&_[data-glyph]]:decoration-ink/25 [&_[data-glyph]]:decoration-1 [&_[data-glyph]]:underline-offset-4 hover:[&_[data-glyph]]:decoration-accent";

/** The single reading column every page sits in. */
export const COLUMN = "mx-auto w-full max-w-[44rem] px-5 sm:px-6";

export const BODY_TEXT = "text-[15px] leading-[1.75] text-ink/75 sm:text-base";

export const MUTED = "text-sm text-ink/55";

/** Section heading: serif, generous. */
export const HEADING = "font-serif text-[1.85rem] leading-tight text-ink sm:text-[2.1rem]";

export const BUTTON_PRIMARY =
  `inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition hover:bg-ink/85 ${FOCUS_RING}`;

export const BUTTON_SECONDARY =
  `inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 bg-card px-5 text-sm font-medium text-ink transition hover:border-ink/35 ${FOCUS_RING}`;

/** A bordered list: rows separated by hairlines, the one container style the site uses. */
export const LIST_BOX = "divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-card";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-10" → "Oct 2024". Data stores ISO year-months so <time dateTime> stays machine-readable. */
export const formatMonth = (isoMonth: string) => {
  const [year, month] = isoMonth.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
};
