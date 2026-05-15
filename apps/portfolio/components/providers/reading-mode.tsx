"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ReadingMode = "dark" | "light";

interface Ctx {
  mode: ReadingMode;
  toggle: () => void;
}

const ReadingModeCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "bqa-portfolio-reading-mode";

export function ReadingModeProvider({ children }: { children: React.ReactNode }) {
  // Dark-first default per PortfolioPlan §A
  const [mode, setMode] = useState<ReadingMode>("dark");

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ReadingMode | null;
      if (stored === "dark" || stored === "light") {
        setMode(stored);
      }
    } catch {
      /* noop */
    }
  }, []);

  // Apply class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "light") root.classList.add("reading-light");
    else root.classList.remove("reading-light");
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* noop */
    }
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  }, []);

  return <ReadingModeCtx.Provider value={{ mode, toggle }}>{children}</ReadingModeCtx.Provider>;
}

export function useReadingMode(): Ctx {
  const ctx = useContext(ReadingModeCtx);
  if (!ctx) throw new Error("useReadingMode must be used within ReadingModeProvider");
  return ctx;
}
