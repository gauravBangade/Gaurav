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
  image: string;
  logo: string;
  cardClassName: string;
  imageWrapClassName: string;
  overlayClassName: string;
  titleClassName: string;
};

const CARDS: Card[] = [
  {
    id: 1,
    title: "About",
    description: "Learn more about me.",
    path: "/about",
    component: <About />,
    label: "Profile",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Profile_Icon.png",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/GitHub_Mark.png",
    cardClassName:
      "border-sky-300/30 bg-[#08101b] shadow-sky-500/20 hover:border-sky-200/40",
    imageWrapClassName: "border-sky-300/20 bg-sky-950/40",
    overlayClassName: "from-sky-400/10 via-blue-900/35 to-slate-950/80",
    titleClassName: "text-cyan-100",
  },
  {
    id: 2,
    title: "Education",
    description: "My education background.",
    path: "/education",
    component: <Education />,
    label: "Journey",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Graduation-cap-g6c3c0e4d0_1920.jpg",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Graduation_cap.png",
    cardClassName:
      "border-amber-300/35 bg-[#1a1204] shadow-amber-500/20 hover:border-amber-200/45",
    imageWrapClassName: "border-amber-300/25 bg-amber-950/45",
    overlayClassName: "from-yellow-300/15 via-orange-900/40 to-zinc-950/80",
    titleClassName: "text-amber-100",
  },
  {
    id: 3,
    title: "JSON Toolkit",
    description: "Format, validate, and visualize JSON in one workspace.",
    path: "/json-toolkit",
    component: <JsonToolkit />,
    label: "Toolkit",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Colorful_Chart_Icon_vol2.png",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Network_icon_from_Noun_Project.png",
    cardClassName:
      "border-violet-300/35 bg-[#110b1a] shadow-violet-500/20 hover:border-violet-200/40",
    imageWrapClassName: "border-violet-300/25 bg-violet-950/45",
    overlayClassName: "from-fuchsia-300/10 via-violet-900/45 to-slate-950/80",
    titleClassName: "text-fuchsia-100",
  },
];

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [startRect, setStartRect] = useState<Rect | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const isFullscreenCardActive = activeCard?.path === "/json-toolkit";

  useEffect(() => {
    const card = CARDS.find((c) => c.path === location.pathname);

    if (!card) {
      if (activeCard && startRect) {
        setIsClosing(true);
        setRect(startRect);

        const timer = window.setTimeout(() => {
          setActiveCard(null);
          setRect(null);
          setStartRect(null);
          setIsClosing(false);
        }, 450);

        return () => window.clearTimeout(timer);
      }

      setActiveCard(null);
      setRect(null);
      setStartRect(null);
      setIsClosing(false);
      return;
    }

    const el = cardRefs.current[card.id];

    if (!el) {
      requestAnimationFrame(() => {
        setActiveCard(card);
        setRect({
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        });
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

    requestAnimationFrame(() => {
      setRect({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
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

    requestAnimationFrame(() => {
      setRect({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    setTimeout(() => {
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

    setTimeout(() => {
      setActiveCard(null);
      setRect(null);
      setIsClosing(false);
      navigate("/");
    }, 450);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div
        className={`
        transition-opacity duration-300
        ${activeCard ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      >
        <header className="px-5 pb-4 pt-8 text-center sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold sm:text-3xl">Gaurav</h1>

          <p className="text-sm text-white/70 sm:text-base">Me and the things I’ve built.</p>
        </header>

        <div className="px-5 pb-10 sm:px-6 md:px-8">
          <div
            className="
          mx-auto
          grid
          max-w-5xl
          grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
        "
          >
            {CARDS.map((card) => (
              <div
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
                rounded-2xl
                border
                p-5 sm:p-6
                backdrop-blur-md
                transition
                hover:scale-[1.02]
                hover:-translate-y-0.5
                shadow-xl
                ${card.cardClassName}
              `}
              >
                <div className={`relative overflow-hidden rounded-xl border ${card.imageWrapClassName}`}>
                  <img
                    src={card.image}
                    alt={`${card.title} theme`}
                    className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-tr ${card.overlayClassName}`} />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full border border-white/25 bg-black/35 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">
                      {card.label}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-lg border border-white/35 bg-white/90 p-2 shadow-lg">
                    <img src={card.logo} alt={`${card.title} logo`} className="h-6 w-6 object-contain" />
                  </div>
                </div>

                <h2 className={`relative z-10 mt-4 text-lg font-semibold sm:text-xl ${card.titleClassName}`}>{card.title}</h2>

                <p className="relative z-10 mt-2 text-sm text-white/75">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeCard && rect && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm">
          <div
            className={`
            absolute
            flex flex-col
            overflow-hidden
            rounded-none
            border border-white/10
            bg-neutral-900
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
                    <div onClick={closeCard} className="cursor-pointer text-center">
                      <h1 className="text-xl font-semibold transition hover:opacity-80 sm:text-2xl">Gaurav</h1>

                      <p className="text-xs text-white/50 sm:text-sm">Me and the things I’ve built.</p>
                    </div>

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
