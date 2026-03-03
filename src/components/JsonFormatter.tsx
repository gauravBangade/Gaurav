import { useMemo, useState } from "react";

const INITIAL_JSON = `{
  "name": "Gaurav",
  "role": "Frontend Developer",
  "skills": ["React", "TypeScript", "Tailwind CSS"],
  "projects": [
    { "title": "JSON Graph", "status": "active" },
    { "title": "Portfolio", "status": "active" }
  ]
}`;

type ValidationResult = {
    ok: boolean;
    formatted: string;
    minified: string;
    error?: string;
    line?: number;
    column?: number;
};

function sortObjectKeys(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(sortObjectKeys);
    }

    if (value && typeof value === "object") {
        const sortedEntries = Object.entries(value as Record<string, unknown>)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, nestedValue]) => [key, sortObjectKeys(nestedValue)]);

        return Object.fromEntries(sortedEntries);
    }

    return value;
}

function getLineAndColumn(input: string, message: string): Pick<ValidationResult, "line" | "column"> {
    const positionMatch = message.match(/position\s(\d+)/i);

    if (!positionMatch) {
        return {};
    }

    const position = Number(positionMatch[1]);

    if (!Number.isFinite(position) || position < 0) {
        return {};
    }

    let line = 1;
    let column = 1;

    for (let index = 0; index < Math.min(position, input.length); index += 1) {
        if (input[index] === "\n") {
            line += 1;
            column = 1;
        } else {
            column += 1;
        }
    }

    return { line, column };
}

function validateJson(input: string, indent: number, sortKeys: boolean): ValidationResult {
    if (!input.trim()) {
        return {
            ok: false,
            formatted: "",
            minified: "",
            error: "Input is empty.",
        };
    }

    try {
        const parsed = JSON.parse(input);
        const normalized = sortKeys ? sortObjectKeys(parsed) : parsed;

        return {
            ok: true,
            formatted: JSON.stringify(normalized, null, indent),
            minified: JSON.stringify(normalized),
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid JSON.";
        const { line, column } = getLineAndColumn(input, message);

        return {
            ok: false,
            formatted: "",
            minified: "",
            error: message,
            line,
            column,
        };
    }
}

export default function JsonFormatter() {
    const [input, setInput] = useState(INITIAL_JSON);
    const [output, setOutput] = useState("");
    const [indent, setIndent] = useState(2);
    const [sortKeys, setSortKeys] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [line, setLine] = useState<number | null>(null);
    const [column, setColumn] = useState<number | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [wasPasteValidated, setWasPasteValidated] = useState(false);

    const inputStats = useMemo(() => {
        const size = new Blob([input]).size;
        return {
            chars: input.length,
            bytes: size,
            lines: input ? input.split("\n").length : 0,
        };
    }, [input]);

    const outputStats = useMemo(() => {
        const size = new Blob([output]).size;
        return {
            chars: output.length,
            bytes: size,
            lines: output ? output.split("\n").length : 0,
        };
    }, [output]);

    const updateValidationState = (result: ValidationResult) => {
        setIsValid(result.ok);

        if (result.ok) {
            setError(null);
            setLine(null);
            setColumn(null);
            return;
        }

        setError(result.error ?? "Invalid JSON.");
        setLine(result.line ?? null);
        setColumn(result.column ?? null);
    };

    const runValidation = (rawInput: string) => {
        const result = validateJson(rawInput, indent, sortKeys);
        updateValidationState(result);
        return result;
    };

    const prettifyJson = () => {
        const result = runValidation(input);
        if (result.ok) {
            setOutput(result.formatted);
        }
    };

    const minifyJson = () => {
        const result = runValidation(input);
        if (result.ok) {
            setOutput(result.minified);
        }
    };

    const validateOnly = () => {
        runValidation(input);
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
        setError(null);
        setLine(null);
        setColumn(null);
        setIsValid(null);
        setWasPasteValidated(false);
    };

    const copyOutput = async () => {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
        } catch {
            setError("Unable to copy. Clipboard permission may be blocked.");
        }
    };

    const downloadOutput = () => {
        if (!output) return;
        const blob = new Blob([output], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "formatted.json";
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const onPasteValidate: React.ClipboardEventHandler<HTMLTextAreaElement> = (event) => {
        const pastedText = event.clipboardData.getData("text");
        const selectionStart = event.currentTarget.selectionStart;
        const selectionEnd = event.currentTarget.selectionEnd;
        const nextValue =
            input.slice(0, selectionStart) + pastedText + input.slice(selectionEnd);

        event.preventDefault();
        setInput(nextValue);
        setWasPasteValidated(true);

        const result = validateJson(nextValue, indent, sortKeys);
        updateValidationState(result);

        if (result.ok) {
            setOutput(result.formatted);
        }
    };

    return (
        <section className="h-full w-full min-h-0 overflow-hidden bg-slate-950">
            <div className="flex h-full min-h-0 flex-col">
                <header className="border-b border-white/10 bg-slate-950/95 px-4 py-3 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-white sm:text-xl">JSON Formatter</h2>
                        <p className="text-xs text-slate-400">Paste to auto-validate</p>
                    </div>
                </header>

                <div className="min-h-0 flex-1 px-4 py-4 sm:px-6 sm:py-5">
                    <div className="h-full min-h-0 overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/75 shadow-[0_24px_60px_rgba(2,6,23,0.7),0_0_0_1px_rgba(148,163,184,0.12)]">
                        <div className="border-b border-slate-700/80 bg-slate-900/90 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                                    json-formatter-terminal
                                </span>
                            </div>
                        </div>

                        <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(360px,56vh)_minmax(280px,1fr)] lg:grid-cols-[56%_44%] lg:grid-rows-1">
                            <div className="flex min-h-0 flex-col border-b border-slate-800 p-3 sm:p-4 lg:border-b-0 lg:border-r lg:p-5">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={prettifyJson}
                                        className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-emerald-200 hover:bg-emerald-500/30"
                                    >
                                        Prettify
                                    </button>
                                    <button
                                        onClick={minifyJson}
                                        className="rounded-lg bg-sky-500/20 px-3 py-1.5 text-sm font-medium text-sky-200 hover:bg-sky-500/30"
                                    >
                                        Minify
                                    </button>
                                    <button
                                        onClick={validateOnly}
                                        className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20"
                                    >
                                        Validate
                                    </button>
                                    <button
                                        onClick={copyOutput}
                                        disabled={!output}
                                        className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/20"
                                    >
                                        Copy Output
                                    </button>
                                    <button
                                        onClick={downloadOutput}
                                        disabled={!output}
                                        className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/20"
                                    >
                                        Download
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-rose-200 hover:bg-rose-500/30"
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                                    <label className="flex items-center gap-2">
                                        Indent
                                        <select
                                            value={indent}
                                            onChange={(event) => setIndent(Number(event.target.value))}
                                            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200"
                                        >
                                            <option value={2}>2 spaces</option>
                                            <option value={4}>4 spaces</option>
                                        </select>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={sortKeys}
                                            onChange={(event) => setSortKeys(event.target.checked)}
                                        />
                                        Sort keys
                                    </label>
                                </div>

                                <textarea
                                    className="min-h-0 flex-1 resize-none overflow-auto rounded-xl border border-slate-700/80 bg-slate-950 p-3 font-mono text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400/50"
                                    value={input}
                                    onChange={(event) => {
                                        setInput(event.target.value);
                                        setWasPasteValidated(false);
                                    }}
                                    onPaste={onPasteValidate}
                                    placeholder='Paste JSON here... e.g. {"name":"Gaurav","skills":["React","TypeScript"]}'
                                />

                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                    <span>Input: {inputStats.chars} chars</span>
                                    <span>{inputStats.lines} lines</span>
                                    <span>{inputStats.bytes} bytes</span>
                                    {wasPasteValidated && <span>Validated on paste</span>}
                                </div>
                            </div>

                            <div className="flex min-h-0 flex-col bg-slate-900 p-3 sm:p-4 lg:p-5">
                                <div
                                    className={`mb-3 rounded-xl border px-3 py-2 text-sm ${isValid === null
                                        ? "border-slate-700/80 bg-slate-900 text-slate-300"
                                        : isValid
                                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                                            : "border-rose-500/40 bg-rose-500/10 text-rose-100"
                                        }`}
                                >
                                    {isValid === null && "No validation run yet."}
                                    {isValid === true && "Valid JSON."}
                                    {isValid === false && (
                                        <span>
                                            Invalid JSON: {error}
                                            {line && column ? ` (line ${line}, column ${column})` : ""}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-200">Output</h3>
                                    <div className="text-xs text-slate-500">
                                        {outputStats.chars} chars | {outputStats.lines} lines | {outputStats.bytes} bytes
                                    </div>
                                </div>

                                <pre className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-700/80 bg-slate-950 p-3 text-xs leading-5 text-emerald-100 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.5)]">
                                    {output || "Formatted JSON output will appear here."}
                                </pre>

                                <p className="mt-3 text-xs text-slate-500">
                                    Shortcuts: use <span className="font-mono">Ctrl/Cmd + V</span> to paste and auto-validate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
