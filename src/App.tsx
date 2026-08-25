import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./components/About";
import JsonToolkit from "./components/JsonToolkit";

const LEGACY_REDIRECTS: Record<string, string> = {
  "/json-formatter": "/json-toolkit",
  "/json-graph": "/json-toolkit",
  "/about": "/",
  "/education": "/",
};

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="min-h-screen bg-[#f8f5ef] text-[#151515]">
            <About />
          </main>
        }
      />
      <Route
        path="/json-toolkit"
        element={
          <main className="h-screen bg-[#f8f5ef] text-[#151515]">
            <JsonToolkit />
          </main>
        }
      />
      {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
