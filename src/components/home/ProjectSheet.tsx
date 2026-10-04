import { useEffect, useRef } from "react";
import PsychicText from "../PsychicText";
import RichText from "../RichText";
import { DomainBadges } from "./DomainBadges";
import { projects, type Project } from "../../data/site";
import { pokemonById, spriteSrc } from "../../data/party";
import { EYEBROW, FOCUS_RING } from "./styles";

type ProjectSheetProps = {
  project: Project | null;
  onClose: () => void;
};

/**
 * Work details in a native modal <dialog>: centred on large screens, a bottom
 * sheet on phones (see dialog.sheet in App.css). The dialog traps focus, Esc
 * closes it, and so does a click on the backdrop.
 */
export default function ProjectSheet({ project, onClose }: ProjectSheetProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
    // Stop the page scrolling behind the sheet.
    document.documentElement.style.overflow = project ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [project]);

  const index = project ? projects.indexOf(project) : -1;
  const lead = project?.lead && pokemonById(project.lead.pokemon);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="project-sheet-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <div className="relative space-y-4 p-5 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-xl border border-ink/15 bg-card text-ink/70 transition hover:text-ink ${FOCUS_RING}`}
          >
            ✕
          </button>

          <div className="flex items-start gap-3 pr-12">
            {lead && (
              <img src={spriteSrc(lead.id)} alt="" aria-hidden="true" draggable="false" className="pixelated -my-2 h-16 w-16 shrink-0" />
            )}
            <div className="min-w-0">
              <p className={EYEBROW}>
                No.{String(index + 1).padStart(3, "0")} · {project.period}
              </p>
              <h2 id="project-sheet-title" className="mt-1.5 text-xl font-semibold leading-snug">
                <PsychicText split="words" text={project.title} />
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                <PsychicText split="words" text={project.role} />
              </p>
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-ink/80">
            <RichText text={project.summary} />
          </p>

          <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink/75 marker:text-ink/30 sm:text-[15px]">
            {project.details.map((item) => (
              <li key={item}>
                <RichText text={item} />
              </li>
            ))}
          </ul>

          <DomainBadges domains={project.domains} />

          <ul aria-label="Stack" className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-full border border-ink/15 px-2.5 py-0.5 text-xs text-ink/70">
                {tech}
              </li>
            ))}
          </ul>

          {lead && project.lead && (
            <p className="border-t border-dashed border-ink/15 pt-3 text-xs italic text-ink/55">
              <span className="font-pixel text-[8px] not-italic uppercase tracking-wider">{lead.name} leads:</span>{" "}
              {project.lead.note}
            </p>
          )}
        </div>
      )}
    </dialog>
  );
}
