import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Ban } from "lucide-react";

interface Props {
  retractedAt: string;
  reason: string;
  runLogAnchor?: string;
}

export function RetractionNotice({ retractedAt, reason, runLogAnchor }: Props) {
  return (
    <Alert variant="destructive" role="region" aria-label="Retraction notice">
      <Ban className="h-4 w-4" aria-hidden />
      <AlertTitle>RETRACTED</AlertTitle>
      <AlertDescription>
        <p>
          This record was retracted on{" "}
          <time className="tnum">{retractedAt}</time>. Reason: {reason}.
        </p>
        {runLogAnchor && (
          <p className="mt-1 text-xs">
            See <code className="rounded bg-muted px-1">RUN-LOG.md #{runLogAnchor}</code>.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
