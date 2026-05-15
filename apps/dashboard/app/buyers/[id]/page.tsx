import { notFound } from "next/navigation";
import Link from "next/link";
import { getBuyer, listDealRows, listAssessments, isRetracted } from "@/lib/vault";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreBadge } from "@/components/score-badge";
import { StatusBadge } from "@/components/status-badge";
import { formatUsd } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `${id} — Buyer profile — BQA Dashboard` };
}

export default async function BuyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = getBuyer(id);
  if (!buyer) notFound();

  const assessments = listAssessments().filter((a) => a.buyer_id === id);
  const rows = listDealRows().filter((r) =>
    assessments.some((a) => a.listing_id === r.listing.listing_id)
  );

  const usingDefaultWeights =
    !buyer.scoring_weights_override ||
    Object.keys(buyer.scoring_weights_override).length === 0;

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="self-start">
        <Link href="/">← Overview</Link>
      </Button>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{buyer.id}</h1>
          <Badge variant="outline">as of {buyer.as_of_date}</Badge>
          <Badge
            variant={
              buyer.capital.sba_eligibility === "likely" ? "positive" : "muted"
            }
          >
            SBA: {buyer.capital.sba_eligibility}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {buyer.geography.home_metro} ·{" "}
          {buyer.operator_profile.involvement_level} · {buyer.operator_profile.hours_per_week_available} hrs/wk available
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Capital stack</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Liquid</dt>
              <dd className="text-right font-medium tnum">
                {formatUsd(buyer.capital.liquid_usd)}
              </dd>
              <dt className="text-muted-foreground">Borrowing capacity</dt>
              <dd className="text-right font-medium tnum">
                {formatUsd(buyer.capital.borrowing_capacity_usd)}
              </dd>
              <dt className="text-muted-foreground">Target owner CF</dt>
              <dd className="text-right font-medium tnum">
                {formatUsd(buyer.capital.target_owner_profit_usd)}
              </dd>
              <dt className="text-muted-foreground">SBA</dt>
              <dd className="text-right capitalize">
                {buyer.capital.sba_eligibility}
              </dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operator profile</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Hours / week</dt>
              <dd className="text-right tnum">
                {buyer.operator_profile.hours_per_week_available}
              </dd>
              <dt className="text-muted-foreground">Involvement</dt>
              <dd className="text-right capitalize">
                {buyer.operator_profile.involvement_level}
              </dd>
            </dl>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Skills
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {buyer.operator_profile.skills.map((s) => (
                  <li key={s}>
                    <Badge variant="muted">{s}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Industries lived
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {buyer.operator_profile.industries_lived.map((s) => (
                  <li key={s}>
                    <Badge variant="muted">{s}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geography</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Home metro</dt>
              <dd className="text-right">{buyer.geography.home_metro}</dd>
              <dt className="text-muted-foreground">Willing to relocate</dt>
              <dd className="text-right">
                {buyer.geography.willing_to_relocate ? "Yes" : "No"}
              </dd>
              <dt className="text-muted-foreground">Max commute</dt>
              <dd className="text-right tnum">
                {buyer.geography.max_commute_minutes} min
              </dd>
            </dl>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Preferred states
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {buyer.geography.preferred_states.map((s) => (
                  <li key={s}>
                    <Badge variant="outline" className="font-mono tnum">
                      {s}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-positive">
                Must have
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {buyer.industry_preferences.must_have.map((s) => (
                  <li key={s}>
                    <Badge variant="positive">{s}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
                Must avoid
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {buyer.industry_preferences.must_avoid.map((s) => (
                  <li key={s}>
                    <Badge variant="destructive">{s}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Open to
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {buyer.industry_preferences.open_to.map((s) => (
                  <li key={s}>
                    <Badge variant="muted">{s}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              License willingness:{" "}
              <strong>{buyer.industry_preferences.license_willingness}</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deal constraints</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:grid-cols-4">
              <dt className="text-muted-foreground">Min revenue</dt>
              <dd className="tnum font-medium">
                {formatUsd(buyer.deal_constraints.min_revenue_usd)}
              </dd>
              <dt className="text-muted-foreground">Max purchase price</dt>
              <dd className="tnum font-medium">
                {formatUsd(buyer.deal_constraints.max_purchase_price)}
              </dd>
              <dt className="text-muted-foreground">Max payback (yrs)</dt>
              <dd className="tnum font-medium">
                {buyer.deal_constraints.max_payback_years ?? "—"}
              </dd>
              <dt className="text-muted-foreground">Min seller financing</dt>
              <dd className="tnum font-medium">
                {buyer.deal_constraints.min_seller_financing != null
                  ? `${(buyer.deal_constraints.min_seller_financing * 100).toFixed(0)}%`
                  : "—"}
              </dd>
            </dl>
            {buyer.deal_constraints.deal_breakers &&
              buyer.deal_constraints.deal_breakers.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
                    Deal breakers
                  </p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
                    {buyer.deal_constraints.deal_breakers.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Scoring weights
              {usingDefaultWeights && (
                <Badge variant="muted">using default weights</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usingDefaultWeights ? (
              <p className="text-sm text-muted-foreground">
                No buyer-specific override. The default weights from{" "}
                <code className="rounded bg-muted px-1">
                  acquisition-analyst
                </code>{" "}
                apply. Override by adding a{" "}
                <code className="rounded bg-muted px-1">
                  scoring_weights_override
                </code>{" "}
                block to the BuyerProfile JSON.
              </p>
            ) : (
              <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(buyer.scoring_weights_override, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="deals-heading">
        <h2 id="deals-heading" className="text-lg font-semibold tracking-tight">
          Deals scored against this buyer
        </h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Asking</TableHead>
                <TableHead><span className="sr-only">Open</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                    No deals scored yet.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.listing.listing_id} className={isRetracted(r) ? "opacity-70" : ""}>
                  <TableCell className="font-mono text-xs">{r.listing.listing_id}</TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/deals/${r.listing.listing_id}`} className="hover:underline">
                      {r.listing.business_name ?? r.listing.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <ScoreBadge score={r.assessment?.score_0_100 ?? null} size="sm" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.assessment?.status ?? r.listing.status} />
                  </TableCell>
                  <TableCell className="tnum">
                    {formatUsd(r.listing.asking_price_usd)}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/deals/${r.listing.listing_id}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
