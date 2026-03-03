import { useMemo, useRef, type ChangeEvent, type UIEvent } from "react";

type JsonEditorProps = {
  value: string;
  error: string | null;
  onChange: (nextValue: string) => void;
};

export default function JsonEditor({ value, error, onChange }: JsonEditorProps) {
  const gutterRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <section className="flex h-full min-h-0 flex-col border-b border-slate-800 bg-slate-950 lg:border-b-0 lg:border-r">
      <div className="flex min-h-0 flex-1">
        <div
          ref={gutterRef}
          className="scrollbar-hide w-14 overflow-y-auto border-r border-slate-800 bg-slate-900/80 py-4 text-right font-mono text-xs leading-6 text-slate-500 [scrollbar-width:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"
        >
          {lineNumbers.map((line) => (
            <div key={line} className="pr-3">
              {line}
            </div>
          ))}
        </div>

        <textarea
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          spellCheck={false}
          placeholder='{
  "fruits": []
}'
          className="min-h-0 flex-1 resize-none overflow-y-auto overflow-x-auto overscroll-contain bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"
        />
      </div>

      <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 text-sm">
        {error ? (
          <p className="rounded-lg border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-rose-300">{error}</p>
        ) : (
          <p className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-emerald-300">
            Valid JSON
          </p>
        )}
      </div>
    </section>
  );
}
