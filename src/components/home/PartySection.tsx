import { useEffect, useRef, useState, type CSSProperties } from "react";
import PokemonDialog from "../PokemonDialog";
import PsychicText from "../PsychicText";
import { SectionTitle } from "./Section";
import TypeBadge from "../../pokemon/TypeBadge";
import { playMove } from "../../pokemon/moves";
import { party, rollShiny, spriteSrc, type PartyMember, type PokemonId } from "../../data/party";
import { FOCUS_RING, TILE } from "./styles";

const upper = (text: string) => text.toUpperCase();

/** After recoil: a pause on the damaged bar, then a slow refill. */
const RECOIL_HOLD_MS = 1500;
const REFILL_MS = 2400;

/** Per-visit shiny rolls, made once. */
function useShinyRolls() {
  const [rolls] = useState(() =>
    Object.fromEntries(party.map((member) => [member.id, rollShiny()])) as Partial<Record<PokemonId, boolean>>,
  );
  return rolls;
}

function introLine(member: PartyMember, shiny: boolean) {
  return shiny ? `Whoa! A shiny ${upper(member.name)}! ✦` : `Go! ${upper(member.name)}!`;
}

function aftermathLine(member: PartyMember) {
  if (member.move.id === "night-shade") {
    return document.documentElement.dataset.theme === "dark" ? "The lights went out!" : "The lights came back on!";
  }
  return member.aftermath;
}

const hpColor = (hp: number) => (hp > 0.5 ? "#4cd964" : hp > 0.2 ? "#f7c22c" : "#e3350d");

function HpBar({ hp, refilling, className = "" }: { hp: number; refilling: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-pixel text-[6px] text-[#e3a51a]">HP</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
        <span
          className="block h-full rounded-full"
          style={{
            width: `${hp * 100}%`,
            backgroundColor: hpColor(hp),
            transition: refilling
              ? `width ${REFILL_MS}ms linear, background-color 600ms`
              : "width 600ms steps(12), background-color 300ms",
          }}
        />
      </span>
    </span>
  );
}

type PartySectionProps = {
  /** Psyduck's page-wide Confusion. */
  confusion: () => void;
  /** Konami code: every sprite goes shiny. */
  allShiny: boolean;
};

/**
 * A Game Boy party screen in a bento tile: pick a member, read its entry, use
 * its move. The battle box narrates; it's a live region so moves are announced.
 */
export default function PartySection({ confusion, allShiny }: PartySectionProps) {
  const rolls = useShinyRolls();
  const [selectedId, setSelectedId] = useState<PokemonId>(party[0].id);
  const [message, setMessage] = useState("Choose a POKéMON.");
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState<Partial<Record<PokemonId, number>>>({});
  const [refilling, setRefilling] = useState(false);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const selected = party.find((member) => member.id === selectedId)!;
  const isShiny = (id: PokemonId) => allShiny || Boolean(rolls[id]);
  const hpOf = (id: PokemonId) => hp[id] ?? 1;

  const select = (member: PartyMember) => {
    if (busy || member.id === selectedId) return;
    setSelectedId(member.id);
    setMessage(introLine(member, isShiny(member.id)));
  };

  const castMove = () => {
    if (busy) return;
    const member = selected;
    const duration = playMove(member.move.id, { sprite: spriteRef.current, confusion });
    setBusy(true);
    setMessage(`${upper(member.name)} used ${upper(member.move.name)}!`);

    later(() => {
      const line = aftermathLine(member);
      if (line) setMessage(line);

      if (!member.recoil) {
        setBusy(false);
        return;
      }
      // Recoil: knock the bar down, flicker, then refill slowly.
      setRefilling(false);
      setHp((current) => ({ ...current, [member.id]: 1 - member.recoil! }));
      spriteRef.current?.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], {
        duration: 500,
      });
      later(() => {
        setRefilling(true);
        setHp((current) => ({ ...current, [member.id]: 1 }));
        setMessage(`${upper(member.name)}’s HP slowly came back.`);
        later(() => {
          setRefilling(false);
          setBusy(false);
        }, REFILL_MS);
      }, RECOIL_HOLD_MS);
    }, duration);
  };

  return (
    <section id="party" aria-labelledby="party-title" className={`${TILE} col-span-2 space-y-3 !p-3 sm:!p-4`}>
      <div className="space-y-1.5 px-1.5 pt-1.5">
        <SectionTitle id="party-title" title="My party" />
        <p className="text-sm text-ink/65">
          <PsychicText split="words" text="The six I battle with. Pick one, then use its move." />
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-ink/80 bg-card shadow-[0_4px_0_rgb(var(--ink)/0.12)]">
        {/* Summary of the selected member */}
        <div className="flex flex-col gap-4 p-4 min-[420px]:flex-row min-[420px]:items-start">
          <div className="relative mx-auto grid h-28 w-28 shrink-0 place-items-center min-[420px]:mx-0">
            {/* Grass battle platform under the sprite */}
            <span aria-hidden="true" className="absolute bottom-2 h-5 w-24 rounded-[50%] bg-[#7ac74c]/30 ring-2 ring-[#7ac74c]/20" />
            <img
              key={selected.id}
              ref={spriteRef}
              src={spriteSrc(selected.id, isShiny(selected.id))}
              alt={`${isShiny(selected.id) ? "Shiny " : ""}${selected.name}`}
              draggable="false"
              className="pixelated sprite-bob relative h-28 w-28"
            />
            {isShiny(selected.id) && (
              <span aria-hidden="true" className="absolute right-1 top-1 text-lg text-[#f7d02c] drop-shadow">
                ✦
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-pixel text-xs uppercase tracking-wide">
                <PsychicText text={selected.name} />
              </h3>
              <span className="font-pixel text-[8px] text-ink/60">Lv.50</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selected.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
            <HpBar hp={hpOf(selected.id)} refilling={refilling} className="max-w-[14rem]" />
            <p className="text-xs text-ink/55">
              <PsychicText split="words" text={`Ability: ${selected.ability}`} />
            </p>
            <p className="text-sm leading-relaxed text-ink/80">
              <PsychicText split="words" text={selected.dex} />
            </p>
            <button
              type="button"
              onClick={castMove}
              aria-disabled={busy}
              className={`mt-1 inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-ink/80 bg-paper px-4 py-2 font-pixel text-[9px] uppercase tracking-wider shadow-[0_3px_0_rgb(var(--ink)/0.8)] transition active:translate-y-[3px] active:shadow-none ${FOCUS_RING} ${
                busy ? "cursor-wait opacity-60" : "hover:bg-accent/15"
              }`}
            >
              <span aria-hidden="true">▶</span>
              Use {selected.move.name}
            </button>
          </div>
        </div>

        {/* Party slots */}
        <ul aria-label="Party" className="grid grid-cols-3 gap-1.5 border-t-2 border-ink/80 bg-paper/60 p-2 sm:grid-cols-6">
          {party.map((member, index) => {
            const current = member.id === selectedId;
            return (
              <li key={member.id}>
                <button
                  type="button"
                  onClick={() => select(member)}
                  aria-pressed={current}
                  aria-label={member.name}
                  className={`group flex w-full flex-col items-center gap-1 rounded-lg border-2 px-1 pb-1.5 pt-0.5 transition ${FOCUS_RING} ${
                    current ? "border-accent bg-accent/15" : "border-transparent hover:border-ink/20"
                  }`}
                >
                  <img
                    src={spriteSrc(member.id, isShiny(member.id))}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    style={{ "--bob-delay": `${index * -0.18}s` } as CSSProperties}
                    className={`pixelated h-12 w-12 ${current ? "sprite-bob" : "group-hover:sprite-bob"}`}
                  />
                  <span aria-hidden="true" className="font-pixel text-[6px] uppercase leading-none">
                    {member.name}
                  </span>
                  <HpBar hp={hpOf(member.id)} refilling={refilling} className="w-full max-w-[4.5rem] px-0.5" />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Battle text box */}
        <div className="border-t-2 border-ink/80 p-2.5" role="status" aria-live="polite">
          <PokemonDialog key={message} text={message} />
        </div>
      </div>

      <p className="flex items-baseline gap-2 px-1.5 pb-1 text-xs text-ink/50">
        <span className="shrink-0 whitespace-nowrap font-pixel text-[7px] uppercase tracking-wider">PC Box 1</span>
        <PsychicText split="words" text="One more Pokémon is resting in the PC. It likes to hide at the very bottom of the page." />
      </p>
    </section>
  );
}
