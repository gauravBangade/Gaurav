/**
 * My Pokémon party, plus one in the PC. Sprites live in /public/pokemon as
 * `<id>.png` and `<id>-shiny.png`. Dex text is my own wording.
 */

export type PokemonType =
  | "fire" | "dark" | "water" | "rock" | "ghost" | "poison" | "fairy" | "steel" | "flying" | "grass"
  | "normal" | "electric" | "psychic" | "dragon" | "ground";

export type PokemonId = "incineroar" | "psyduck" | "tyranitar" | "gengar" | "sylveon" | "skarmory" | "sinistcha";

/** Each move maps to an effect in src/pokemon/moves.ts. */
export type MoveId = "darkest-lariat" | "confusion" | "sand-stream" | "night-shade" | "fairy-wind" | "brave-bird" | "matcha-gotcha";

export type PartyMember = {
  id: PokemonId;
  name: string;
  types: PokemonType[];
  ability: string;
  move: { id: MoveId; name: string };
  dex: string;
  /** What the battle box says once the move has played out. */
  aftermath: string;
  /** Recoil moves knock this share of HP off the user's bar; it refills afterwards. */
  recoil?: number;
};

export const party: PartyMember[] = [
  {
    id: "incineroar",
    name: "Incineroar",
    types: ["fire", "dark"],
    ability: "Intimidate",
    move: { id: "darkest-lariat", name: "Darkest Lariat" },
    dex: "A heel wrestler that plays to the crowd. In doubles it walks in, Intimidates the other side and quietly makes its whole team better.",
    aftermath: "The crowd goes wild!",
  },
  {
    id: "psyduck",
    name: "Psyduck",
    types: ["water"],
    ability: "Cloud Nine",
    move: { id: "confusion", name: "Confusion" },
    dex: "Permanently confused and nursing a headache. When the pressure builds far enough, power it can’t control comes pouring out — onto this whole page.",
    aftermath: "Sorry... my head hurts. Psy!",
  },
  {
    id: "tyranitar",
    name: "Tyranitar",
    types: ["rock", "dark"],
    ability: "Sand Stream",
    move: { id: "sand-stream", name: "Sand Stream" },
    dex: "An armoured kaiju that reshapes the battlefield just by showing up. The sandstorm starts before it has thrown a single punch.",
    aftermath: "The sandstorm subsided.",
  },
  {
    id: "gengar",
    name: "Gengar",
    types: ["ghost", "poison"],
    ability: "Cursed Body",
    move: { id: "night-shade", name: "Night Shade" },
    dex: "Lives in the shadows and grins about it. Its Night Shade flips this whole site into the dark — use it again to bring the lights back.",
    aftermath: "",
  },
  {
    id: "sylveon",
    name: "Sylveon",
    types: ["fairy"],
    ability: "Pixilate",
    move: { id: "fairy-wind", name: "Fairy Wind" },
    dex: "Wraps its ribbon feelers around the people it trusts. Proof that the softest-looking member of the team can hit the hardest.",
    aftermath: "It’s super effective!",
  },
  {
    id: "skarmory",
    name: "Skarmory",
    types: ["steel", "flying"],
    ability: "Sturdy",
    move: { id: "brave-bird", name: "Brave Bird" },
    dex: "Steel-feathered and surprisingly light. It tucks its blade-sharp wings and dives at full speed, whatever the recoil.",
    aftermath: "SKARMORY is damaged by recoil!",
    recoil: 0.38,
  },
];

/** Not in the party — lives in the PC box and hides at the bottom of the page. */
export const boxed: PartyMember = {
  id: "sinistcha",
  name: "Sinistcha",
  types: ["grass", "ghost"],
  ability: "Hospitality",
  move: { id: "matcha-gotcha", name: "Matcha Gotcha" },
  dex: "A matcha ghost haunting an old tea bowl. It isn’t in the party, but it’s always brewing.",
  aftermath: "A bowl of matcha was poured. Is it the real thing...?",
};

export const pokemonById = (id: PokemonId): PartyMember =>
  id === boxed.id ? boxed : party.find((member) => member.id === id)!;

export const spriteSrc = (id: PokemonId, shiny = false) => `/pokemon/${id}${shiny ? "-shiny" : ""}.png`;

/** 1 in 64 per Pokémon per visit; `?shiny` in the URL forces every one. */
export const SHINY_ODDS = 1 / 64;

export const rollShiny = () =>
  new URLSearchParams(window.location.search).has("shiny") || Math.random() < SHINY_ODDS;
