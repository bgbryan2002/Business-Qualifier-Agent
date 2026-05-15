import { cn, scoreBand, scoreBandLabel } from "@/lib/utils";

export interface ScoreBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-6 min-w-12 text-xs px-2",
  md: "h-8 min-w-14 text-sm px-2.5",
  lg: "h-10 min-w-16 text-base px-3",
};

const bandClass = {
  red: "bg-destructive text-destructive-foreground",
  amber: "bg-warn text-warn-foreground",
  green: "bg-positive text-positive-foreground",
  emerald: "bg-positive text-positive-foreground ring-2 ring-positive/40",
};

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  if (score == null) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground tnum",
          sizeMap[size],
          className
        )}
        aria-label="score unavailable"
      >
        —
      </span>
    );
  }
  const band = scoreBand(score);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold tnum tabular-nums",
        sizeMap[size],
        bandClass[band],
        className
      )}
      aria-label={`score ${score}, ${scoreBandLabel(score)}`}
    >
      {score}
    </span>
  );
}
