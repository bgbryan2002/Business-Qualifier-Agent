import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Props {
  flags: string[];
}

export function RedFlagsList({ flags }: Props) {
  if (!flags || flags.length === 0) {
    return (
      <section aria-labelledby="red-flags-heading">
        <h3 id="red-flags-heading" className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Red flags
        </h3>
        <p className="text-sm text-muted-foreground">
          No red flags surfaced (yet).
        </p>
      </section>
    );
  }
  return (
    <section aria-labelledby="red-flags-heading">
      <h3
        id="red-flags-heading"
        className="mb-2 text-sm font-semibold uppercase tracking-wide text-destructive"
      >
        Red flags ({flags.length})
      </h3>
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        <AlertTitle>Surfaced during diligence</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {flags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </section>
  );
}
