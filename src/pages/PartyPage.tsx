import PsychicText from "../components/PsychicText";
import PartyScreen from "../components/site/PartyScreen";
import { PageHeader } from "../components/site/Section";
import { useSite } from "../components/site/siteContext";
import { CARD, PIXEL_LABEL } from "../components/site/styles";
import { SHINY_ODDS } from "../data/party";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const NOTES = [
  "One more Pokémon is resting in the PC. It likes to hide at the very bottom of the page.",
  `Each Pokémon has a 1 in ${Math.round(1 / SHINY_ODDS)} chance of being shiny on any visit.`,
  "Gengar’s Night Shade is the same switch as the Gengar in the header.",
];

/** The one page where the Pokémon get to be loud — and only when you ask them to. */
export default function PartyPage() {
  const { confusion, allShiny } = useSite();
  useDocumentTitle("My party");

  return (
    <>
      <PageHeader title="My party">
        <p>
          <PsychicText
            split="words"
            text="Six Pokémon I keep coming back to. Pick one and use its move — each one does something to this page."
          />
        </p>
      </PageHeader>

      {/* Desktop: the party screen with a notes card beside it. */}
      <div className="mt-[clamp(1.5rem,1rem+2vw,2.5rem)] grid items-start gap-[clamp(1rem,0.6rem+1.5vw,2rem)] lg:grid-cols-[minmax(0,1fr)_17rem]">
        <PartyScreen confusion={confusion} allShiny={allShiny} />

        <aside aria-label="Notes" className={CARD}>
          <span className={PIXEL_LABEL}>Notes</span>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-ink/70">
            {NOTES.map((note) => (
              <li key={note} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.45em] font-pixel text-[7px] leading-none text-accent">
                  ▶
                </span>
                <span>
                  <PsychicText split="words" text={note} />
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
