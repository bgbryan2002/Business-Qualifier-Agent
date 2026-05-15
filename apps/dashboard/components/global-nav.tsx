"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Home, Users, FileText, FolderSearch, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/buyers/buyer-001", label: "Buyer", icon: Users },
  { href: "/deals", label: "Deals", icon: FileText },
  { href: "/skills", label: "Skills", icon: FolderSearch },
  { href: "/memos/L004-memo", label: "Memos", icon: BookOpen },
];

export function GlobalNav() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/memos")) return pathname.startsWith("/memos");
    if (href.startsWith("/buyers")) return pathname.startsWith("/buyers");
    return pathname.startsWith(href);
  };
  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 no-print"
      role="banner"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-primary"
            aria-hidden
          />
          <span>BQA Dashboard</span>
        </Link>
        <nav
          aria-label="Primary"
          className="ml-6 flex items-center gap-1"
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Portfolio app (opens in new tab)"
          >
            <span>Portfolio</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}
