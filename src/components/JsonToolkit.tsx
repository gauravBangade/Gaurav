import { useEffect, useMemo, useRef, useState } from "react";
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
  const [leftPaneWidth, setLeftPaneWidth] = useState(32);
  const [isResizing, setIsResizing] = useState(false);
  const desktopSplitRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (event: PointerEvent) => {
      const container = desktopSplitRef.current;
      if (!container) return;

      const bounds = container.getBoundingClientRect();
      const nextWidth = ((event.clientX - bounds.left) / bounds.width) * 100;
      const clampedWidth = Math.min(60, Math.max(24, nextWidth));
      setLeftPaneWidth(clampedWidth);
    };

    const stopResizing = () => {
      setIsResizing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
    };
  }, [isResizing]);

  return (
    <section className="json-toolkit-shell h-full w-full min-h-0 overflow-hidden bg-[#f8f5ef]">
      <div className="flex h-full min-h-0 flex-col">
        <header className="border-b border-black/10 bg-[#f8f5ef]/95 px-4 py-4 sm:px-6">
          <div>
            <h2
              onClick={handleBack}
              className="cursor-pointer text-lg font-semibold text-[#151515] transition hover:text-[#466a52] sm:text-xl"
            >
              JSON Toolkit
            </h2>
            <p className="text-xs text-black/50 sm:text-sm">Format, validate, and visualize JSON in one workspace.</p>
          </div>
        </header>

        <div className="min-h-0 flex-1 px-4 py-4 sm:px-6 sm:py-5">
          <div className="h-full min-h-0 overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#fdfbf6] shadow-none">
            <div className="border-b border-black/10 bg-[#f4efe6] px-3 py-1.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d08672]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#c8a15b]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#6c8b73]" />
                <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.14em] text-black/45">
                  graph notebook
                </span>
              </div>
            </div>

            <div className="border-b border-black/10 bg-[#f8f4ec] px-2.5 py-2 sm:px-3">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <button
                  onClick={runPrettify}
                  className="rounded-md border border-[#b7c9b8] bg-[#e4eee4] px-2.5 py-1 text-xs font-medium text-[#45654b] hover:bg-[#dce9dd]"
                >
                  Prettify
                </button>
                <button
                  onClick={runMinify}
                  className="rounded-md border border-[#cdd7df] bg-[#ebf0f3] px-2.5 py-1 text-xs font-medium text-[#516672] hover:bg-[#e0e8ed]"
                >
                  Minify
                </button>
                <button
                  onClick={downloadJson}
                  disabled={!jsonText}
                  className="rounded-md border border-black/10 bg-white/70 px-2.5 py-1 text-xs font-medium text-black/75 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Download JSON
                </button>
                <button
                  onClick={clearAll}
                  className="rounded-md border border-[#e0c1bd] bg-[#f7e9e6] px-2.5 py-1 text-xs font-medium text-[#905f57] hover:bg-[#f2dfdb]"
                >
                  Reset
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-black/60">
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
                    className="rounded-md border border-black/10 bg-white/80 px-1.5 py-0.5 text-xs text-black/80"
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

            <div className="min-h-0 flex-1 lg:hidden">
              <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(260px,38vh)_minmax(360px,1fr)]">
                <JsonEditor
                  value={jsonText}
                  error={error}
                  onChange={setJsonText}
                  onCopy={copyJson}
                  canCopy={Boolean(normalizedParsed)}
                />
                <div className="h-full min-h-0 bg-[#f4efe6] p-0">
                  <div className="json-toolkit-graph-paper h-full min-h-0 overflow-hidden border-t border-black/10">
                    {graph.nodes.length > 0 ? (
                      <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-[#5f7666]">
                        Enter valid JSON in the left panel to render the graph.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={desktopSplitRef}
              className={`hidden min-h-0 flex-1 lg:flex ${isResizing ? "select-none" : ""}`}
            >
              <div className="min-h-0 shrink-0" style={{ width: `${leftPaneWidth}%` }}>
                <JsonEditor
                  value={jsonText}
                  error={error}
                  onChange={setJsonText}
                  onCopy={copyJson}
                  canCopy={Boolean(normalizedParsed)}
                />
              </div>

              <button
                type="button"
                aria-label="Resize panels"
                title="Drag to resize"
                onPointerDown={(event) => {
                  event.preventDefault();
                  setIsResizing(true);
                }}
                onDoubleClick={() => setLeftPaneWidth(32)}
                className="group relative z-10 w-3 shrink-0 cursor-col-resize border-x border-black/10 bg-[#f4efe6] transition hover:bg-[#ebe4d8]"
              >
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#c5bcaf]" />
                <span className="absolute left-1/2 top-1/2 h-14 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c5bcaf] transition group-hover:bg-[#95af98]" />
              </button>

              <div className="min-h-0 min-w-0 flex-1 bg-[#f4efe6] p-0">
                <div className="json-toolkit-graph-paper h-full min-h-0 overflow-hidden">
                  {graph.nodes.length > 0 ? (
                    <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-[#5f7666]">
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
