"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ConfidenceMeter } from "@/components/confidence-meter";
import type { DueDiligenceClaim } from "@/lib/vault";

interface Props {
  claims: DueDiligenceClaim[];
}

function groupByCategory(claims: DueDiligenceClaim[]) {
  const map = new Map<string, DueDiligenceClaim[]>();
  for (const c of claims) {
    const list = map.get(c.category) ?? [];
    list.push(c);
    map.set(c.category, list);
  }
  return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
}

function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function DiligenceClaimsList({ claims }: Props) {
  if (claims.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No diligence claims recorded. Diligence pending.
      </p>
    );
  }
  const groups = groupByCategory(claims);
  const defaultOpen = groups.slice(0, 2).map(([cat]) => cat);
  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
      {groups.map(([cat, items]) => (
        <AccordionItem key={cat} value={cat}>
          <AccordionTrigger>
            <span className="flex flex-1 items-center justify-between gap-2 pr-4">
              <span>
                <span className="font-semibold capitalize">
                  {cat.replace(/-/g, " ")}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {items.length} claim{items.length === 1 ? "" : "s"}
                </span>
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-3">
              {items.map((c, i) => (
                <li
                  key={`${cat}-${i}`}
                  className="rounded-md border border-border bg-muted/30 p-3"
                >
                  <p className="text-sm">{c.claim}</p>
                  {c.note && (
                    <p className="mt-1 text-xs italic text-muted-foreground">
                      {c.note}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {c.source_url && (
                      <a
                        href={c.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Source: ${domain(c.source_url)} (opens in new tab)`}
                        className="text-xs font-medium text-primary underline underline-offset-2 hover:no-underline"
                      >
                        {domain(c.source_url)}
                      </a>
                    )}
                    <Badge variant="muted" className="tnum">
                      retrieved {c.retrieved_at?.slice(0, 10) || "—"}
                    </Badge>
                    <ConfidenceMeter value={c.confidence} size="sm" />
                  </div>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
