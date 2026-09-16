import PsychicText from "./PsychicText";

/**
 * Highlighter wash for keywords, painted on the wrapper so a multi-word keyword
 * is one continuous stroke. The padding is cancelled by a negative margin, so
 * the stroke bleeds a few pixels past the text without moving it; clone keeps
 * both ends padded when a keyword wraps onto a new line. During a Psyduck
 * blast the words fly and the stroke stays put as their anchor.
 */
const KEYWORD_CLASS =
  "font-medium text-[#1b1b1b] rounded-[3px] bg-[#466a52]/[0.13] box-decoration-clone px-[3px] -mx-[3px]";

type Segment = { text: string; keyword: boolean };

/**
 * Splits on `**keyword**` markers, then glues any non-space characters that
 * touch a keyword onto it ("(", "’s", ",", "."). PsychicText renders every
 * word as an inline-block, and browsers may break a line between two of
 * those even with no space between them, so without this "**allowances**."
 * could wrap the full stop onto a line of its own.
 */
function toSegments(text: string): Segment[] {
  // With a capturing group, split() returns [plain, keyword, plain, keyword, ...]
  const segments = text.split(/\*\*(.+?)\*\*/).map((part, index) => ({ text: part, keyword: index % 2 === 1 }));

  segments.forEach((segment, index) => {
    if (!segment.keyword) return;
    const before = segments[index - 1];
    const after = segments[index + 1];

    const leading = before?.text.match(/\S+$/)?.[0];
    if (before && leading) {
      before.text = before.text.slice(0, -leading.length);
      segment.text = leading + segment.text;
    }

    const trailing = after?.text.match(/^\S+/)?.[0];
    if (after && trailing) {
      after.text = after.text.slice(trailing.length);
      segment.text += trailing;
    }
  });

  return segments.filter((segment) => segment.text);
}

type RichTextProps = {
  /** Plain text where `**like this**` marks a keyword to highlight. */
  text: string;
  className?: string;
};

/**
 * Body copy with **keyword** highlights. Keywords render inside <strong>, and
 * every run goes through PsychicText so the whole sentence stays blastable.
 */
export default function RichText({ text, className }: RichTextProps) {
  return (
    <span className={className}>
      {toSegments(text).map((segment, index) => {
        const run = <PsychicText split="words" text={segment.text} />;
        return segment.keyword ? (
          <strong key={index} className={KEYWORD_CLASS}>
            {run}
          </strong>
        ) : (
          <span key={index}>{run}</span>
        );
      })}
    </span>
  );
}
