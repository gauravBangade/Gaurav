import PsychicText from "../PsychicText";
import RichText from "../RichText";
import Section from "./Section";
import { DomainBadges } from "./DomainBadges";
import { alsoBuilt, projects, role, type Project } from "../../data/site";
import { spriteSrc } from "../../data/party";
import { BENTO, EYEBROW, TILE, TILE_INTERACTIVE, formatMonth } from "./styles";

/**
 * Where each project sits in the bento. Phones: every tile full width.
 * Large screens: the flagship gets a 2×2 tile, two projects share a row.
 */
const LAYOUT: Record<string, string> = {
  platform: "col-span-2 lg:row-span-2",
  reporting: "col-span-2 lg:col-span-1",
  "voyage-estimator": "col-span-2 lg:col-span-1",
};

/** Vessel nodes syncing with shore, for the flagship tile's spare space. */
function SyncDiagram() {
  // Spans, not divs: this sits inside the tile's <button>.
  return (
    <span aria-hidden="true" className="mt-auto hidden items-center gap-3 pt-6 font-pixel text-[7px] uppercase tracking-wider text-ink/60 lg:flex">
      <span className="grid gap-1.5">
        {["Vessel A", "Vessel B", "Vessel C"].map((name) => (
          <span key={name} className="rounded-md border border-ink/20 bg-paper px-2 py-1.5">
            {name} <span className="text-ink/40">· node</span>
          </span>
        ))}
      </span>
      <span className="relative flex-1">
        <span className="sync-line block h-0.5" />
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-card px-1">sync</span>
      </span>
      <span className="rounded-lg border-2 border-ink/50 bg-accent/10 px-3 py-4 text-ink/80">Shore</span>
    </span>
  );
}

function WorkTile({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const flagship = index === 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`${TILE_INTERACTIVE} group flex flex-col pb-11 ${LAYOUT[project.id] ?? "col-span-2"}`}
    >
      {project.lead && (
        <img
          src={spriteSrc(project.lead.pokemon)}
          alt=""
          aria-hidden="true"
          draggable="false"
          className={`pixelated absolute right-2 top-1 opacity-90 transition group-hover:-translate-y-1 ${flagship ? "h-[72px] w-[72px] lg:bottom-32 lg:right-8 lg:top-auto lg:h-32 lg:w-32" : "h-[72px] w-[72px]"}`}
        />
      )}
      <span className={`${EYEBROW} block`}>
        No.{String(index + 1).padStart(3, "0")} · {project.period}
      </span>
      <span className={`mt-1.5 block pr-16 font-semibold leading-snug ${flagship ? "text-xl lg:text-2xl" : "text-[17px]"}`}>
        <PsychicText split="words" text={project.title} />
      </span>
      <span className={`mt-1.5 block text-sm leading-relaxed text-ink/70 ${flagship ? "lg:text-[15px]" : project.lead ? "pr-10 sm:pr-14" : ""}`}>
        <RichText text={project.summary} />
      </span>
      <span className="mt-3 block">
        <DomainBadges domains={project.domains} />
      </span>
      {flagship && <SyncDiagram />}
      <span aria-hidden="true" className="absolute bottom-3.5 right-4 text-xs font-medium text-accent">
        Details →
      </span>
    </button>
  );
}

export default function WorkSection({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  return (
    <Section
      id="work"
      title="Work"
      meta={
        <>
          <span className="font-medium text-ink/80">
            <PsychicText split="words" text={role.title} />
          </span>{" "}
          <PsychicText split="words" text={`· ${role.field} · ${formatMonth(role.start)} –`} />{" "}
          <PsychicText split="words" text={role.end ? formatMonth(role.end) : "present"} />
        </>
      }
    >
      <div className={BENTO}>
        {projects.map((project, index) => (
          <WorkTile key={project.id} project={project} index={index} onOpen={() => onOpenProject(project.id)} />
        ))}
        <div className={`${TILE} col-span-2`}>
          <p className={EYEBROW}>
            <PsychicText split="words" text="Also along the way" />
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-ink/70 marker:text-ink/30">
            {alsoBuilt.map((item) => (
              <li key={item}>
                <PsychicText split="words" text={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
