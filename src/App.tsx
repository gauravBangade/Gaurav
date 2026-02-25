import { useState, useRef, useEffect } from "react";
import "./App.css";
import About from "./components/About";
import JsonFormatter from "./components/JsonFormatter";
import Education from "./components/Education";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

type Card = {
  id: number;
  title: string;
  description: string;
  path: string;
  component: React.ReactNode;
};

const CARDS: Card[] = [
  {
    id: 1,
    title: "About",
    description: "Learn more about me.",
    path: "/about",
    component: <About />,
  },
  {
    id: 2,
    title: "Education",
    description: "My education background.",
    path: "/education",
    component: <Education />,
  },
  {
    id: 3,
    title: "JSON Formatter",
    description: "Format and validate JSON.",
    path: "/json-formatter",
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
  const navigate = useNavigate();
  const location = useLocation();

  /* animation state */
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [startRect, setStartRect] = useState<Rect | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  /* sync route → card */
  useEffect(() => {
    const card = CARDS.find((c) => c.path === location.pathname);

    if (!card) return;

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

  /* open */
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

    /* navigate AFTER animation starts */
    setTimeout(() => {
      navigate(card.path);
    }, 10);
  };

  /* close */
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

      {/* HOME VIEW */}
      <div
        className={`
        transition-opacity duration-300
        ${activeCard ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      >
        {/* HEADER */}
        <header className="px-5 sm:px-6 md:px-8 pt-8 pb-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Gaurav
          </h1>

          <p className="text-white/70 text-sm sm:text-base">
            Me and the things I’ve built.
          </p>
        </header>

        {/* GRID */}
        <div className="px-5 sm:px-6 md:px-8 pb-10">
          <div className="
          mx-auto
          grid
          max-w-5xl
          grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
        ">
            {CARDS.map((card) => (
              <div
                key={card.id}
                ref={(el) => { cardRefs.current[card.id] = el }}
                onClick={() => openCard(card)}
                className="
                cursor-pointer
                rounded-2xl
                border border-white/10
                bg-white/5
                p-5 sm:p-6
                backdrop-blur-md
                transition
                hover:scale-[1.02]
                hover:bg-white/10
              "
              >
                <h2 className="text-lg sm:text-xl font-semibold">
                  {card.title}
                </h2>

                <p className="mt-2 text-sm text-white/70">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* EXPANDED CARD */}
      {activeCard && rect && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm">

          <div
            className={`
            absolute
            bg-neutral-900
            border border-white/10
            shadow-2xl
            rounded-none sm:rounded-2xl
            flex flex-col
            overflow-hidden
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
                className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide px-5 sm:px-8 md:px-12 py-6 min-w-0">
                {/* HEADER AS BACK */}
                <div
                  onClick={closeCard}
                  className="cursor-pointer text-center"
                >
                  <h1 className="text-xl sm:text-2xl font-semibold hover:opacity-80 transition">
                    Gaurav
                  </h1>

                  <p className="text-xs sm:text-sm text-white/50">
                    Me and the things I’ve built.
                  </p>
                </div>

                {/* CARD CONTENT */}
                <div className="w-full min-w-0">
                  {activeCard.component}
                </div>

              </div>
            )}

          </div>

        </div>
      )}


      {/* ROUTES */}
      <Routes>
        {CARDS.map((card) => (
          <Route key={card.id} path={card.path} element={<></>} />
        ))}
        <Route path="/" element={<></>} />
      </Routes>

    </main>
  );
}