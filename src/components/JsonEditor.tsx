import { useMemo, useRef, type ChangeEvent, type UIEvent } from "react";

type JsonEditorProps = {
  value: string;
  error: string | null;
  onChange: (nextValue: string) => void;
  onCopy: () => void;
  canCopy: boolean;
};

export default function JsonEditor({ value, error, onChange, onCopy, canCopy }: JsonEditorProps) {
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const lineNumbers = useMemo(() => {
    const count = Math.max(value.split("\n").length, 1);
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (!gutterRef.current) return;
    gutterRef.current.scrollTop = event.currentTarget.scrollTop;
  };

  const handleGutterWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!textareaRef.current) return;

    event.preventDefault();
    textareaRef.current.scrollTop += event.deltaY;
    gutterRef.current?.scrollTo({ top: textareaRef.current.scrollTop });
  };

  return (
    <section className="flex h-full min-h-0 flex-col border-b border-black/10 bg-[#fcfaf5] lg:border-b-0 lg:border-r lg:border-black/10">
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div
          ref={gutterRef}
          onWheel={handleGutterWheel}
          className="scrollbar-hide h-full w-14 overflow-y-auto border-r border-black/10 bg-[#f4efe6] py-4 text-right font-mono text-xs leading-6 text-black/35 [scrollbar-width:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"
        >
          {lineNumbers.map((line) => (
            <div key={line} className="pr-3">
              {line}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onCopy}
          disabled={!canCopy}
          aria-label="Copy JSON"
          title="Copy JSON"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#b7c9b8] bg-[#eef5ec]/95 text-[#45654b] shadow-sm transition hover:bg-[#e4eee4] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="10" height="10" rx="2" />
            <path d="M15 9V7a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          spellCheck={false}
          placeholder='{
  "fruits": []
}'
          className="h-full min-h-0 flex-1 resize-none overflow-y-auto overflow-x-auto overscroll-contain bg-[#fcfaf5] p-4 pr-14 font-mono text-sm leading-6 text-[#1e2d22] outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"
        />
      </div>

      <div className="border-t border-black/10 bg-[#fcfaf5] px-4 py-2.5 text-sm">
        {error ? (
          <p className="text-xs text-[#905f57]">{error}</p>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#5d735f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7f9b82]" />
            <span>Valid JSON</span>
          </div>
        )}
      </div>
    </section>
  );
}
