import { useState } from "react";

export default function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const formatJSON = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
        } catch {
            setOutput("Invalid JSON");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">JSON Formatter</h2>

            <textarea
                className="w-full h-40 bg-neutral-800 p-3 rounded-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste JSON here..."
            />

            <button
                onClick={formatJSON}
                className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
                Format
            </button>

            <pre className="mt-4 bg-neutral-900 p-4 rounded-lg overflow-auto text-sm">
                {output}
            </pre>
        </div>
    );
}