import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Toast from "../Toast";
import { PsychicContext, usePsychicBlast, type PsychicPhase } from "../../hooks/usePsychicBlast";
import { useKonamiCode } from "../../hooks/useKonamiCode";
import { contact } from "../../data/site";
import type { SiteContext } from "./siteContext";
import { CONTAINER } from "./styles";

/** How long Psyduck's post-blast punchline stays up. */
const AFTERMATH_MS = 6000;

/**
 * Shell for every site page: sticky header, the page in one reading column,
 * footer. Owns what pages share — Psyduck's Confusion group (so every
 * <PsychicText> on screen joins in), the Konami shiny state and the toast —
 * and passes it down through the outlet context.
 */
export default function Layout() {
  const psyduckRef = useRef<HTMLImageElement | null>(null);
  const [phase, setPhase] = useState<PsychicPhase>("idle");
  const [aftermath, setAftermath] = useState(false);
  const [allShiny, setAllShiny] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const lastPath = useRef(pathname);

  const psychic = usePsychicBlast({
    companionRef: psyduckRef,
    onPhaseChange: (next) => {
      setPhase(next);
      if (next === "charge") setAftermath(false);
      if (next === "idle") setAftermath(true);
    },
  });

  useEffect(() => {
    if (!aftermath) return;
    const timer = window.setTimeout(() => setAftermath(false), AFTERMATH_MS);
    return () => window.clearTimeout(timer);
  }, [aftermath]);

  // New page: start at the top (back/forward keeps the browser's position) and
  // move focus to its heading so screen readers announce where you landed.
  useEffect(() => {
    // Compare paths rather than skipping the first run, which StrictMode replays.
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (navigationType !== "POP") window.scrollTo(0, 0);
    document.querySelector<HTMLElement>("#page-root h1")?.focus({ preventScroll: true });
  }, [pathname, navigationType]);

  useKonamiCode(() => {
    setAllShiny(true);
    setToast("✦ Shiny Charm obtained! Every Pokémon is shiny now.");
  });

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setToast("Email copied to clipboard ✓");
    } catch {
      setToast(`Copy failed — email is ${contact.email}`);
    }
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  const context: SiteContext = {
    confusion: psychic.blast,
    allShiny,
    copyEmail,
  };

  return (
    <PsychicContext value={psychic}>
      <div className="flex min-h-screen flex-col bg-paper text-ink">
        <Header psyduck={{ spriteRef: psyduckRef, phase, aftermath, onBlast: psychic.blast }} />
        <main id="page-root" className={`${CONTAINER} flex-1 break-words`}>
          <Outlet context={context} />
        </main>
        <Footer allShiny={allShiny} />
      </div>
      <Toast key={toast ?? "none"} message={toast ?? ""} show={toast !== null} onClose={closeToast} duration={2600} />
    </PsychicContext>
  );
}
