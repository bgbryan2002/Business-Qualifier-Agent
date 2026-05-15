import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalNav } from "@/components/global-nav";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BQA Dashboard",
  description:
    "Operational dashboard for the SMB Acquisition Intelligence Platform — buyers, deals, diligence, memos, skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider delayDuration={150}>
          <GlobalNav />
          <main
            id="main"
            tabIndex={-1}
            className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6"
          >
            {children}
          </main>
          <footer className="mx-auto w-full max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
            <p>
              Read-only operational dashboard. Edits happen via subagents or
              Obsidian. WCAG 2.2 AA target.
            </p>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
