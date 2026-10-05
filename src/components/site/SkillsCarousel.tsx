import { useEffect, useRef, useState } from "react";
import { featuredSkills } from "../../data/site";
import { prefersReducedMotion } from "../../hooks/prefersReducedMotion";
import { ArrowRightIcon } from "./icons";
import { FOCUS_RING, PIXEL_LABEL } from "./styles";

const ARROW_BUTTON = `grid h-8 w-8 place-items-center pixel-card pixel-card-link text-ink/70 transition disabled:opacity-30 ${FOCUS_RING}`;

/**
 * Main technologies as one row of inventory slots: swipe on phones, arrow
 * buttons on larger screens (the strip itself takes keyboard focus for arrow-key
 * scrolling). The ▶ cursor marks the slot under the pointer, like a Game Boy
 * item menu. Edges fade to hint there is more to scroll.
 */
export default function SkillsCarousel() {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({
        start: track.scrollLeft <= 4,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
      });
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  // Fade only the side that has more to scroll, so the first and last slots stay crisp.
  const fadeStart = edges.start ? "black" : "transparent";
  const fadeEnd = edges.end ? "black" : "transparent";
  const mask = `linear-gradient(90deg, ${fadeStart}, black 1.25rem, black calc(100% - 1.25rem), ${fadeEnd})`;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className={PIXEL_LABEL}>{featuredSkills.length} items · most used first</p>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Scroll skills left" className={ARROW_BUTTON}>
            <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} disabled={edges.end} aria-label="Scroll skills right" className={ARROW_BUTTON}>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Main technologies"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className={`no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-1 px-1 py-1 sm:gap-3 ${FOCUS_RING}`}
      >
        {featuredSkills.map((skill) => (
          <li
            key={skill.name}
            // Sized to content on one line, so a long name never stretches the whole row.
            className="group pixel-card relative min-w-[8.5rem] shrink-0 snap-start whitespace-nowrap px-3.5 pb-3 pt-2.5"
          >
            <span className={`block ${PIXEL_LABEL}`}>{skill.area}</span>
            <span className="mt-1 flex items-center gap-1.5 text-[0.95rem] font-medium text-ink">
              <span aria-hidden="true" className="font-pixel text-[8px] text-accent opacity-0 transition group-hover:opacity-100">
                ▶
              </span>
              <span className="-ml-3.5 transition-[margin] group-hover:ml-0">{skill.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
