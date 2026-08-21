import { useEffect, useRef, type ReactNode } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import type { Rect } from "../hooks/useCardMorph";

type MorphOverlayProps = {
  rect: Rect;
  isClosing: boolean;
  /** Accessible name for the dialog. */
  label: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * The expanding panel that a card morphs into. Renders as a modal dialog:
 * focus is trapped inside while open and Escape closes it.
 */
export default function MorphOverlay({ rect, isClosing, label, onClose, children }: MorphOverlayProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(panelRef, !isClosing);

  useEffect(() => {
    if (isClosing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isClosing, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`
          absolute
          flex flex-col
          overflow-hidden
          rounded-none
          border border-black/10
          bg-[#fcfbf8]
          shadow-2xl
          outline-none
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
        {!isClosing && children}
      </div>
    </div>
  );
}
