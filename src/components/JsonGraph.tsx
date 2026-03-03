import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GraphCanvas from "./GraphCanvas";
import JsonEditor from "./JsonEditor";
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
    },
    {
      "name": "Orange",
      "color": "#FFA500",
      "details": {
        "type": "Citrus",
        "season": "Winter"
      },
      "nutrients": {
        "calories": 47,
        "fiber": "2.4g",
        "vitaminC": "53.2mg"
      }
    }
  ]
}`;

function parseJson(value: string): { parsed: unknown | null; error: string | null } {
  if (!value.trim()) {
    return { parsed: null, error: "JSON input is empty." };
  }

  try {
    return { parsed: JSON.parse(value) as unknown, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return { parsed: null, error: `Invalid JSON: ${message}` };
  }
}

export default function JsonGraph() {
  const navigate = useNavigate();
  const [jsonText, setJsonText] = useState<string>(INITIAL_JSON);

  const { parsed, error } = useMemo(() => parseJson(jsonText), [jsonText]);

  const graph: GraphData = useMemo(() => {
    if (!parsed) {
      return { nodes: [], edges: [] };
    }
    return jsonToGraph(parsed);
  }, [parsed]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
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
              JSON Graph
            </h2>
            <p className="text-xs text-slate-400 sm:text-sm">Paste JSON and explore relationships as a visual graph.</p>
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
                  json-graph-terminal
                </span>
              </div>
            </div>

            <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(280px,44vh)_minmax(300px,1fr)] lg:grid-cols-[32%_68%] lg:grid-rows-1">
              <JsonEditor value={jsonText} error={error} onChange={setJsonText} />
              <div className="h-full min-h-0 bg-slate-900 p-3 sm:p-4 lg:p-5">
                <div className="h-full min-h-0 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.5)]">
                  {graph.nodes.length > 0 ? (
                    <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
                      Enter valid JSON in the left panel to render the graph.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
