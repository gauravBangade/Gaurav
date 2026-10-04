import type { PokemonType } from "../data/party";

/** Canonical type colours, with a text colour that keeps contrast on each. */
const TYPE_COLORS: Record<PokemonType, { bg: string; fg: string }> = {
  normal: { bg: "#A8A77A", fg: "#1b1b1b" },
  fire: { bg: "#EE8130", fg: "#1b1b1b" },
  water: { bg: "#6390F0", fg: "#0f1a33" },
  electric: { bg: "#F7D02C", fg: "#1b1b1b" },
  grass: { bg: "#7AC74C", fg: "#1b1b1b" },
  poison: { bg: "#A33EA1", fg: "#ffffff" },
  ground: { bg: "#E2BF65", fg: "#1b1b1b" },
  flying: { bg: "#A98FF3", fg: "#1b1b1b" },
  psychic: { bg: "#F95587", fg: "#1b1b1b" },
  rock: { bg: "#B6A136", fg: "#1b1b1b" },
  ghost: { bg: "#735797", fg: "#ffffff" },
  dragon: { bg: "#6F35FC", fg: "#ffffff" },
  dark: { bg: "#705746", fg: "#ffffff" },
  steel: { bg: "#B7B7CE", fg: "#1b1b1b" },
  fairy: { bg: "#D685AD", fg: "#1b1b1b" },
};

type TypeBadgeProps = {
  type: PokemonType;
  /** Text to show instead of the type name (e.g. a work domain painted in a type's colour). */
  label?: string;
};

/** A Game Boy–style type tag: pixel font, uppercase, solid fill. */
export default function TypeBadge({ type, label }: TypeBadgeProps) {
  const { bg, fg } = TYPE_COLORS[type];
  return (
    <span
      className="inline-flex items-center rounded-[4px] px-1.5 py-[3px] font-pixel text-[7px] uppercase leading-none tracking-wider shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
      style={{ backgroundColor: bg, color: fg }}
    >
      {label ?? type}
    </span>
  );
}
