import TypeBadge from "../../pokemon/TypeBadge";
import type { Domain } from "../../data/site";
import type { PokemonType } from "../../data/party";

/** Each work domain borrows a Pokémon type's colour. */
const DOMAIN_BADGES: Record<Domain, { type: PokemonType; label: string }> = {
  frontend: { type: "electric", label: "Frontend" },
  backend: { type: "steel", label: "Backend" },
  architecture: { type: "dragon", label: "Architecture" },
  realtime: { type: "flying", label: "Real-time" },
  data: { type: "psychic", label: "Data & charts" },
  security: { type: "dark", label: "Security" },
  design: { type: "fairy", label: "Design" },
};

export function DomainBadges({ domains }: { domains: Domain[] }) {
  return (
    // A span so it can sit inside a tile's <button>.
    <span className="flex flex-wrap gap-1.5">
      {domains.map((domain) => (
        <TypeBadge key={domain} type={DOMAIN_BADGES[domain].type} label={DOMAIN_BADGES[domain].label} />
      ))}
    </span>
  );
}
