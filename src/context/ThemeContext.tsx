"use client";

import type React from "react";
import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";

type ThemeContextType = {
  theme: ResolvedTheme; // Resolved theme actually active ("light" or "dark")
  themeMode: ThemeMode; // The configured preference ("light", "dark", or "auto")
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeChangeEvent = "tailadmin-theme-change";
const darkQuery = "(prefers-color-scheme: dark)";

function getThemeMode(): ThemeMode {
  const saved = localStorage.getItem("theme-mode") || localStorage.getItem("theme");
  return saved === "dark" || saved === "auto" ? saved : "light";
}

function subscribeTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(themeChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(themeChangeEvent, onChange);
  };
}

function subscribeSystemTheme(onChange: () => void) {
  const query = window.matchMedia(darkQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getServerMode = (): ThemeMode => "light";
const getSystemDark = () => window.matchMedia(darkQuery).matches;
const getServerDark = () => false;
const subscribeHydration = () => () => {};
const getClientReady = () => true;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Stable server snapshots keep hydration consistent with the initial HTML.
  const themeMode = useSyncExternalStore(subscribeTheme, getThemeMode, getServerMode);
  const systemDark = useSyncExternalStore(subscribeSystemTheme, getSystemDark, getServerDark);
  const isInitialized = useSyncExternalStore(subscribeHydration, getClientReady, getServerDark);
  const theme: ResolvedTheme = themeMode === "auto" ? (systemDark ? "dark" : "light") : themeMode;

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("theme-mode", themeMode);
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-color-scheme", theme);
  }, [theme, themeMode, isInitialized]);

  const setThemeMode = (mode: ThemeMode) => {
    localStorage.setItem("theme-mode", mode);
    window.dispatchEvent(new Event(themeChangeEvent));
  };

  const toggleTheme = () => {
    setThemeMode(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, setThemeMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
