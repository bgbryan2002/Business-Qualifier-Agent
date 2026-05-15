"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreBadge } from "@/components/score-badge";
import { HardGateBadge } from "@/components/hard-gate-badge";
import { StatusBadge } from "@/components/status-badge";
import { ConfidenceMeter } from "@/components/confidence-meter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatUsd, cn } from "@/lib/utils";

export interface DealTableRow {
  listing_id: string;
  business_name: string;
  industry: string;
  city: string;
  state: string;
  asking_price_usd: number | null;
  sde_or_ebitda_usd: number | null;
  score: number | null;
  confidence: number;
  status: string;
  hard_gates: {
    target_owner_profit: "pass" | "fail" | "unknown";
    financing_feasibility: "pass" | "fail" | "unknown";
    license_transferability: "pass" | "fail" | "unknown";
  };
  broker: string | null;
  is_rejected: boolean;
}

type SortKey =
  | "listing_id"
  | "business_name"
  | "industry"
  | "asking_price_usd"
  | "sde_or_ebitda_usd"
  | "score"
  | "confidence"
  | "status";
type SortDir = "asc" | "desc";

interface Props {
  rows: DealTableRow[];
  defaultShowRejected: boolean;
}

export function DealsTable({ rows, defaultShowRejected }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showRejected, setShowRejected] = useState(defaultShowRejected);

  const visible = useMemo(() => {
    const filtered = rows.filter((r) =>
      showRejected ? true : !r.is_rejected
    );
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return sorted;
  }, [rows, sortKey, sortDir, showRejected]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "listing_id" ? "asc" : "desc");
    }
  }

  function headProps(key: SortKey) {
    const active = key === sortKey;
    return {
      ariaSort: active
        ? ((sortDir === "asc" ? "ascending" : "descending") as "ascending" | "descending")
        : ("none" as const),
      icon: active ? (
        sortDir === "asc" ? (
          <ArrowUp className="h-3 w-3" aria-hidden />
        ) : (
          <ArrowDown className="h-3 w-3" aria-hidden />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden />
      ),
    };
  }

  function SortableHead({
    label,
    sortKey: k,
    className,
  }: {
    label: string;
    sortKey: SortKey;
    className?: string;
  }) {
    const { ariaSort, icon } = headProps(k);
    return (
      <TableHead aria-sort={ariaSort} className={className}>
        <button
          type="button"
          onClick={() => toggleSort(k)}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
        >
          {label} {icon}
        </button>
      </TableHead>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center justify-between gap-3"
        aria-live="polite"
      >
        <p className="text-sm text-muted-foreground tnum">
          Showing <span className="font-semibold text-foreground">{visible.length}</span> of{" "}
          <span className="tnum">{rows.length}</span> deals
        </p>
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-rejected"
            checked={showRejected}
            onCheckedChange={(v) => setShowRejected(v === true)}
          />
          <Label htmlFor="show-rejected" className="text-sm font-normal">
            Show rejected / retracted
          </Label>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="ID" sortKey="listing_id" />
              <SortableHead label="Business" sortKey="business_name" />
              <SortableHead label="Industry" sortKey="industry" />
              <TableHead>Location</TableHead>
              <SortableHead label="Asking" sortKey="asking_price_usd" className="text-right" />
              <SortableHead label="SDE/EBITDA" sortKey="sde_or_ebitda_usd" className="text-right" />
              <SortableHead label="Score" sortKey="score" />
              <SortableHead label="Conf." sortKey="confidence" />
              <TableHead>Hard gates</TableHead>
              <SortableHead label="Status" sortKey="status" />
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="py-8 text-center text-sm text-muted-foreground">
                  No rows match the current filters.
                </TableCell>
              </TableRow>
            )}
            {visible.map((r) => (
              <TableRow
                key={r.listing_id}
                className={cn(r.is_rejected && "opacity-70")}
              >
                <TableCell className="font-mono text-xs">{r.listing_id}</TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/deals/${r.listing_id}`}
                    className="hover:underline focus-visible:underline outline-none"
                  >
                    {r.business_name || "—"}
                  </Link>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {r.industry || "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {r.city ? `${r.city}, ${r.state}` : r.state || "—"}
                </TableCell>
                <TableCell className="text-right tnum">
                  {formatUsd(r.asking_price_usd)}
                </TableCell>
                <TableCell className="text-right tnum">
                  {formatUsd(r.sde_or_ebitda_usd)}
                </TableCell>
                <TableCell>
                  <ScoreBadge score={r.score} size="sm" />
                </TableCell>
                <TableCell>
                  <ConfidenceMeter value={r.confidence} size="sm" showLabel={false} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <HardGateBadge
                      gate="target_owner_profit"
                      result={r.hard_gates.target_owner_profit}
                      size="sm"
                    />
                    <HardGateBadge
                      gate="financing_feasibility"
                      result={r.hard_gates.financing_feasibility}
                      size="sm"
                    />
                    <HardGateBadge
                      gate="license_transferability"
                      result={r.hard_gates.license_transferability}
                      size="sm"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/deals/${r.listing_id}`}>Open</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
