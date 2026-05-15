import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBadge } from "@/components/score-badge";
import { StatusBadge } from "@/components/status-badge";
import { ConfidenceMeter } from "@/components/confidence-meter";

export interface DealRibbonItem {
  listingId: string;
  businessName: string;
  score: number | null;
  confidence: number;
  status: string;
  industry?: string;
}

export interface DealRibbonProps {
  deals: DealRibbonItem[];
  emptyMessage?: string;
}

export function DealRibbon({ deals, emptyMessage }: DealRibbonProps) {
  if (deals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {emptyMessage ?? "No active deals to show."}
      </p>
    );
  }
  return (
    <ScrollArea>
      <ul role="list" className="flex gap-3 pb-2">
        {deals.map((d) => (
          <li key={d.listingId} className="shrink-0 w-72">
            <Link
              href={`/deals/${d.listingId}`}
              className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {d.listingId}
                    </span>
                    <ScoreBadge score={d.score} size="sm" />
                  </div>
                  <p className="line-clamp-2 text-sm font-medium">
                    {d.businessName}
                  </p>
                  {d.industry && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {d.industry}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={d.status} />
                    <ConfidenceMeter value={d.confidence} size="sm" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
