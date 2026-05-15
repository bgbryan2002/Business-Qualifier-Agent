import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  memoId: string;
  status: string;
  isDraft: boolean;
  bodyPreview: string;
}

export function MemoPanel({ memoId, status, isDraft, bodyPreview }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <span>Memo</span>
          {isDraft && <Badge variant="warn">draft</Badge>}
          {status === "rejected" || status === "retracted" ? (
            <Badge variant="destructive">{status}</Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {bodyPreview.trim().slice(0, 320) || "No memo body yet."}
          {bodyPreview.length > 320 ? "…" : ""}
        </p>
        <div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/memos/${memoId}`}>Open in full</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
