import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./components/About";
import Education from "./components/Education";
import JsonToolkit from "./components/JsonToolkit";
import MorphOverlay from "./components/MorphOverlay";
import { useCardMorph } from "./hooks/useCardMorph";

type Accent = {
  line: string;
  soft: string;
  text: string;
  border: string;
};

type Card = {
  id: number;
  title: string;
  description: string;
  path: string;
  label: string;
  logo: string;
  accent: Accent;
  /** Fullscreen sections own their whole panel (no shared header, no padding). */
  fullscreen?: boolean;
  component: ReactNode;
};

const CARD_ACCENTS = {
  about: {
    line: "bg-[#5b7c99]",
    soft: "bg-[#e2ebf2]",
    text: "text-[#39566f]",
    border: "border-[#bdd0df]",
  },
  education: {
    line: "bg-[#8d6a2f]",
    soft: "bg-[#f2ead9]",
    text: "text-[#684b16]",
    border: "border-[#decdad]",
  },
  toolkit: {
    line: "bg-[#5f6f56]",
    soft: "bg-[#e4ebdf]",
    text: "text-[#42503c]",
    border: "border-[#c8d4bf]",
  },
} as const satisfies Record<string, Accent>;

const CARDS: Card[] = [
  {
    id: 1,
    title: "About",
    description: "Learn more about me.",
    path: "/about",
    label: "Profile",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/GitHub_Mark.png",
    accent: CARD_ACCENTS.about,
    component: <About />,
  },
  {
    id: 2,
    title: "Education",
    description: "My education background.",
    path: "/education",
    label: "Journey",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Graduation_cap.png",
    accent: CARD_ACCENTS.education,
    component: <Education />,
  },
  {
    id: 3,
    title: "JSON Toolkit",
    description: "Format, validate, and visualize JSON in one workspace.",
    path: "/json-toolkit",
    label: "Toolkit",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Network_icon_from_Noun_Project.png",
    accent: CARD_ACCENTS.toolkit,
    fullscreen: true,
    component: <JsonToolkit />,
  },
];

const LEGACY_REDIRECTS: Record<string, string> = {
  "/json-formatter": "/json-toolkit",
  "/json-graph": "/json-toolkit",
};

function CardPreview({ card }: { card: Card }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${card.accent.text}`}>
          {card.label}
        </span>
        <span className="text-[11px] text-black/45">0{card.id}</span>
      </div>
      <div className="border-b border-black/10 pt-3" />
      <h2 className="mt-5 max-w-[12ch] text-[1.65rem] font-semibold leading-[1.05] sm:text-[1.8rem]">
        {card.title}
      </h2>
      <p className="mt-3 max-w-[26ch] text-sm leading-6 text-black/65">{card.description}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-black/55">
        <span>Open section</span>
        <img src={card.logo} alt="" aria-hidden="true" className="h-4 w-4 object-contain opacity-70" />
      </div>
    </>
  );
}

export default function App() {
  const { activeCard, rect, isClosing, cardRefs, openCard, closeCard } = useCardMorph(CARDS);
  const isOpen = activeCard !== null;

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#151515] transition-colors duration-300">
      <div
        inert={isOpen}
        className={`transition-opacity duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <header className="px-5 pb-4 pt-8 text-center sm:px-6 md:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5f5a52]">
            Portfolio
          </p>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Gaurav</h1>

          <p className="mt-2 text-sm text-black/60 sm:text-base">Me and the things I’ve built.</p>
        </header>

        <div className="px-5 pb-10 sm:px-6 md:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CARDS.map((card) => (
                <button
                  type="button"
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[card.id] = el;
                  }}
                  onClick={() => openCard(card)}
                  aria-haspopup="dialog"
                  className="
                    group
                    cursor-pointer
                    relative
                    isolate
                    rounded-[28px]
                    border
                    p-5 sm:p-6
                    transition
                    border-[#1a1a1a]
                    bg-[#fdfbf6]
                    shadow-none
                    hover:-translate-y-0.5
                    text-left
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#466a52]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#f8f5ef]
                  "
                >
                  <CardPreview card={card} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeCard && rect && (
        <MorphOverlay rect={rect} isClosing={isClosing} label={activeCard.title} onClose={closeCard}>
          {activeCard.fullscreen ? (
            <div className="h-full min-w-0 overflow-hidden">
              <div className="h-full w-full">{activeCard.component}</div>
            </div>
          ) : (
            <div className="scrollbar-hide h-full min-w-0 overflow-x-hidden overflow-y-auto px-5 py-6 sm:px-8 md:px-12">
              <button
                type="button"
                onClick={closeCard}
                aria-label="Back to home"
                className="mx-auto block cursor-pointer rounded-md text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#466a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]"
              >
                <h1 className="text-xl font-semibold transition hover:opacity-80 sm:text-2xl">Gaurav</h1>
                <p className="text-xs text-black/45 sm:text-sm">Me and the things I’ve built.</p>
              </button>

              <div className="w-full min-w-0">{activeCard.component}</div>
            </div>
          )}
        </MorphOverlay>
      )}

      <Routes>
        {CARDS.map((card) => (
          <Route key={card.id} path={card.path} element={null} />
        ))}
        {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="/" element={null} />
      </Routes>
    </main>
  );
}
