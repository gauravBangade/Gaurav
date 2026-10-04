import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import PsychicText from "../PsychicText";
import RichText from "../RichText";
import { builtThings, currentProjectId, profile, projects, stats, type Stat } from "../../data/site";
import { spriteSrc } from "../../data/party";
import { prefersReducedMotion, useInView } from "../../hooks/useInView";
import { useNightShade } from "../../pokemon/useNightShade";
import { BENTO, CTA, EYEBROW, GHOST_BUTTON, TILE, TILE_INTERACTIVE } from "./styles";

const COUNT_MS = 1400;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Counts from 0 to `target` once `run` turns true, like an EXP bar filling. */
function useCountUp(target: number, run: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS);
      setValue(Math.round(easeOutCubic(p) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run]);

  return value;
}

function StatTile({ stat, run }: { stat: Stat; run: boolean }) {
  const value = useCountUp(stat.value, run);
  const full = `${stat.prefix ?? ""}${stat.value.toLocaleString("en-US")}${stat.suffix ?? ""}`;

  return (
    // Stretches to the row height next to the hero, so the bar sits at the bottom.
    <div className={`${TILE} flex flex-col`}>
      <dt className={EYEBROW}>
        <PsychicText split="words" text={stat.label} />
      </dt>
      <dd className="mb-3 mt-2.5 text-[26px] font-bold tabular-nums sm:text-[32px]">
        <span className="sr-only">{full}</span>
        <span aria-hidden="true">
          {stat.prefix}
          {value.toLocaleString("en-US")}
          {stat.suffix}
        </span>
      </dd>
      {/* EXP bar: decorative, fills alongside the count. */}
      <div aria-hidden="true" className="mt-auto h-1.5 overflow-hidden rounded-full bg-ink/10 pt-0">
        <div className="h-full rounded-full bg-[#3fa7e8]" style={{ width: `${(value / stat.value) * 100}%` }} />
      </div>
    </div>
  );
}

/** A tile-sized Gengar: using it plays Night Shade, same as the header switch and the party move. */
function GengarTile() {
  const { spriteRef: gengarRef, trigger: nightShade } = useNightShade();

  return (
    <button
      type="button"
      onClick={nightShade}
      className={`${TILE_INTERACTIVE} flex flex-col justify-between overflow-hidden !border-0 bg-gradient-to-br from-[#735797] to-[#2b2140] text-white`}
    >
      <span className="block">
        <span className="block font-pixel text-[8px] uppercase tracking-wider text-white/60">Gengar used</span>
        <span className="mt-1.5 block text-[17px] font-semibold">Night Shade</span>
        <span className="mt-1 block text-sm text-white/70">Tap to flip the lights.</span>
      </span>
      <img
        ref={gengarRef}
        src={spriteSrc("gengar")}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="pixelated -mb-3 -mr-2 h-20 w-20 self-end"
      />
    </button>
  );
}

type OverviewProps = {
  psyduck: ReactNode;
  onOpenProject: (id: string) => void;
};

/** The first screen: hero, what I'm building now, the numbers and two playful tiles. */
export default function Overview({ psyduck, onOpenProject }: OverviewProps) {
  // Observe the whole section: the <dl> below is display: contents, which has no box to intersect.
  const [sectionRef, statsInView] = useInView<HTMLElement>("0px");
  const current = projects.find((project) => project.id === currentProjectId)!;
  const built = builtThings[0];

  return (
    <section ref={sectionRef} aria-label="Overview" className={`${BENTO} pt-6 sm:pt-8`}>
      <div
        className={`${TILE} col-span-2 bg-gradient-to-br from-accent/[0.14] via-card to-card p-6 lg:row-span-2 lg:p-7`}
      >
        {psyduck}
        <h1 className="mt-4 text-[clamp(1.85rem,4vw,2.6rem)] font-semibold leading-tight">
          <PsychicText text={profile.greeting} />
        </h1>
        <p className="mt-1.5 font-pixel text-[9px] uppercase leading-relaxed tracking-wider text-accent">
          <PsychicText split="words" text={profile.headline} />
        </p>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/75">
          {profile.intro.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <a href="#work" className={CTA}>
            See my work
          </a>
          <a href="#contact" className={GHOST_BUTTON}>
            Get in touch
          </a>
        </div>
      </div>

      <button type="button" onClick={() => onOpenProject(current.id)} className={`${TILE_INTERACTIVE} col-span-2 flex items-center gap-4`}>
        {current.lead && (
          <img
            src={spriteSrc(current.lead.pokemon)}
            alt=""
            aria-hidden="true"
            draggable="false"
            className="pixelated h-20 w-20 shrink-0 sm:h-[84px] sm:w-[84px]"
          />
        )}
        <span className="block min-w-0">
          <span className={`${EYEBROW} flex items-center gap-2`}>
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#4cd964] shadow-[0_0_0_3px_rgba(76,217,100,0.2)]" />
            Building now
          </span>
          <span className="mt-1.5 block text-[17px] font-semibold leading-snug">
            <PsychicText split="words" text={current.title} />
          </span>
          <span className="mt-1 block text-sm text-ink/65">
            <PsychicText split="words" text={current.stack.slice(0, 5).join(" · ")} />
          </span>
        </span>
      </button>

      {/* display: contents lets the four stat tiles sit directly in the bento grid. */}
      <dl id="numbers" className="contents">
        {stats.map((stat) => (
          <StatTile key={stat.label} stat={stat} run={statsInView} />
        ))}
      </dl>

      <GengarTile />

      <Link to={built.to} className={`${TILE_INTERACTIVE} group`}>
        <span className={`${EYEBROW} block`}>Side project</span>
        <span className="mt-1.5 flex items-center gap-2 text-[17px] font-semibold">
          <PsychicText split="words" text={built.title} />
          <span aria-hidden="true" className="text-accent transition group-hover:translate-x-1">
            →
          </span>
        </span>
        <span className="mt-1 block text-sm text-ink/65">
          <PsychicText split="words" text={built.description} />
        </span>
      </Link>
    </section>
  );
}
