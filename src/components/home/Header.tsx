import { useEffect, useRef, useState } from "react";
import PokeballIcon from "./PokeballIcon";
import PsychicText from "../PsychicText";
import { sections } from "../../data/site";
import { spriteSrc } from "../../data/party";
import { useActiveSection } from "../../hooks/useInView";
import { useTheme } from "../../hooks/useTheme";
import { useNightShade } from "../../pokemon/useNightShade";
import { CTA, FOCUS_RING } from "./styles";

const ICON_BUTTON = `grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ink/15 bg-card transition hover:border-ink/40 ${FOCUS_RING}`;

/** The scroll-progress line under the header, written straight to the DOM (no re-render per frame). */
function useScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

/**
 * Sticky site header. Large screens: name, section links (the current one
 * highlighted), Gengar's night switch and "Email me". Phones: name, Gengar and
 * a Game Boy START menu.
 */
export default function Header() {
  const active = useActiveSection(sections.map((section) => section.id));
  const theme = useTheme();
  const { spriteRef: gengarRef, trigger: nightShade } = useNightShade();
  const progressRef = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !menuButtonRef.current?.contains(target)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-7">
        <a href="#top" className={`flex items-center gap-2 rounded-lg font-semibold ${FOCUS_RING}`}>
          <img src={spriteSrc("psyduck")} alt="" aria-hidden="true" className="pixelated -my-2 h-10 w-10" draggable="false" />
          <PsychicText split="words" text="Gaurav Bangade" />
        </a>

        <nav aria-label="Sections" className="mx-auto hidden lg:block">
          <ul className="flex gap-1">
            {sections.map((section) => {
              const current = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={current ? "location" : undefined}
                    className={`block rounded-full px-3 py-2 text-sm transition ${FOCUS_RING} ${
                      current ? "bg-accent/15 text-ink" : "text-ink/65 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    <PsychicText split="words" text={section.label} />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={nightShade}
            aria-pressed={theme === "dark"}
            aria-label="Night mode (Gengar uses Night Shade)"
            title={theme === "dark" ? "Lights on" : "Lights off"}
            className={ICON_BUTTON}
          >
            <img
              ref={gengarRef}
              src={spriteSrc("gengar")}
              alt=""
              aria-hidden="true"
              className="pixelated h-10 w-10"
              draggable="false"
            />
          </button>

          <a href="#contact" className={`${CTA} hidden lg:inline-flex`}>
            <PokeballIcon className="h-4 w-4 text-ink" />
            Email me
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="start-menu"
            aria-label="Menu"
            className={`${ICON_BUTTON} text-lg lg:hidden`}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Phone menu, styled as the Game Boy START menu. */}
        <div
          ref={menuRef}
          id="start-menu"
          hidden={!menuOpen}
          className="poke-dialog !absolute right-4 top-[4.25rem] w-[min(16rem,calc(100vw-2rem))] !p-2 shadow-xl sm:right-7 lg:hidden"
        >
          <nav aria-label="Menu">
            <ul>
              {[...sections, { id: "contact", label: "Email me" }].map((section) => (
                <li key={section.label}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="group flex min-h-11 items-center gap-2.5 rounded px-2.5 text-[10px] uppercase focus:outline-none focus-visible:bg-black/5"
                  >
                    <span aria-hidden="true" className="invisible text-[8px] group-hover:visible group-focus-visible:visible">
                      ▶
                    </span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div ref={progressRef} aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-[#e3350d]" />
    </header>
  );
}
