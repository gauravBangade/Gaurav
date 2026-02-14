import { useEffect, useRef, useState } from 'react';

/* ── Floating dust / light-speck particles ── */
type Particle = {
  id: number;
  left: number;    // % position
  size: number;    // px
  delay: number;   // s
  duration: number; // s
  opacity: number;
};

const PARTICLES: Particle[] = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 1.5 + Math.random() * 3,
  delay: Math.random() * 12,
  duration: 8 + Math.random() * 10,
  opacity: 0.15 + Math.random() * 0.35,
}));

/* ── Soft ambient orbs for background glow ── */
const ORBS = [
  { x: '18%', y: '25%', w: 320, color: 'rgba(56, 130, 200, 0.12)', blur: 100, dur: 7 },
  { x: '72%', y: '60%', w: 260, color: 'rgba(100, 180, 255, 0.09)', blur: 90, dur: 9 },
  { x: '50%', y: '80%', w: 200, color: 'rgba(140, 170, 230, 0.08)', blur: 80, dur: 11 },
];

type Position = { x: number; y: number };

function App() {
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const [isYesHovered, setIsYesHovered] = useState(false);
  const [noPos, setNoPos] = useState<Position | null>(null);

  /* ── Position the NO button on mount & resize ── */
  useEffect(() => {
    const setInitialNoPosition = () => {
      const bw = noButtonRef.current?.offsetWidth ?? 100;
      const bh = noButtonRef.current?.offsetHeight ?? 48;
      const x = Math.min(window.innerWidth - bw - 20, window.innerWidth / 2 + 100);
      const y = Math.min(window.innerHeight - bh - 20, window.innerHeight / 2 + 50);
      setNoPos({ x: Math.max(20, x), y: Math.max(20, y) });
    };

    setInitialNoPosition();

    const onResize = () => {
      const bw = noButtonRef.current?.offsetWidth ?? 100;
      const bh = noButtonRef.current?.offsetHeight ?? 48;
      setNoPos((prev) => {
        if (!prev) return prev;
        return {
          x: Math.min(Math.max(20, prev.x), window.innerWidth - bw - 20),
          y: Math.min(Math.max(20, prev.y), window.innerHeight - bh - 20),
        };
      });
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const moveNoButton = () => {
    const bw = noButtonRef.current?.offsetWidth ?? 100;
    const bh = noButtonRef.current?.offsetHeight ?? 48;
    const pad = 20;
    const maxX = Math.max(pad, window.innerWidth - bw - pad);
    const maxY = Math.max(pad, window.innerHeight - bh - pad);
    setNoPos({
      x: Math.random() * (maxX - pad) + pad,
      y: Math.random() * (maxY - pad) + pad,
    });
    setYesScale((prev) => Math.min(prev + 0.07, 1.6));
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ══════════ BACKGROUND LAYERS ══════════ */}

      {/* Deep air-force gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#162040]" />

      {/* Secondary diagonal gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a30]/80 via-transparent to-[#1a2845]/60" />

      {/* Faint horizon / sky glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#1c3050]/40 via-[#152540]/20 to-transparent" />

      {/* Soft ambient glow orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-soft-glow pointer-events-none"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.w,
            height: orb.w,
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            animationDuration: `${orb.dur}s`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}

      {/* ══════════ MH-60R HELICOPTER SILHOUETTE ══════════ */}
      <div className="absolute inset-0 pointer-events-none flex items-start pt-20 sm:pt-0 sm:items-end justify-center overflow-hidden">
        <div
          className="relative w-full max-w-3xl opacity-[0.15] animate-fade-in-slow"
          style={{
            maskImage: 'linear-gradient(to top, transparent 0%, black 30%, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 30%, black 70%, transparent 100%)',
            filter: 'blur(1px) brightness(0.7)',
            transform: 'translateY(12%) scale(1.1)',
          }}
        >
          <img
            src="/mh60r.png"
            alt=""
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* Vignette overlay */}
      <div className="vignette absolute inset-0 pointer-events-none" />

      {/* ══════════ FLOATING PARTICLES ══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full animate-float-up"
            style={{
              left: `${p.left}%`,
              bottom: '-4%',
              width: p.size,
              height: p.size,
              background: `rgba(180, 210, 255, ${p.opacity})`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              boxShadow: `0 0 ${p.size * 2}px rgba(160, 200, 255, ${p.opacity * 0.5})`,
            }}
          />
        ))}
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div
          className="
            relative w-full max-w-lg p-8 sm:p-12 text-center
            rounded-[28px]
            border border-white/25
            shadow-[0_10px_60px_rgba(0,0,0,0.45)]
            backdrop-blur-[22px]
            backdrop-saturate-[180%]
            bg-white/[0.06]
            overflow-hidden
            animate-fade-in
          "
        >
          {/* Liquid glass refraction gradient */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px]
            bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0.10)_100%)]
          " />

          {/* Moving light streak (glass shine) */}
          <div className="pointer-events-none absolute -inset-[2px] rounded-[28px] overflow-hidden">
            <div className="absolute top-0 left-[-120%] h-full w-[60%]
              bg-[linear-gradient(75deg,transparent,rgba(255,255,255,0.35),transparent)]
              opacity-40 blur-[6px]
              animate-glass-shine
            " />
          </div>

          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-8px_24px_rgba(255,255,255,0.06)]
          " />

          {/* Fine glass noise texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay
            bg-[url('https://grainy-gradients.vercel.app/noise.svg')]
          " />

          {!accepted ? (
            /* ── PROPOSAL STATE ── */
            <>
              {/* Decorative wings icon */}
              <div className="mb-6 flex justify-center">
                <svg
                  className="w-10 h-10 text-sky-400/60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19c-1 0-6-3.5-6-8a4 4 0 0 1 6-3.46A4 4 0 0 1 18 11c0 4.5-5 8-6 8Z" />
                  <path d="M12 19v3" />
                </svg>
              </div>

              <h1
                className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
                style={{
                  textShadow: '0 0 30px rgba(148, 200, 255, 0.25), 0 0 60px rgba(148, 200, 255, 0.08)',
                }}
              >
                Will you be my Valentine?
              </h1>

              <p className="mt-2 text-sm font-light tracking-wide text-sky-300/70 sm:text-base">
                Choose your flight path, co-pilot ✈
              </p>

              {/* Thin accent line */}
              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />

              {/* YES button */}
              <div className="mt-8 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setAccepted(true)}
                  onMouseEnter={() => setIsYesHovered(true)}
                  onMouseLeave={() => setIsYesHovered(false)}
                  className="relative rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-10 py-3.5 text-lg font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:shadow-sky-400/40 hover:shadow-xl active:scale-95 cursor-pointer"
                  style={{
                    transform: `scale(${yesScale * (isYesHovered ? 1.06 : 1)})`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  {/* Glow ring behind button */}
                  <span className="absolute inset-0 -z-10 rounded-full bg-sky-400/20 blur-md" />
                  ROGER THAT
                </button>
              </div>
            </>
          ) : (
            /* ── ACCEPTED STATE ── */
            <div className="animate-fade-in space-y-5">
              {/* Success icon */}
              <div className="flex justify-center">
                <span
                  className="inline-block text-5xl"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(148, 200, 255, 0.5))' }}
                >
                  ❤️
                </span>
              </div>

              <h2
                className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
                style={{
                  textShadow: '0 0 30px rgba(148, 200, 255, 0.3), 0 0 60px rgba(148, 200, 255, 0.1)',
                }}
              >
                Mission Accepted
              </h2>

              <p className="text-sky-300/80 font-light tracking-wide">
                Copy that, Valentine 💙
              </p>

              {/* Accent line */}
              <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />

              <p className="text-sm text-slate-400/70 font-light">
                Cleared for takeoff. Together, always. ✈
              </p>

              {/* Subtle animated dots */}
              <div className="flex justify-center gap-3 pt-2">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400/50 animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400/50 animate-pulse" style={{ animationDelay: '300ms' }} />
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400/50 animate-pulse" style={{ animationDelay: '600ms' }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ NO BUTTON (runs away) ══════════ */}
      {!accepted && noPos && (
        <button
          ref={noButtonRef}
          type="button"
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          className="fixed z-20 rounded-full border border-white/10 bg-slate-800/70 px-6 py-2.5 font-medium text-slate-400 shadow-md backdrop-blur-sm transition-all duration-300 hover:text-slate-300 active:scale-95 cursor-pointer"
          style={{
            left: `${noPos.x}px`,
            top: `${noPos.y}px`,
            transition: 'left 0.35s ease-out, top 0.35s ease-out',
          }}
        >
          NEGATIVE
        </button>
      )}
    </main>
  );
}

export default App;
