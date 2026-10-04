/** Shared class strings for the home page. */

export const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export const LINK_CLASS =
  `cursor-pointer font-medium text-accent transition hover:text-ink ${FOCUS_RING} ` +
  // PsychicText renders each glyph as an inline-block span, which blocks text-decoration from
  // propagating down — so the underline must be drawn on the glyph spans themselves.
  "[&_[data-glyph]]:underline [&_[data-glyph]]:decoration-2 [&_[data-glyph]]:underline-offset-4";

export const BODY_TEXT = "text-sm leading-relaxed text-ink/75 sm:text-base";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-11" → "Nov 2024". site.ts stores ISO year-months so <time dateTime> stays machine-readable. */
export const formatMonth = (isoMonth: string) => {
  const [year, month] = isoMonth.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
};

/** Bento grid: two columns on phones and tablets, four on large screens. */
export const BENTO = "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-3.5";

export const TILE = "relative min-w-0 rounded-[22px] border border-ink/10 bg-card p-[18px]";

/** A tile that is itself a link or button. */
export const TILE_INTERACTIVE =
  `${TILE} block w-full text-left transition duration-200 hover:-translate-y-[3px] hover:border-ink/30 hover:shadow-[0_10px_24px_rgb(0_0_0/0.06)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`;

export const EYEBROW = "font-pixel text-[8px] uppercase tracking-wider text-ink/50";

/** Primary button: ink fill with an accent "shadow" ledge. */
export const CTA =
  `inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-paper shadow-[0_3px_0_rgb(var(--accent))] transition hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none ${FOCUS_RING}`;

export const GHOST_BUTTON =
  `inline-flex min-h-11 items-center rounded-xl border border-ink/20 px-4 text-sm font-medium transition hover:border-ink/50 ${FOCUS_RING}`;
