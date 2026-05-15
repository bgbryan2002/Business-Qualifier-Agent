import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Not found — BQA Dashboard" };

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        The route you requested does not exist in this dashboard. This often
        means the underlying vault record is missing — check Phase 1 for
        buyers, Phase 3 for listings and memos.
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href="/">← Back to overview</Link>
      </Button>
    </div>
  );
}
