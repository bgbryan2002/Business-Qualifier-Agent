import {
  listBuyers,
  listDealRows,
  listAssessments,
  listMemos,
  listSkills,
  getRecentRunLogEntries,
  isRetracted,
} from "@/lib/vault";
import { StatBlock } from "@/components/stat-block";
import { BuyerCard } from "@/components/buyer-card";
import { DealRibbon } from "@/components/deal-ribbon";
import { HardGateSummaryChart } from "@/components/hard-gate-summary-chart";
import { RecentActivityFeed } from "@/components/recent-activity-feed";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Overview — BQA Dashboard" };

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const buyers = listBuyers();
  const rows = listDealRows();
  const assessments = listAssessments();
  const memos = listMemos();
  const skills = listSkills();
  const runLog = getRecentRunLogEntries(5);

  const actionableRows = rows.filter((r) => !isRetracted(r));
  const rejectedCount = rows.length - actionableRows.length;
  const activeMemoCount = memos.filter(
    (m) => !m.is_retracted && m.status !== "rejected"
  ).length;

  const topDeals = [...rows]
    .map((r) => ({
      listingId: r.listing.listing_id,
      businessName: r.listing.business_name || r.listing.title,
      score: r.assessment?.score_0_100 ?? null,
      confidence: r.assessment?.confidence ?? r.listing.confidence ?? 0,
      status: r.assessment?.status ?? r.listing.status,
      industry: r.listing.industry,
      isRetracted: isRetracted(r),
    }))
    .sort((a, b) => {
      // Prefer non-retracted, then higher score
      if (a.isRetracted !== b.isRetracted) return a.isRetracted ? 1 : -1;
      return (b.score ?? -1) - (a.score ?? -1);
    })
    .slice(0, 5)
    .map(({ isRetracted: _ir, ...rest }) => rest);

  // Group rejection reasons for the all-rejected breakdown
  const rejectionGroups = new Map<string, number>();
  for (const r of rows) {
    if (!isRetracted(r)) continue;
    const reasonTag = r.listing.tags.find((t) => /rejected-|retract|verification|fail/i.test(t));
    const reason = reasonTag ?? r.assessment?.retraction_reason ?? r.listing.status;
    rejectionGroups.set(reason, (rejectionGroups.get(reason) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          State of the world for the SMB Acquisition Intelligence Platform.
          Read-only.
        </p>
      </header>

      <section
        aria-labelledby="stats-heading"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <h2 id="stats-heading" className="sr-only">
          Counts
        </h2>
        <StatBlock
          label="Buyers"
          value={buyers.length}
          ariaLabel={`${buyers.length} buyer profile${buyers.length === 1 ? "" : "s"}`}
        />
        <StatBlock
          label="Listings"
          value={rows.length}
          sublabel={`${rejectedCount} rejected / retracted`}
          tone={rejectedCount === rows.length && rows.length > 0 ? "warn" : "neutral"}
          ariaLabel={`${rows.length} listings, ${rejectedCount} rejected`}
        />
        <StatBlock
          label="Active memos"
          value={activeMemoCount}
          sublabel={`${memos.length - activeMemoCount} retracted`}
          ariaLabel={`${activeMemoCount} active memos, ${memos.length - activeMemoCount} retracted`}
        />
        <StatBlock
          label="Skills"
          value={skills.length}
          sublabel={`${new Set(skills.map((s) => s.category)).size} categories`}
          ariaLabel={`${skills.length} validated skills`}
        />
      </section>

      {buyers.length === 0 ? (
        <EmptyState
          title="No buyer profiles yet"
          body="Run the buyer-profiler subagent to capture a BuyerProfile. The dashboard becomes useful once Phase 1 has run."
          cta={{ label: "How to run Phase 1", href: "/" }}
        />
      ) : (
        <section aria-labelledby="buyers-heading" className="flex flex-col gap-3">
          <h2 id="buyers-heading" className="text-lg font-semibold tracking-tight">
            Buyers
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {buyers.map((b) => (
              <BuyerCard
                key={b.id}
                buyer={b}
                dealCount={rows.length}
                memoCount={
                  memos.filter((m) => !m.is_retracted).length
                }
              />
            ))}
          </div>
        </section>
      )}

      {rows.length === 0 ? (
        <EmptyState
          title="No listings ingested yet"
          body="Paste source URLs into inputs/listings.json and run Phase 3 (listing ingestion + due diligence + scoring). Deals will appear here once normalized."
        />
      ) : actionableRows.length === 0 ? (
        <section aria-labelledby="all-rejected-heading" className="flex flex-col gap-3">
          <h2
            id="all-rejected-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Active deal ribbon
          </h2>
          <EmptyState
            tone="warn"
            title="No actionable candidates today"
            body={`${rows.length} listings ingested; 0 currently actionable. Breakdown by rejection reason below.`}
          />
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Rejection breakdown
              </h3>
              <ul className="flex flex-wrap gap-2">
                {Array.from(rejectionGroups.entries()).map(([reason, count]) => (
                  <li key={reason}>
                    <Badge variant="muted" className="tnum">
                      {reason}: {count}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Showing top retracted deals in the ribbon below so the rejected
                set stays visible (rather than a blank screen).
              </p>
            </CardContent>
          </Card>
          <DealRibbon deals={topDeals} />
        </section>
      ) : (
        <section aria-labelledby="active-ribbon-heading" className="flex flex-col gap-3">
          <h2
            id="active-ribbon-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Active deal ribbon
          </h2>
          <DealRibbon deals={topDeals} />
        </section>
      )}

      <section
        aria-labelledby="charts-heading"
        className="grid gap-4 lg:grid-cols-2"
      >
        <h2 id="charts-heading" className="sr-only">
          Summary charts and recent activity
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Hard-gate summary</CardTitle>
          </CardHeader>
          <CardContent>
            <HardGateSummaryChart assessments={assessments} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RecentActivityFeed entries={runLog} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
