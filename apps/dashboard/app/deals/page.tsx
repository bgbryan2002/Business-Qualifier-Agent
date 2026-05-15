import {
  listDealRows,
  listAssessments,
  isRetracted,
  type DealRow,
} from "@/lib/vault";
import { DealsTable, type DealTableRow } from "@/components/deals-table";
import { DealsDistributionChart } from "@/components/deals-distribution-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata = { title: "Deals — BQA Dashboard" };

export const dynamic = "force-dynamic";

function toTableRow(row: DealRow): DealTableRow {
  return {
    listing_id: row.listing.listing_id,
    business_name: row.listing.business_name ?? row.listing.title,
    industry: row.listing.industry ?? "",
    city: row.listing.city ?? "",
    state: row.listing.state ?? "",
    asking_price_usd: row.listing.asking_price_usd ?? null,
    sde_or_ebitda_usd: row.listing.sde_or_ebitda_usd ?? null,
    score: row.assessment?.score_0_100 ?? null,
    confidence: row.assessment?.confidence ?? row.listing.confidence ?? 0,
    status: row.assessment?.status ?? row.listing.status,
    hard_gates: row.assessment?.hard_gates ?? {
      target_owner_profit: "unknown",
      financing_feasibility: "unknown",
      license_transferability: "unknown",
    },
    broker: row.listing.broker ?? null,
    is_rejected: isRetracted(row),
  };
}

export default async function DealsPage() {
  const rows = listDealRows();
  const assessments = listAssessments();
  const tableRows = rows.map(toTableRow);
  const actionable = tableRows.filter((r) => !r.is_rejected).length;
  const allRejected = rows.length > 0 && actionable === 0;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Deals</h1>
        </header>
        <EmptyState
          title="No listings ingested yet"
          body="Paste source URLs into inputs/listings.json and run Phase 3 (listing ingestion + due diligence + scoring)."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Deals</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} listings ingested · {actionable} currently actionable.
        </p>
      </header>

      {allRejected && (
        <Alert variant="warn" role="region" aria-label="No actionable candidates banner">
          <Info className="h-4 w-4" aria-hidden />
          <AlertTitle>0 currently actionable</AlertTitle>
          <AlertDescription>
            All {rows.length} ingested listings are rejected or retracted. The{" "}
            <strong>Show rejected</strong> toggle defaults ON so the discard
            reasons stay visible.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Score distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <DealsDistributionChart assessments={assessments} />
        </CardContent>
      </Card>

      <DealsTable rows={tableRows} defaultShowRejected={allRejected} />
    </div>
  );
}
