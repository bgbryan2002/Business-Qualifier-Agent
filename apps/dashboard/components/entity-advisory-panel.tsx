import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScaleIcon } from "lucide-react";
import type { EntityAdvisory } from "@/lib/vault";

interface Props {
  advisory: EntityAdvisory | null;
}

export function EntityAdvisoryPanel({ advisory }: Props) {
  if (!advisory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScaleIcon className="h-4 w-4" aria-hidden />
            Entity advisory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No entity advisory yet. <code className="rounded bg-muted px-1">legal-entity-analyst</code>{" "}
            has not run for this deal. Structure recommendation will route to{" "}
            <code className="rounded bg-muted px-1">05-Validation/signoffs/</code> for human CPA / attorney review when generated.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScaleIcon className="h-4 w-4" aria-hidden />
          Entity advisory
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {advisory.human_signoff_required && (
          <Alert variant="warn" role="note">
            <AlertTitle>Human sign-off required</AlertTitle>
            <AlertDescription>
              Workflow-opinionated, not legally final — see{" "}
              <code className="rounded bg-muted px-1">
                {advisory.signoff_checklist_path ?? "05-Validation/signoffs/"}
              </code>
              .
            </AlertDescription>
          </Alert>
        )}
        <ul className="flex flex-col gap-3">
          {advisory.options_considered.map((opt, i) => (
            <li
              key={i}
              className="rounded-md border border-border bg-muted/30 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{opt.structure ?? "Option"}</Badge>
              </div>
              {opt.rationale && (
                <p className="mt-2 text-sm">{opt.rationale}</p>
              )}
              {opt.tradeoffs && opt.tradeoffs.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  {opt.tradeoffs.map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
