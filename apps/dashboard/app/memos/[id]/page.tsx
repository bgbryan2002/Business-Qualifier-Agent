import { notFound } from "next/navigation";
import Link from "next/link";
import { getMemo, getListing, getAssessment } from "@/lib/vault";
import { renderMarkdown } from "@/lib/markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/score-badge";
import { HardGateBadge } from "@/components/hard-gate-badge";
import { StatusBadge } from "@/components/status-badge";
import { RetractionNotice } from "@/components/retraction-notice";
import { PrintButton } from "@/components/print-button";
import { formatUsd } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memo = getMemo(id);
  if (!memo) return { title: "Memo not found — BQA Dashboard" };
  return { title: `${memo.title} — BQA Dashboard` };
}

export default async function MemoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memo = getMemo(id);
  if (!memo) notFound();

  const listing = getListing(memo.listing_id);
  const assessment = getAssessment(memo.listing_id);
  const bodyHtml = await renderMarkdown(memo.body_markdown);

  return (
    <article className="flex flex-col gap-6">
      <div className="no-print flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/deals/${memo.listing_id}`}>← Back to deal</Link>
        </Button>
        <PrintButton />
      </div>

      {memo.is_retracted && (
        <RetractionNotice
          retractedAt={memo.as_of_date}
          reason={
            assessment?.retraction_reason ?? "verification_failed_or_rejected"
          }
        />
      )}

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {memo.title}
          </h1>
          {memo.is_draft && <Badge variant="warn">draft</Badge>}
          <StatusBadge status={memo.status} />
        </div>
        {listing && (
          <p className="text-sm text-muted-foreground">
            <Link href={`/deals/${listing.listing_id}`} className="hover:underline">
              {listing.business_name ?? listing.title}
            </Link>
            {listing.city ? ` · ${listing.city}, ${listing.state}` : ""}
          </p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div
          className="prose prose-sm dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-h1:hidden prose-table:text-sm prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-pre:bg-muted prose-pre:text-foreground"
          // Server-rendered HTML — safe because remark serializes our trusted vault content.
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <aside className="no-print flex flex-col gap-4">
          {listing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Listing</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <dt className="text-muted-foreground">ID</dt>
                  <dd className="text-right font-mono">
                    {listing.listing_id}
                  </dd>
                  <dt className="text-muted-foreground">Asking</dt>
                  <dd className="text-right tnum">
                    {formatUsd(listing.asking_price_usd)}
                  </dd>
                  <dt className="text-muted-foreground">SDE/EBITDA</dt>
                  <dd className="text-right tnum">
                    {formatUsd(listing.sde_or_ebitda_usd)}
                  </dd>
                  <dt className="text-muted-foreground">As of</dt>
                  <dd className="text-right tnum">{listing.as_of_date}</dd>
                </dl>
              </CardContent>
            </Card>
          )}
          {assessment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assessment</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ScoreBadge score={assessment.score_0_100} size="sm" />
                  <StatusBadge status={assessment.status} />
                </div>
                <div className="flex flex-wrap gap-1">
                  <HardGateBadge
                    gate="target_owner_profit"
                    result={assessment.hard_gates.target_owner_profit}
                    size="sm"
                  />
                  <HardGateBadge
                    gate="financing_feasibility"
                    result={assessment.hard_gates.financing_feasibility}
                    size="sm"
                  />
                  <HardGateBadge
                    gate="license_transferability"
                    result={assessment.hard_gates.license_transferability}
                    size="sm"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </article>
  );
}
