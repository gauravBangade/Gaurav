import PsychicText from "./PsychicText";

/** Key phrases are set in medium weight and full ink — emphasis without decoration. */
const KEYWORD_CLASS = "font-medium text-ink";

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
