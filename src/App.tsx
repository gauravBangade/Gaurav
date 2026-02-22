import { useState, useRef } from "react";
import "./App.css";
import About from "./components/About";
import JsonFormatter from "./components/JsonFormatter";
import Education from "./components/Education";

type Card = {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
};

const CARDS: Card[] = [
  {
    id: 1,
    title: "About",
    description: "Learn more about me.",
    component: <About />,
  },
  {
    id: 2,
    title: "Education",
    description: "My education background.",
    component: <Education />,
  },
  {
    id: 3,
    title: "JSON Formatter",
    description: "Format and validate JSON.",
    component: <JsonFormatter />,
  },
];
type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export default function App() {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [startRect, setStartRect] = useState<Rect | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  /* ================= OPEN ================= */
  const openCard = (card: Card) => {
    const el = cardRefs.current[card.id];
    if (!el) return;

    const r = el.getBoundingClientRect();

    const initialRect = {
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
    };

    setStartRect(initialRect);
    setRect(initialRect);
    setActiveCard(card);

    // next frame → expand to fullscreen
    requestAnimationFrame(() => {
      setRect({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  };

  /* ================= CLOSE ================= */
  const closeCard = () => {
    if (!startRect) return;

    setIsClosing(true);

    // animate back to original card
    setRect(startRect);

    setTimeout(() => {
      setActiveCard(null);
      setRect(null);
      setIsClosing(false);
    }, 450);
  };

  /* ================= RENDER ================= */
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      {/* ================= GRID ================= */}
      {!activeCard && (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.id}
              ref={(el) => { (cardRefs.current[card.id] = el) }}
              onClick={() => openCard(card)}
              className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:scale-[1.03] hover:bg-white/10"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-white/70">{card.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* ================= EXPANDED CARD ================= */}
      {activeCard && rect && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm">
          <div
            className={`absolute bg-neutral-900 border border-white/10 shadow-2xl p-8 rounded-2xl ${isClosing ? "card-shrink" : "card-expand"
              }`}
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }}
          >
            {/* Content fades only when fully opened */}
            {!isClosing && (
              <div className="opacity-0 animate-fadeIn">
                <button
                  onClick={closeCard}
                  className="mb-6 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                >
                  ← Back
                </button>

                <h1 className="text-3xl font-bold mb-6">
                  {activeCard.title}
                </h1>

                {activeCard.component}

                <div className="mt-6 text-sm text-white/50">
                  This is the expanded page content. You can render dashboards,
                  charts, settings, or any UI here.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
