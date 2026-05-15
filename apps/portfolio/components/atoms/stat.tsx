import { formatCompactUsd, formatCurrency } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string | null | undefined;
  format?: "currency" | "compact-usd" | "raw" | "plain";
  caption?: string;
  highlight?: boolean;
}

export function Stat({ label, value, format = "raw", caption, highlight }: Props) {
  let display: string;
  if (value === null || value === undefined) {
    display = "—";
  } else if (typeof value === "number") {
    display =
      format === "currency"
        ? formatCurrency(value)
        : format === "compact-usd"
          ? formatCompactUsd(value)
          : format === "plain"
            ? String(value)
            : value.toLocaleString();
  } else {
    display = value;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="t-caption text-fg-quiet">{label}</div>
      <div
        className="tnum text-[1.85rem] leading-none"
        style={highlight ? { color: "var(--gilt)" } : { color: "var(--fg)" }}
      >
        {display}
      </div>
      {caption ? <div className="text-[0.82rem] text-fg-quiet">{caption}</div> : null}
    </div>
  );
}
