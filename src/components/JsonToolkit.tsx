import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GraphCanvas from "./GraphCanvas";
import JsonEditor from "./JsonEditor";
import Toast from "./Toast";
import { jsonToGraph } from "../utils/jsonToGraph";
import type { GraphData } from "../types/graph";

const INITIAL_JSON = `{
  "fruits": [
    {
      "name": "Apple",
      "color": "#FF0000",
      "details": {
        "type": "Pome",
        "season": "Fall"
      },
      "nutrients": {
        "calories": 52,
        "fiber": "2.4g",
        "vitaminC": "4.6mg"
      }
    },
    {
      "name": "Banana",
      "color": "#FFFF00",
      "details": {
        "type": "Berry",
        "season": "Year-round"
      },
      "nutrients": {
        "calories": 89,
        "fiber": "2.6g",
        "potassium": "358mg"
      }
    }
  ]
}`;

type ParseResult = {
  parsed: unknown | null;
  error: string | null;
  line: number | null;
  column: number | null;
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

function getLineAndColumn(input: string, message: string): Pick<ParseResult, "line" | "column"> {
  const positionMatch = message.match(/position\s(\d+)/i);
  if (!positionMatch) return { line: null, column: null };

  const position = Number(positionMatch[1]);
  if (!Number.isFinite(position) || position < 0) return { line: null, column: null };

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

function parseJson(value: string): ParseResult {
  if (!value.trim()) {
    return { parsed: null, error: "JSON input is empty.", line: null, column: null };
  }

  try {
    return { parsed: JSON.parse(value) as unknown, error: null, line: null, column: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    const { line, column } = getLineAndColumn(value, message);
    return { parsed: null, error: `Invalid JSON: ${message}`, line, column };
  }
}

export default function JsonToolkit() {
  const navigate = useNavigate();
  const [jsonText, setJsonText] = useState<string>(INITIAL_JSON);
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { parsed, error } = useMemo(() => parseJson(jsonText), [jsonText]);

  const inputStats = useMemo(() => {
    const size = new Blob([jsonText]).size;
    return {
      chars: jsonText.length,
      bytes: size,
      lines: jsonText ? jsonText.split("\n").length : 0,
    };
  }, [jsonText]);

  const graph: GraphData = useMemo(() => {
    if (!parsed) {
      return { nodes: [], edges: [] };
    }
    return jsonToGraph(parsed);
  }, [parsed]);

  const normalizedParsed = useMemo(() => {
    if (!parsed) return null;
    return sortKeys ? sortObjectKeys(parsed) : parsed;
  }, [parsed, sortKeys]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const runPrettify = () => {
    if (!normalizedParsed) {
      return;
    }
    setJsonText(JSON.stringify(normalizedParsed, null, indent));
  };

  const runMinify = () => {
    if (!normalizedParsed) {
      return;
    }
    setJsonText(JSON.stringify(normalizedParsed));
  };

  const copyJson = async () => {
    if (!normalizedParsed) return;
    const formatted = JSON.stringify(normalizedParsed, null, indent);
    setJsonText(formatted);

    try {
      await navigator.clipboard.writeText(formatted);
      setToastMessage("JSON formatted and copied.");
      setShowToast(true);
    } catch {
      setToastMessage("Copy failed. Please check clipboard permissions.");
      setShowToast(true);
    }
  };

  const downloadJson = () => {
    if (!normalizedParsed) return;
    const formatted = JSON.stringify(normalizedParsed, null, indent);
    const blob = new Blob([formatted], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "json-toolkit.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJsonText(INITIAL_JSON);
  };

  return (
    <section className="h-full w-full min-h-0 overflow-hidden bg-slate-950">
      <div className="flex h-full min-h-0 flex-col">
        <header className="border-b border-white/10 bg-slate-950/95 px-4 py-3 sm:px-6">
          <div>
            <h2
              onClick={handleBack}
              className="cursor-pointer text-lg font-semibold text-white transition hover:text-emerald-300 sm:text-xl"
            >
              JSON Toolkit
            </h2>
            <p className="text-xs text-slate-400 sm:text-sm">Format, validate, and visualize JSON in one workspace.</p>
          </div>
        </header>

        <div className="min-h-0 flex-1 px-4 py-4 sm:px-6 sm:py-5">
          <div className="h-full min-h-0 overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/75 shadow-[0_24px_60px_rgba(2,6,23,0.7),0_0_0_1px_rgba(148,163,184,0.12)]">
            <div className="border-b border-slate-700/80 bg-slate-900/90 px-3 py-1.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                  json-toolkit-terminal
                </span>
              </div>
            </div>

            <div className="border-b border-slate-800/90 bg-slate-900/85 px-2.5 py-2 sm:px-3">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <button
                  onClick={runPrettify}
                  className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-200 hover:bg-emerald-500/30"
                >
                  Prettify
                </button>
                <button
                  onClick={runMinify}
                  className="rounded-md bg-sky-500/20 px-2.5 py-1 text-xs font-medium text-sky-200 hover:bg-sky-500/30"
                >
                  Minify
                </button>
                <button
                  onClick={copyJson}
                  disabled={!jsonText}
                  className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Copy JSON
                </button>
                <button
                  onClick={downloadJson}
                  disabled={!jsonText}
                  className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Download JSON
                </button>
                <button
                  onClick={clearAll}
                  className="rounded-md bg-rose-500/20 px-2.5 py-1 text-xs font-medium text-rose-200 hover:bg-rose-500/30"
                >
                  Reset
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-300">
                <label className="flex items-center gap-1.5">
                  Indent
                  <select
                    value={indent}
                    onChange={(event) => {
                      const nextIndent = Number(event.target.value);
                      setIndent(nextIndent);

                      if (!parsed) return;
                      const nextValue = sortKeys ? sortObjectKeys(parsed) : parsed;
                      setJsonText(JSON.stringify(nextValue, null, nextIndent));
                    }}
                    className="rounded-md border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-xs text-slate-100"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={sortKeys}
                    onChange={(event) => {
                      const nextSort = event.target.checked;
                      setSortKeys(nextSort);

                      if (!parsed) return;
                      const nextValue = nextSort ? sortObjectKeys(parsed) : parsed;
                      setJsonText(JSON.stringify(nextValue, null, indent));
                    }}
                  />
                  Sort keys
                </label>
                <span>
                  Input: {inputStats.chars} chars | {inputStats.lines} lines | {inputStats.bytes} bytes
                </span>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(260px,38vh)_minmax(360px,1fr)] lg:grid-cols-[32%_68%] lg:grid-rows-1">
              <JsonEditor value={jsonText} error={error} onChange={setJsonText} />
              <div className="h-full min-h-0 bg-slate-900 p-0">
                <div className="h-full min-h-0 overflow-hidden border border-slate-700/70 bg-slate-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.5)]">
                  {graph.nodes.length > 0 ? (
                    <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-400">
                      Enter valid JSON in the left panel to render the graph.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
}
