import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertOctagon } from "lucide-react";

interface Props {
  broker: string | null;
  pattern: "sub-1.5x-sde" | "multi-listing-anomaly" | "other";
  ratio: number | null;
  citationPath?: string;
}

export function BrokerPatternFlag({ broker, pattern, ratio, citationPath }: Props) {
  return (
    <Alert
      variant="warn"
      role="region"
      aria-label="Broker pattern warning"
      className="border-warn/60"
    >
      <AlertOctagon className="h-4 w-4" aria-hidden />
      <AlertTitle>Broker-pattern flag — verify before NDA</AlertTitle>
      <AlertDescription>
        <p>
          Detected pattern: <strong>{pattern}</strong>
          {ratio != null && (
            <>
              {" "}(asking / SDE ratio = <span className="tnum">{ratio.toFixed(2)}×</span>,
              under the 1.5× floor in the rubric)
            </>
          )}
          .
          {broker ? <> Broker: <strong>{broker}</strong>.</> : null}
        </p>
        <p className="mt-1 text-xs">
          Cites{" "}
          <code className="rounded bg-muted px-1">
            {citationPath ??
              "obsidian-vault/03-Deals/templates/search-rubric-buyer-001.md § Broker patterns"}
          </code>
          . Do not request NDA without clarifying what the asking figure represents.
        </p>
      </AlertDescription>
    </Alert>
  );
}
