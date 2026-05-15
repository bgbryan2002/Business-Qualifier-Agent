import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDealRow,
  detectBrokerPattern,
  isRetracted,
  getEntityAdvisory,
} from "@/lib/vault";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/score-badge";
import { StatusBadge } from "@/components/status-badge";
import { HardGateBadge } from "@/components/hard-gate-badge";
import { ConfidenceMeter } from "@/components/confidence-meter";
import { RetractionNotice } from "@/components/retraction-notice";
import { BrokerPatternFlag } from "@/components/broker-pattern-flag";
import { ScoreBreakdownChart } from "@/components/score-breakdown-chart";
import { DiligenceClaimsList } from "@/components/diligence-claims-list";
import { RedFlagsList } from "@/components/red-flags-list";
import { FollowUpActionsList } from "@/components/follow-up-actions-list";
import { MemoPanel } from "@/components/memo-panel";
import { EntityAdvisoryPanel } from "@/components/entity-advisory-panel";
import { Button } from "@/components/ui/button";
import { formatUsd, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = getDealRow(id);
  if (!row) return { title: "Deal not found — BQA Dashboard" };
  return {
    title: `${row.listing.business_name ?? row.listing.listing_id} — BQA Dashboard`,
  };
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = getDealRow(id);
  if (!row) notFound();

  const { listing, assessment, diligence, memo } = row;
  const broker = detectBrokerPattern(listing);
  const retracted = isRetracted(row);
  const advisory = getEntityAdvisory(listing.listing_id);

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="self-start">
        <Link href="/deals">← All deals</Link>
      </Button>

      {retracted && (
        <RetractionNotice
          retractedAt={assessment?.scored_at?.slice(0, 10) ?? listing.as_of_date}
          reason={
            assessment?.retraction_reason ??
            (listing.tags.find((t) => /reject|retract/i.test(t)) ?? listing.status)
          }
          runLogAnchor="phase-3"
        />
      )}

      {broker.flagged && (
        <BrokerPatternFlag
          broker={listing.broker ?? null}
          pattern={broker.pattern!}
          ratio={broker.ratio}
        />
      )}

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {listing.business_name ?? listing.title}
          </h1>
          <Badge variant="outline" className="font-mono tnum">
            {listing.listing_id}
          </Badge>
          {assessment && <ScoreBadge score={assessment.score_0_100} />}
          <StatusBadge status={assessment?.status ?? listing.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {listing.industry} · {listing.city ? `${listing.city}, ` : ""}
          {listing.state}
        </p>
        {assessment?.fit_summary && (
          <p className="max-w-prose text-sm">{assessment.fit_summary}</p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Listing facts</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Asking</dt>
              <dd className="text-right font-medium tnum">
                {formatUsd(listing.asking_price_usd)}
              </dd>
              <dt className="text-muted-foreground">Revenue</dt>
              <dd className="text-right font-medium tnum">
                {formatUsd(listing.annual_revenue_usd)}
              </dd>
              <dt className="text-muted-foreground">
                {listing.metric_type ?? "SDE / EBITDA"}
              </dt>
              <dd className="text-right font-medium tnum">
                {formatUsd(listing.sde_or_ebitda_usd)}
              </dd>
              <dt className="text-muted-foreground">Asking / SDE</dt>
              <dd className="text-right tnum">
                {broker.ratio != null ? `${broker.ratio.toFixed(2)}×` : "—"}
              </dd>
              <dt className="text-muted-foreground">NAICS</dt>
              <dd className="text-right font-mono text-xs">
                {listing.naics_code ?? "—"}
              </dd>
              <dt className="text-muted-foreground">Established</dt>
              <dd className="text-right tnum">
                {listing.year_established ?? "—"}
              </dd>
              <dt className="text-muted-foreground">Employees</dt>
              <dd className="text-right tnum">
                {formatNumber(listing.employees ?? undefined)}
              </dd>
              <dt className="text-muted-foreground">Owner hrs/wk</dt>
              <dd className="text-right tnum">
                {listing.owner_hours_per_week ?? "—"}
              </dd>
              <dt className="text-muted-foreground">Real estate</dt>
              <dd className="text-right">{listing.real_estate ?? "—"}</dd>
              <dt className="text-muted-foreground">License</dt>
              <dd className="text-right">{listing.license_required ?? "—"}</dd>
              <dt className="text-muted-foreground">Broker</dt>
              <dd className="text-right text-xs">{listing.broker ?? "—"}</dd>
              <dt className="text-muted-foreground">Confidence</dt>
              <dd className="text-right">
                <ConfidenceMeter value={listing.confidence} size="sm" />
              </dd>
            </dl>
            {listing.source?.source_url_or_path && (
              <div className="mt-4 border-t pt-3">
                <a
                  href={listing.source.source_url_or_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline underline-offset-2"
                >
                  Source listing (opens in new tab)
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Score breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {assessment ? (
                <ScoreBreakdownChart subscores={assessment.subscores} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not yet scored. Run <code className="rounded bg-muted px-1">acquisition-analyst</code>.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hard gates</CardTitle>
            </CardHeader>
            <CardContent>
              {assessment ? (
                <div className="flex flex-wrap gap-2">
                  <HardGateBadge
                    gate="target_owner_profit"
                    result={assessment.hard_gates.target_owner_profit}
                  />
                  <HardGateBadge
                    gate="financing_feasibility"
                    result={assessment.hard_gates.financing_feasibility}
                  />
                  <HardGateBadge
                    gate="license_transferability"
                    result={assessment.hard_gates.license_transferability}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hard-gate assessment yet.
                </p>
              )}
            </CardContent>
          </Card>

          {assessment && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top risks</CardTitle>
                </CardHeader>
                <CardContent>
                  {assessment.top_risks && assessment.top_risks.length > 0 ? (
                    <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
                      {assessment.top_risks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No risks recorded.</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  {assessment.top_opportunities &&
                  assessment.top_opportunities.length > 0 ? (
                    <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
                      {assessment.top_opportunities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No opportunities recorded.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diligence claims</CardTitle>
        </CardHeader>
        <CardContent>
          {diligence ? (
            <DiligenceClaimsList claims={diligence.claims} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Diligence pending — no <code className="rounded bg-muted px-1">DueDiligencePacket</code> on file for this listing.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <RedFlagsList flags={diligence?.red_flags ?? []} />
        <FollowUpActionsList actions={diligence?.follow_up_actions ?? []} />
      </div>

      {memo && (
        <MemoPanel
          memoId={memo.id}
          status={memo.status}
          isDraft={memo.is_draft}
          bodyPreview={memo.body_markdown}
        />
      )}

      <EntityAdvisoryPanel advisory={advisory} />
    </div>
  );
}
