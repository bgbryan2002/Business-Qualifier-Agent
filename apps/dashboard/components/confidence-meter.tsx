import { cn, confidenceLabel } from "@/lib/utils";

export interface ConfidenceMeterProps {
  value: number;
  size?: "sm" | "md";
  className?: string;
  showLabel?: boolean;
}

export function ConfidenceMeter({
  value,
  size = "md",
  className,
  showLabel = true,
}: ConfidenceMeterProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const segments = 4;
  const activeSegments = Math.ceil(clamped * segments);
  const label = confidenceLabel(clamped);
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={clamped}
      aria-valuetext={`confidence ${clamped.toFixed(2)} (${label})`}
      className={cn(
        "inline-flex items-center gap-2",
        size === "sm" ? "text-[10px]" : "text-xs",
        className
      )}
    >
      <span className="inline-flex gap-0.5" aria-hidden>
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "block rounded-sm",
              size === "sm" ? "h-2 w-1.5" : "h-3 w-2",
              i < activeSegments
                ? clamped >= 0.75
                  ? "bg-positive"
                  : clamped >= 0.5
                    ? "bg-info"
                    : clamped >= 0.25
                      ? "bg-warn"
                      : "bg-destructive"
                : "bg-muted"
            )}
          />
        ))}
      </span>
      {showLabel && (
        <span className="text-muted-foreground tnum">
          {clamped.toFixed(2)}
        </span>
      )}
    </div>
  );
}
