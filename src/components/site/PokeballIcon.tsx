type PokeballIconProps = {
  className?: string;
};

/** A Poké Ball outline that follows currentColor, with a red top half. */
export default function PokeballIcon({ className = "h-3 w-3" }: PokeballIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M2 12a10 10 0 0 1 20 0z" fill="#e3350d" />
      <path d="M2 12a10 10 0 0 0 20 0z" fill="#fff" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.2" fill="#fff" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
