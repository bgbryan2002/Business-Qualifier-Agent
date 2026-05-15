import type { Metadata } from "next";
import { fraunces, interTight, jetbrainsMono } from "./fonts";
import "./globals.css";
import { ReadingModeProvider } from "@/components/providers/reading-mode";
import { ReducedMotionProvider } from "@/components/providers/reduced-motion";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Dossier — Buyer 001",
  description:
    "A designed dossier of three findings — one negotiable, one future-target, one flagged. Prepared for Buyer 001.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <ReducedMotionProvider>
          <ReadingModeProvider>
            <Nav />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <footer className="mx-auto w-full max-w-[1280px] border-t border-rule px-5 py-8 text-fg-quiet">
              <div className="flex flex-col items-start justify-between gap-3 text-[0.78rem] uppercase tracking-[0.14em] sm:flex-row">
                <div>
                  Dossier · Buyer&nbsp;001 · <span className="tnum">2026-05-15</span>
                </div>
                <div>Prepared by the platform. Reviewed by a human.</div>
              </div>
            </footer>
          </ReadingModeProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
