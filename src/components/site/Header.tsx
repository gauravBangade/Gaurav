import type { ComponentProps } from "react";
import { Link, NavLink } from "react-router-dom";
import { pages, profile } from "../../data/site";
import { spriteSrc } from "../../data/party";
import { useTheme } from "../../hooks/useTheme";
import { useNightShade } from "../../pokemon/useNightShade";
import PsyduckButton from "./PsyduckButton";
import { CONTAINER, FOCUS_RING } from "./styles";

/**
 * Sticky header: Psyduck's Confusion and the name (home) on the left; page
 * links and Gengar's night switch on the right. Fits a 360px phone without a menu.
 */
export default function Header({ psyduck }: { psyduck: ComponentProps<typeof PsyduckButton> }) {
  const theme = useTheme();
  const { spriteRef: gengarRef, trigger: nightShade } = useNightShade();
  const [first, ...rest] = profile.name.split(" ");

  return (
    <header className="print-hidden sticky top-0 z-50 border-b border-ink/[0.06] bg-paper/80 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-16 items-center gap-1.5 sm:gap-3`}>
        <div className="mr-auto flex items-center gap-1.5 sm:gap-3">
          <PsyduckButton {...psyduck} />
          <Link to="/" className={`rounded font-serif text-[1.35rem] leading-none ${FOCUS_RING}`}>
            {first}
            <span className="hidden sm:inline"> {rest.join(" ")}</span>
          </Link>
        </div>

        <nav aria-label="Main">
          <ul className="flex items-center sm:gap-1">
            {pages.map((page) => (
              <li key={page.to}>
                {/* NavLink sets aria-current="page", and stays active on child routes like /work/:id. */}
                <NavLink
                  to={page.to}
                  className={({ isActive }) =>
                    // Tighter on phones so four links, the name, Psyduck and Gengar fit a 360px screen.
                    `relative block rounded-full px-[0.3rem] py-2 text-[13px] transition sm:px-3 sm:text-sm ${FOCUS_RING} ${
                      isActive
                        ? "text-ink after:absolute after:inset-x-[0.3rem] after:bottom-1 after:h-px after:bg-accent sm:after:inset-x-3"
                        : "text-ink/60 hover:text-ink"
                    }`
                  }
                >
                  {page.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={nightShade}
          aria-pressed={theme === "dark"}
          aria-label="Night mode"
          title={theme === "dark" ? "Gengar: lights on" : "Gengar: lights off"}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 bg-card transition hover:border-ink/30 ${FOCUS_RING}`}
        >
          <img ref={gengarRef} src={spriteSrc("gengar")} alt="" aria-hidden="true" className="pixelated h-9 w-9" draggable="false" />
        </button>
      </div>
    </header>
  );
}
