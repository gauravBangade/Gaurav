import { useState, useRef, useEffect } from "react";
import "./App.css";
import About from "./components/About";
import Education from "./components/Education";
import JsonToolkit from "./components/JsonToolkit";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

type Card = {
  id: number;
  title: string;
  description: string;
  path: string;
  component: React.ReactNode;
  label: string;
  logo: string;
};

const CARDS: Card[] = [
  {
    id: 1,
    title: "About",
    description: "Learn more about me.",
    path: "/about",
    component: <About />,
    label: "Profile",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/GitHub_Mark.png",
  },
  {
    id: 2,
    title: "Education",
    description: "My education background.",
    path: "/education",
    component: <Education />,
    label: "Journey",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Graduation_cap.png",
  },
  {
    id: 3,
    title: "JSON Toolkit",
    description: "Format, validate, and visualize JSON in one workspace.",
    path: "/json-toolkit",
    component: <JsonToolkit />,
    label: "Toolkit",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Network_icon_from_Noun_Project.png",
  },
];

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
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
} as const;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [startRect, setStartRect] = useState<Rect | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const activeCardRef = useRef<Card | null>(null);
  const startRectRef = useRef<Rect | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const navigateTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isFullscreenCardActive = activeCard?.path === "/json-toolkit";

  const getAccent = (card: Card) => {
    if (card.path === "/education") return CARD_ACCENTS.education;
    if (card.path === "/json-toolkit") return CARD_ACCENTS.toolkit;
    return CARD_ACCENTS.about;
  };

  const renderCardPreview = (card: Card) => {
    const accent = getAccent(card);

    return (
      <>
        <div className="flex items-center justify-between gap-3">
          <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${accent.text}`}>
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
          <img src={card.logo} alt={`${card.title} logo`} className="h-4 w-4 object-contain opacity-70" />
        </div>
      </>
    );
  };

  useEffect(() => {
    activeCardRef.current = activeCard;
  }, [activeCard]);

  useEffect(() => {
    startRectRef.current = startRect;
  }, [startRect]);

  useEffect(() => {
    return () => {
      if (openFrameRef.current !== null) {
        window.cancelAnimationFrame(openFrameRef.current);
      }
      if (navigateTimerRef.current !== null) {
        window.clearTimeout(navigateTimerRef.current);
      }
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const card = CARDS.find((c) => c.path === location.pathname);
    let frameId = 0;
    let nestedFrameId = 0;

    if (!card) {
      if (activeCardRef.current && startRectRef.current) {
        const closingRect = startRectRef.current;

        frameId = window.requestAnimationFrame(() => {
          setIsClosing(true);
          setRect(closingRect);
        });

        const timer = window.setTimeout(() => {
          setActiveCard(null);
          setRect(null);
          setStartRect(null);
          setIsClosing(false);
        }, 450);

        return () => {
          window.cancelAnimationFrame(frameId);
          window.clearTimeout(timer);
        };
      }

      frameId = window.requestAnimationFrame(() => {
        setActiveCard(null);
        setRect(null);
        setStartRect(null);
        setIsClosing(false);
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    frameId = window.requestAnimationFrame(() => {
      const el = cardRefs.current[card.id];

      if (!el) {
        setActiveCard(card);
        setRect({
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        });
        return;
      }

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

      nestedFrameId = window.requestAnimationFrame(() => {
        setRect({
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(nestedFrameId);
    };
  }, [location.pathname]);

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

    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current);
    }
    if (navigateTimerRef.current !== null) {
      window.clearTimeout(navigateTimerRef.current);
    }

    openFrameRef.current = requestAnimationFrame(() => {
      setRect({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    navigateTimerRef.current = window.setTimeout(() => {
      navigate(card.path);
    }, 10);
  };

  const closeCard = () => {
    if (!startRect) {
      navigate("/");
      return;
    }

    setIsClosing(true);
    setRect(startRect);

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setActiveCard(null);
      setRect(null);
      setIsClosing(false);
      navigate("/");
    }, 450);
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#151515] transition-colors duration-300">
      <div
        className={`
        transition-opacity duration-300
        ${activeCard ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
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
            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {CARDS.map((card) => (
                <button
                  type="button"
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[card.id] = el;
                  }}
                  onClick={() => openCard(card)}
                  className={`
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
              `}
                >
                  {renderCardPreview(card)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeCard && rect && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm">
          <div
            className={`
            absolute
            flex flex-col
            overflow-hidden
            rounded-none
            border border-black/10
            bg-[#fcfbf8]
            shadow-2xl
            sm:rounded-2xl
            ${isClosing ? "card-shrink" : "card-expand"}
          `}
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              maxWidth: "100vw",
              maxHeight: "100vh",
            }}
          >
            {!isClosing && (
              <div
                className={
                  isFullscreenCardActive
                    ? "h-full min-w-0 overflow-hidden"
                    : "scrollbar-hide h-full min-w-0 overflow-x-hidden overflow-y-auto px-5 py-6 sm:px-8 md:px-12"
                }
              >
                {isFullscreenCardActive ? (
                  <div className="h-full w-full">{activeCard.component}</div>
                ) : (
                  <>
                    <button type="button" onClick={closeCard} className="mx-auto block cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#466a52]">
                      <h1 className="text-xl font-semibold transition hover:opacity-80 sm:text-2xl">Gaurav</h1>

                      <p className="text-xs text-black/45 sm:text-sm">Me and the things I’ve built.</p>
                    </button>

                    <div className="w-full min-w-0">{activeCard.component}</div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Routes>
        {CARDS.map((card) => (
          <Route key={card.id} path={card.path} element={<></>} />
        ))}
        <Route path="/json-formatter" element={<Navigate to="/json-toolkit" replace />} />
        <Route path="/json-graph" element={<Navigate to="/json-toolkit" replace />} />
        <Route path="/" element={<></>} />
      </Routes>
    </main>
  );
}
