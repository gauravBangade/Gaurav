import { useEffect } from "react";

const SITE = "Gaurav Bangade";

/** "Work — Gaurav Bangade"; with no title, the site's own title. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Software Engineer`;
  }, [title]);
}
