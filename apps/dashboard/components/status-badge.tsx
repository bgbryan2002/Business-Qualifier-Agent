import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<string, "muted" | "primary" | "destructive" | "warn" | "positive" | "info"> = {
  draft: "muted",
  accepted: "positive",
  "accepted-with-flags": "warn",
  rejected: "destructive",
  retracted: "destructive",
  speculative: "info",
  active: "primary",
};

export interface StatusBadgeProps {
  status: string;
  reason?: string;
}

export function StatusBadge({ status, reason }: StatusBadgeProps) {
  const variant = STATUS_MAP[status] ?? "muted";
  return (
    <Badge
      variant={variant}
      title={reason}
      aria-describedby={reason ? `status-${status}-reason` : undefined}
    >
      {status.replace(/-/g, " ")}
    </Badge>
  );
}
