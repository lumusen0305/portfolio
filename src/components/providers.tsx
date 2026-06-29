"use client";

/**
 * Client-side providers for language + theme.
 *
 * Both preferences persist to localStorage. To avoid a flash of the wrong
 * theme/lang before hydration, an inline script in `layout.tsx` sets
 * `data-theme` and `lang` on <html> during HTML parsing (before paint).
 * Here we read the SAME storage keys with lazy initializers so React's first
 * client render matches what that script already put in the DOM.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dict, type Dict, type Lang } from "@/lib/i18n";

export const THEME_KEY = "portfolio-theme";
export const LANG_KEY = "portfolio-lang";

type Theme = "light" | "dark";

type AppContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: Dict;
  theme: Theme;
  toggleTheme: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = window.localStorage.getItem(THEME_KEY);
  if (v === "light" || v === "dark") return v;
  // Fall back to OS preference.
  return window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function Providers({ children }: { children: React.ReactNode }) {
  // English-only site — language is fixed to "en" (no toggle).
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  // Reflect lang to <html lang> + persist.
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch {}
  }, [lang]);

  // Reflect theme to <html data-theme> + persist.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((l) => (l === "zh" ? "en" : "zh")),
    []
  );
  const toggleTheme = useCallback(
    () => setTheme((th) => (th === "dark" ? "light" : "dark")),
    []
  );

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: dict[lang],
      theme,
      toggleTheme,
    }),
    [lang, setLang, toggleLang, theme, toggleTheme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <Providers>");
  return ctx;
}

/** Convenience hook: returns the active dictionary + lang. */
export function useLang() {
  const { lang, t, setLang, toggleLang } = useApp();
  return { lang, t, setLang, toggleLang };
}

/** Respects prefers-reduced-motion (re-evaluates on change). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
