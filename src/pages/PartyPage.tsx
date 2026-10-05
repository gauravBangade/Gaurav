import PsychicText from "../components/PsychicText";
import PartyScreen from "../components/site/PartyScreen";
import { PageHeader } from "../components/site/Section";
import { useSite } from "../components/site/siteContext";
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

      <PartyScreen confusion={confusion} allShiny={allShiny} className="mt-10" />

      <ul className="mt-8 space-y-2 text-sm text-ink/55">
        {NOTES.map((note) => (
          <li key={note} className="relative pl-4">
            <span aria-hidden="true" className="absolute left-0 top-[0.6em] h-1 w-1 rounded-full bg-ink/30" />
            <PsychicText split="words" text={note} />
          </li>
        ))}
      </ul>
    </>
  );
}
