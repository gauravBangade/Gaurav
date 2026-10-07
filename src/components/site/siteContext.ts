import { useOutletContext } from "react-router-dom";

/** What the site layout hands every page through <Outlet context>. */
export type SiteContext = {
  /** Psyduck's page-wide Confusion. */
  confusion: () => void;
  /** Konami code: every sprite goes shiny. */
  allShiny: boolean;
  copyEmail: () => void;
};

export const useSite = () => useOutletContext<SiteContext>();
