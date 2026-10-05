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

/**
 * The page container: wide enough to use a large screen (72rem), with side
 * padding that scales from 1rem on phones to 2.5rem on desktops. Text blocks
 * inside cap their own line length with PROSE.
 */
export const CONTAINER = "mx-auto w-full max-w-[72rem] px-[clamp(1rem,4vw,2.5rem)]";

/** Keeps running text to a comfortable line length on wide screens. */
export const PROSE = "max-w-[65ch]";

/** Body text that scales gently between phone and desktop. */
export const BODY_TEXT = "text-[clamp(0.94rem,0.9rem+0.2vw,1.05rem)] leading-[1.7] text-ink/75";

export const MUTED = "text-sm text-ink/55";

/** Page title (h1). */
export const TITLE = "font-serif text-[clamp(2.4rem,1.7rem+3vw,4.25rem)] leading-[1.02]";

/** Section heading (h2). */
export const HEADING = "font-serif text-[clamp(1.65rem,1.35rem+1.2vw,2.35rem)] leading-tight text-ink";

/** Tiny pixel-font label, like a Game Boy menu caption. Used sparingly, inside cards. */
export const PIXEL_LABEL = "font-pixel text-[8px] uppercase leading-relaxed tracking-[0.12em] text-ink/50";

/** The one container style: a square-dot "pixel" frame (see .pixel-card in index.css). */
export const CARD = "pixel-card p-[clamp(1rem,0.8rem+1vw,1.5rem)]";

/** A card that is itself a link or button. */
export const CARD_LINK = `${CARD} pixel-card-link group block transition-colors ${FOCUS_RING}`;

export const BUTTON_PRIMARY =
  `inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-medium text-paper transition hover:bg-ink/85 ${FOCUS_RING}`;

export const BUTTON_SECONDARY =
  `inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink/15 bg-card px-5 text-sm font-medium text-ink transition hover:border-ink/35 ${FOCUS_RING}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-10" → "Oct 2024". Data stores ISO year-months so <time dateTime> stays machine-readable. */
export const formatMonth = (isoMonth: string) => {
  const [year, month] = isoMonth.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
};
