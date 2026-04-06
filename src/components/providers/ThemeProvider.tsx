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
  const [theme, setThemeState] = useState<ThemeName>(config.themes.default);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (stored && (stored === "black" || stored === "teal")) {
      setThemeState(stored);
      applyThemeToDOM(config.themes[stored]);
    }
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
