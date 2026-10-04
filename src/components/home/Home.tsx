import { useCallback, useEffect, useRef, useState } from "react";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import Header from "./Header";
import Overview from "./Overview";
import PartySection from "./PartySection";
import ProjectSheet from "./ProjectSheet";
import PsyduckHero from "./PsyduckHero";
import RouteSection from "./RouteSection";
import WorkSection from "./WorkSection";
import Toast from "../Toast";
import { PsychicContext, usePsychicBlast, type PsychicPhase } from "../../hooks/usePsychicBlast";
import { useKonamiCode } from "../../hooks/useKonamiCode";
import { contact, projects } from "../../data/site";
import { BENTO } from "./styles";

/** How long Psyduck's post-blast punchline stays up. */
const AFTERMATH_MS = 6000;

/**
 * The home page: sticky header, a bento grid of sections, and a footer.
 * Every <PsychicText> on the page registers with one Confusion group, fired
 * by either Psyduck.
 */
export default function Home() {
  const psyduckRef = useRef<HTMLImageElement | null>(null);
  const [phase, setPhase] = useState<PsychicPhase>("idle");
  const [aftermath, setAftermath] = useState(false);
  const [allShiny, setAllShiny] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

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

  useKonamiCode(() => {
    setAllShiny(true);
    setToast("✦ Shiny Charm obtained! Every Pokémon is shiny now.");
  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setToast("Email copied to clipboard ✓");
    } catch {
      setToast(`Copy failed — email is ${contact.email}`);
    }
  };

  const closeToast = useCallback(() => setToast(null), []);
  const closeProject = useCallback(() => setOpenProjectId(null), []);
  const openProject = projects.find((project) => project.id === openProjectId) ?? null;

  return (
    <PsychicContext value={psychic}>
      <div id="top" className="text-ink">
        <Header />

        <main id="home-root" className="mx-auto w-full max-w-6xl break-words px-4 sm:px-7">
          <Overview
            psyduck={<PsyduckHero spriteRef={psyduckRef} phase={phase} aftermath={aftermath} onBlast={psychic.blast} />}
            onOpenProject={setOpenProjectId}
          />
          <WorkSection onOpenProject={setOpenProjectId} />
          <RouteSection />
          <div className={`${BENTO} pt-12 sm:pt-14`}>
            <PartySection confusion={psychic.blast} allShiny={allShiny} />
            <ContactSection onCopyEmail={copyEmail} />
          </div>
        </main>

        <Footer allShiny={allShiny} onCopyEmail={copyEmail} />
      </div>

      <ProjectSheet project={openProject} onClose={closeProject} />
      <Toast key={toast ?? "none"} message={toast ?? ""} show={toast !== null} onClose={closeToast} duration={2600} />
    </PsychicContext>
  );
}
