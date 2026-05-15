"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReadingMode } from "@/components/providers/reading-mode";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Cover" },
  { href: "/thesis", label: "Thesis" },
  { href: "/findings", label: "Findings" },
  { href: "/deals/l002", label: "Negotiable" },
  { href: "/deals/l003", label: "Future" },
  { href: "/deals/l004", label: "Flagged" },
  { href: "/comparison", label: "Compare" },
  { href: "/next-steps", label: "Next" },
  { href: "/system", label: "System" },
  { href: "/appendix", label: "Appendix" },
];

export function Nav() {
  const pathname = usePathname();
  const { mode, toggle } = useReadingMode();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70 no-print">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-gilt focus:px-3 focus:py-1.5 focus:text-ink"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-4 px-5">
        <Link
          href="/"
          className="font-serif text-base tracking-tight text-fg"
          aria-label="Dossier — back to cover"
        >
          <span className="text-gilt">·</span> Dossier
        </Link>
        <nav aria-label="Primary" className="ml-1 hidden flex-1 items-center gap-0.5 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-sm px-2.5 py-1.5 text-[0.78rem] uppercase tracking-[0.12em] transition-colors",
                  active
                    ? "text-gilt"
                    : "text-fg-quiet hover:text-fg"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={mode === "light"}
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} reading mode`}
            className="rounded-sm border border-rule px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.14em] text-fg-muted hover:text-fg hover:border-gilt/60"
          >
            {mode === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
