import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RunLogEntry } from "@/lib/vault";

export interface RecentActivityFeedProps {
  entries: RunLogEntry[];
}

export function RecentActivityFeed({ entries }: RecentActivityFeedProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">
            No activity entries yet — RUN-LOG.md not found or empty.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-0">
        <ul
          role="feed"
          aria-busy={false}
          aria-label="Recent run log entries"
          className="divide-y"
        >
          {entries.map((entry, i) => (
            <li
              key={`${entry.date}-${entry.anchor}-${i}`}
              role="article"
              aria-posinset={i + 1}
              aria-setsize={entries.length}
              className="px-5 py-3"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <time className="text-xs font-mono tabular-nums text-muted-foreground">
                  {entry.date}
                </time>
                <span className="text-xs font-medium uppercase tracking-wide text-primary">
                  {entry.phase}
                </span>
              </div>
              <p className="mt-1 text-sm">{entry.headline}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export { Separator };
