import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const THEME_COLOR: Record<Theme, string> = { light: "#f8f5ef", dark: "#171421" };

const listeners = new Set<() => void>();

/** index.html sets data-theme before first paint, so the DOM is the source of truth. */
const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

export const toggleTheme = () => setTheme(read() === "dark" ? "light" : "dark");

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light");
}
