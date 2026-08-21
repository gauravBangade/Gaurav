import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type MorphCard = {
  id: number;
  path: string;
};

type MorphState<T> = {
  card: T | null;
  /** Where the card sits in the grid — the rect we expand from and shrink back to. */
  startRect: Rect | null;
  /** Current rect of the overlay panel. */
  rect: Rect | null;
  isClosing: boolean;
};

/** Must match the transition duration in App.css (.card-expand / .card-shrink). */
export const MORPH_DURATION_MS = 450;

const IDLE: MorphState<never> = { card: null, startRect: null, rect: null, isClosing: false };

const fullscreenRect = (): Rect => ({
  top: 0,
  left: 0,
  width: window.innerWidth,
  height: window.innerHeight,
});

const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
};

/**
 * Card → fullscreen morph animation, driven by the URL.
 *
 * - Navigating to a card's path (click, deep link, or history forward) expands
 *   the overlay from that card's grid position.
 * - Leaving that path (close button, Escape, or history back) shrinks it back.
 * - When the overlay closes, focus returns to the card that opened it.
 */
export function useCardMorph<T extends MorphCard>(cards: readonly T[]) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [state, setState] = useState<MorphState<T>>(IDLE);
  const stateRef = useRef<MorphState<T>>(state);
  const cardRefs = useRef<Record<number, HTMLElement | null>>({});
  const closeTimerRef = useRef<number | null>(null);
  const lastOpenedIdRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Sync the overlay with the URL.
  useEffect(() => {
    const card = cards.find((c) => c.path === pathname);

    if (!card) {
      const { card: current, startRect } = stateRef.current;

      if (current && startRect) {
        // Left via history navigation: shrink back to the card, then clear.
        const frame = window.requestAnimationFrame(() => {
          setState((s) => ({ ...s, isClosing: true, rect: startRect }));
        });
        const timer = window.setTimeout(() => setState(IDLE), MORPH_DURATION_MS);

        return () => {
          window.cancelAnimationFrame(frame);
          window.clearTimeout(timer);
        };
      }

      const frame = window.requestAnimationFrame(() => setState(IDLE));
      return () => window.cancelAnimationFrame(frame);
    }

    let expandFrame = 0;
    const frame = window.requestAnimationFrame(() => {
      const el = cardRefs.current[card.id];

      if (!el) {
        setState({ card, startRect: null, rect: fullscreenRect(), isClosing: false });
        return;
      }

      const startRect = rectOf(el);
      setState({ card, startRect, rect: startRect, isClosing: false });

      expandFrame = window.requestAnimationFrame(() => {
        setState((s) => ({ ...s, rect: fullscreenRect() }));
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(expandFrame);
    };
  }, [pathname, cards]);

  // Return focus to the originating card once the overlay has fully closed.
  useEffect(() => {
    if (state.card) {
      lastOpenedIdRef.current = state.card.id;
      return;
    }

    const id = lastOpenedIdRef.current;
    if (id === null) return;

    lastOpenedIdRef.current = null;
    cardRefs.current[id]?.focus({ preventScroll: true });
  }, [state.card]);

  const openCard = useCallback(
    (card: T) => {
      if (stateRef.current.card) return;
      navigate(card.path);
    },
    [navigate],
  );

  const closeCard = useCallback(() => {
    const { startRect, isClosing } = stateRef.current;
    if (isClosing) return;

    if (!startRect) {
      navigate("/");
      return;
    }

    setState((s) => ({ ...s, isClosing: true, rect: startRect }));

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setState(IDLE);
      navigate("/");
    }, MORPH_DURATION_MS);
  }, [navigate]);

  return {
    activeCard: state.card,
    rect: state.rect,
    isClosing: state.isClosing,
    cardRefs,
    openCard,
    closeCard,
  };
}
