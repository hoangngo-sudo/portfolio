"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import config from "@/config/portfolio.config";
import type { ThemeColors } from "@/types/config";

type ThemeName = "black" | "teal";

interface ThemeContextValue {
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "portfolio-theme";

function applyThemeToDOM(colors: ThemeColors) {
  const s = document.documentElement.style;
  s.setProperty("--accent", colors.accent);
  s.setProperty("--accent-light", colors.accentLight);
  s.setProperty("--accent-pale", colors.accentPale);
  s.setProperty("--dark-bg", colors.darkBg);
  s.setProperty("--dark-bg-alt", colors.darkBgAlt);
  s.setProperty("--light-bg", colors.lightBg);
  s.setProperty("--light-bg-alt", colors.lightBgAlt);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Must match SSR: server has no localStorage, so always start with the
  // default theme. The useEffect below corrects the state after hydration.
  // Reading localStorage here (even behind typeof window guard) causes a
  // hydration mismatch because the server rendered the default theme.
  const [theme, setThemeState] = useState<ThemeName>(config.themes.default);

  // No cookies/localStorage on the server, so the lazy initializer returns the
  // default. After hydration, correct the state to match what localStorage
  // actually holds. Do NOT call applyThemeToDOM here: <ThemeScript> in
  // layout.tsx already applied the right CSS variables before first paint,
  // so touching the DOM would cause a redundant (and potentially flashy) write.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    const resolved: ThemeName =
      stored === "black" || stored === "teal" ? stored : config.themes.default;
    // Defer to avoid the synchronous-setState-in-effect lint warning while
    // still correcting the state in the same microtask flush as the first paint.
    const raf = requestAnimationFrame(() => setThemeState(resolved));
    return () => cancelAnimationFrame(raf);
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyThemeToDOM(config.themes[next]);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, colors: config.themes[theme], setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
