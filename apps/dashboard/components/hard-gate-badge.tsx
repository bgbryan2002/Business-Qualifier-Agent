import { Check, X, HelpCircle } from "lucide-react";
import type { HardGateResult } from "@/lib/vault";
import { cn } from "@/lib/utils";

const GATE_LABELS: Record<string, string> = {
  target_owner_profit: "Target Owner Profit",
  financing_feasibility: "Financing Feasibility",
  license_transferability: "License Transferability",
};

const GATE_ABBR: Record<string, string> = {
  target_owner_profit: "CF",
  financing_feasibility: "FIN",
  license_transferability: "LIC",
};

export interface HardGateBadgeProps {
  gate:
    | "target_owner_profit"
    | "financing_feasibility"
    | "license_transferability";
  result: HardGateResult;
  size?: "sm" | "md";
  className?: string;
}

export function HardGateBadge({
  gate,
  result,
  size = "md",
  className,
}: HardGateBadgeProps) {
  const isPass = result === "pass";
  const isFail = result === "fail";
  const Icon = isPass ? Check : isFail ? X : HelpCircle;
  const text = isPass ? "PASS" : isFail ? "FAIL" : "UNK";
  const label = GATE_LABELS[gate];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-semibold tnum",
        size === "sm" ? "text-[10px]" : "text-xs",
        isFail
          ? "border-destructive bg-destructive/10 text-destructive"
          : isPass
            ? "border-positive bg-positive/10 text-positive"
            : "border-border bg-muted text-muted-foreground",
        className
      )}
      title={`${label}: ${result.toUpperCase()}`}
      aria-label={`${label} ${result}`}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} aria-hidden />
      <span className="font-mono">{GATE_ABBR[gate]}</span>
      <span>{text}</span>
    </span>
  );
}
