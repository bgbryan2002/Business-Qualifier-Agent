import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatBlockProps {
  label: string;
  value: number | string;
  sublabel?: string;
  trend?: { delta: number; direction: "up" | "down" | "flat" };
  tone?: "neutral" | "warn" | "positive";
  ariaLabel?: string;
}

const toneRing = {
  neutral: "",
  warn: "ring-1 ring-warn/30",
  positive: "ring-1 ring-positive/30",
};

export function StatBlock({
  label,
  value,
  sublabel,
  trend,
  tone = "neutral",
  ariaLabel,
}: StatBlockProps) {
  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;
  return (
    <Card className={cn(toneRing[tone])}>
      <CardContent className="flex flex-col gap-1 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className="text-3xl font-semibold tnum"
          aria-label={ariaLabel}
        >
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-muted-foreground tnum">{sublabel}</p>
        )}
        {trend && (
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <TrendIcon className="h-3.5 w-3.5" aria-hidden />
            <span className="tnum">
              {trend.delta > 0 ? "+" : ""}
              {trend.delta} vs prior
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
