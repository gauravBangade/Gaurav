import {
  siApacheecharts,
  siGit,
  siLangchain,
  siNestjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siReactquery,
  siRedux,
  siTailwindcss,
  siTanstack,
  siTypescript,
  siVite,
  siVitest,
  type SimpleIcon,
} from "simple-icons";
import { featuredSkills } from "../../data/site";
import { PIXEL_LABEL } from "./styles";

/** Brand logo per skill name in featuredSkills, so each slot reads at a glance. */
const SKILL_ICONS: Record<string, SimpleIcon> = {
  React: siReact,
  TypeScript: siTypescript,
  "TanStack Start": siTanstack,
  NestJS: siNestjs,
  PostgreSQL: siPostgresql,
  "TanStack Query": siReactquery,
  "Node.js": siNodedotjs,
  Python: siPython,
  Redux: siRedux,
  ECharts: siApacheecharts,
  "Tailwind CSS": siTailwindcss,
  Vite: siVite,
  Vitest: siVitest,
  LangChain: siLangchain,
  Git: siGit,
};

/** Relative luminance of a brand hex colour, 0 (black) to 1 (white). */
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * A skill's logo in its brand colour. Near-black brands switch to the ink
 * colour at night, near-white ones (TanStack) do so by day, and bright ones
 * (Vitest) are dimmed by day, so every logo stays visible on the card (see
 * .skill-icon in index.css).
 */
function SkillIcon({ icon }: { icon: SimpleIcon }) {
  const lum = luminance(icon.hex);
  const tone = lum < 0.05 ? "skill-icon--dark" : lum > 0.75 ? "skill-icon--pale" : lum > 0.5 ? "skill-icon--bright" : "";
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`skill-icon ${tone} h-6 w-6 shrink-0`} style={{ color: `#${icon.hex}` }}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

/**
 * Main technologies as one row of inventory slots that scrolls sideways on its
 * own, forever: the list is rendered twice and the row slides left by exactly
 * one copy, then starts over (.skills-marquee in index.css). With reduced
 * motion it stays still and can be swiped instead. The ▶ cursor marks the slot
 * under the pointer, like a Game Boy item menu.
 */
export default function SkillsCarousel() {
  const mask = "linear-gradient(90deg, transparent, black 1.25rem, black calc(100% - 1.25rem), transparent)";

  return (
    <div>
      <div style={{ maskImage: mask, WebkitMaskImage: mask }} className="skills-marquee no-scrollbar -mx-1 overflow-hidden py-1">
        <ul aria-label="Main technologies" className="skills-marquee__track flex w-max">
          {[...featuredSkills, ...featuredSkills].map((skill, index) => {
            const duplicate = index >= featuredSkills.length;
            return (
              <li
                key={`${skill.name}-${duplicate ? "copy" : "main"}`}
                // The second copy only exists for the loop; screen readers get the list once.
                aria-hidden={duplicate || undefined}
                // Spacing is a right margin, not gap, so both copies are the same width and the loop is seamless.
                className="group pixel-card relative mr-2.5 flex min-w-[8.5rem] shrink-0 items-center gap-3 whitespace-nowrap py-2.5 pl-3.5 pr-4 sm:mr-3"
              >
                {SKILL_ICONS[skill.name] && <SkillIcon icon={SKILL_ICONS[skill.name]} />}
                <span>
                  <span className={`block ${PIXEL_LABEL}`}>{skill.area}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-[0.95rem] font-medium text-ink">
                    <span aria-hidden="true" className="font-pixel text-[8px] text-accent opacity-0 transition group-hover:opacity-100">
                      ▶
                    </span>
                    <span className="-ml-3.5 transition-[margin] group-hover:ml-0">{skill.name}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
