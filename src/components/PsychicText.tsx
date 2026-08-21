import { useContext, useEffect, useImperativeHandle, useMemo, useRef, type Ref } from "react";
import { PsychicContext, usePsychicBlast } from "../hooks/usePsychicBlast";

export type PsychicTextHandle = {
  /** Blast this run's group (everything under the same PsychicContext, or just this run if standalone). */
  blast: () => void;
};

type PsychicTextProps = {
  text: string;
  /** "chars" animates every letter; "words" moves whole words — calmer, better for body copy. */
  split?: "chars" | "words";
  className?: string;
  ref?: Ref<PsychicTextHandle>;
};

/** A run of text is a list of tokens: whitespace (rendered as-is) or words (one or more glyph spans). */
type Token = { type: "space"; text: string } | { type: "word"; glyphs: string[] };

function tokenize(text: string, split: "chars" | "words"): Token[] {
  return text.split(/(\s+)/).flatMap((part): Token[] => {
    if (!part) return [];
    if (/^\s+$/.test(part)) return [{ type: "space", text: part }];
    return [{ type: "word", glyphs: split === "words" ? [part] : Array.from(part) }];
  });
}

/**
 * Text that can be "psychic-blasted": pieces wobble with rising intensity,
 * explode outward, then snap back to exactly where they started.
 *
 * Renders the string as per-character (or per-word) spans — grouped per word
 * so wrapping is unchanged — and registers them with the nearest
 * PsychicContext group, or a private group when used standalone. The visible
 * glyphs are aria-hidden; the real string is kept in a non-selectable sr-only
 * span for assistive tech.
 */
export default function PsychicText({ text, split = "chars", className, ref }: PsychicTextProps) {
  const standalone = usePsychicBlast();
  const group = useContext(PsychicContext) ?? standalone;

  const tokens = useMemo(() => tokenize(text, split), [text, split]);
  const glyphCount = useMemo(
    () => tokens.reduce((sum, token) => (token.type === "word" ? sum + token.glyphs.length : sum), 0),
    [tokens],
  );
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(
    () =>
      group.register(() =>
        glyphRefs.current.slice(0, glyphCount).filter((el): el is HTMLSpanElement => el !== null),
      ),
    [group, glyphCount],
  );

  useImperativeHandle(ref, () => ({ blast: group.blast }), [group]);

  let glyphIndex = 0;

  return (
    <span className={className}>
      <span className="sr-only select-none">{text}</span>
      <span aria-hidden="true">
        {tokens.map((token, tokenIndex) => {
          if (token.type === "space") return token.text;

          return (
            <span key={tokenIndex} className="inline-block whitespace-nowrap">
              {token.glyphs.map((glyph) => {
                const i = glyphIndex++;
                return (
                  <span
                    key={i}
                    data-glyph=""
                    ref={(el) => {
                      glyphRefs.current[i] = el;
                    }}
                    className="inline-block"
                  >
                    {glyph}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </span>
  );
}
