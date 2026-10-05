import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import JsonToolkit from "./components/JsonToolkit";
import Layout from "./components/site/Layout";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import PartyPage from "./pages/PartyPage";
import ProjectPage from "./pages/ProjectPage";
import WorkPage from "./pages/WorkPage";

const LEGACY_REDIRECTS: Record<string, string> = {
  "/json-formatter": "/json-toolkit",
  "/json-graph": "/json-toolkit",
  "/about": "/",
  "/education": "/",
  "/route": "/",
};

export default function App() {
  return (
    <Routes>
      {/* Site pages share the header, footer and Psyduck's Confusion group. */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="work/:id" element={<ProjectPage />} />
        <Route path="party" element={<PartyPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
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
