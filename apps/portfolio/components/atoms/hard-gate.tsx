import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HardGateResult } from "@/lib/vault";

const STATE: Record<
  HardGateResult,
  { icon: typeof Check; word: "PASS" | "FAIL" | "UNKNOWN"; tone: string }
> = {
  pass: { icon: Check, word: "PASS", tone: "text-moss" },
  fail: { icon: X, word: "FAIL", tone: "text-rust" },
  unknown: { icon: HelpCircle, word: "UNKNOWN", tone: "text-fg-quiet" },
};

export function HardGateBadge({
  label,
  result,
}: {
  label: string;
  result: HardGateResult;
}) {
  const s = STATE[result];
  const Icon = s.icon;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-rule py-2.5 last:border-b-0">
      <span className="text-[0.92rem] text-fg-muted">{label}</span>
      <span className={cn("inline-flex items-center gap-1.5 text-[0.78rem] font-medium tracking-[0.14em]", s.tone)}>
        <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
        <span aria-label={`${label} ${s.word}`}>{s.word}</span>
      </span>
    </div>
  );
}
