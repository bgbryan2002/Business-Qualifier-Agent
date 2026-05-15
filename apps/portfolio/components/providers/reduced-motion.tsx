"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ReducedMotionCtx = createContext<boolean>(false);

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefers(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return <ReducedMotionCtx.Provider value={prefers}>{children}</ReducedMotionCtx.Provider>;
}

export function usePrefersReducedMotion(): boolean {
  return useContext(ReducedMotionCtx);
}
