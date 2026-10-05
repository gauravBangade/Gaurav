import type { RefObject } from "react";
import { useOutletContext } from "react-router-dom";
import type { PsychicPhase } from "../../hooks/usePsychicBlast";

/** What the site layout hands every page through <Outlet context>. */
export type SiteContext = {
  /** The hero Psyduck's sprite, shaken by Confusion. Only the home page attaches it. */
  psyduckRef: RefObject<HTMLImageElement | null>;
  phase: PsychicPhase;
  /** True for a while after a Confusion blast, for Psyduck's punchline. */
  aftermath: boolean;
  /** Psyduck's page-wide Confusion. */
  confusion: () => void;
  /** Konami code: every sprite goes shiny. */
  allShiny: boolean;
  copyEmail: () => void;
};

export const useSite = () => useOutletContext<SiteContext>();
