import { notFound } from "next/navigation";
import { NARRATIVE_LISTING_IDS, type NarrativeListingId, getNarrativeDeal, getBuyer } from "@/lib/vault";
import { PageShell } from "@/components/page-shell";
import { FadeUp } from "@/components/sections/fade-up";
import { FitGauge, type GaugeState } from "@/components/atoms/fit-gauge";
import { RiskMeter } from "@/components/atoms/risk-meter";
import { HardGateBadge } from "@/components/atoms/hard-gate";
import { Stat } from "@/components/atoms/stat";
import { formatCurrency } from "@/lib/utils";
import { GapVisualization } from "@/components/sections/gap-viz";
import { BrokerPatternFlag } from "@/components/sections/broker-pattern-flag";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export function generateStaticParams() {
  return NARRATIVE_LISTING_IDS.map((id) => ({ id: id.toLowerCase() }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const NARRATIVE: Record<
  NarrativeListingId,
  {
    eyebrow: string;
    title: string;
    lede: string;
    why_title: string;
    why_body: string;
    middle_title: string;
    middle_body: string;
    not_saying_title: string;
    not_saying: string[];
    ask_title: string;
    ask_body: string;
    risk_level: "low" | "medium" | "high" | "blocked";
    gauge_state: GaugeState;
    band_color: string;
  }
> = {
  L002: {
    eyebrow: "IV — Negotiable",
    title: "L002 — Franchised Commercial Cleaning",
    lede:
      "Thirteen years in business. Manager in place. Sixty-two active commercial clients on recurring schedule. The owner works twelve hours a week — and every one of those hours is in sales. That is the negotiation lever.",
    why_title: "Why this is the one to talk about",
    why_body:
      "A semi-absentee structure that already exists. The franchise gives training, processes, and brand. The manager in place runs the operation. The owner runs sales — and a buyer with consulting-grade communication can run sales for twelve hours a week. The geography is the home metro. The asking price sits inside the budget. The only thing wrong is the earnings number.",
    middle_title: "The $33,000 gap (and how negotiation closes it)",
    middle_body:
      "Reported EBITDA is $107k. The buyer's target draw is $140k. The broker's adjusted figure of $174k assumes eliminating the operations manager — which makes the deal owner-operator, which the buyer cannot work. So the gap is real. The path is to negotiate the asking price down or carry a seller note, until the effective yield reaches the target.",
    not_saying_title: "What the broker is not saying",
    not_saying: [
      "Franchisor name is withheld — must be disclosed before LOI; franchise transfer approval is required and can take 30–90 days.",
      "Adjusted EBITDA of $174k assumes eliminating the operations manager — incompatible with a 12-hr/wk semi-absentee buyer.",
      "Owner is the sole salesperson on 62 active clients — losing the owner's sales function is the revenue risk the teaser doesn't address.",
      "Franchise royalty rate is undisclosed; 4–10% of gross is typical and suppresses true buyer cash flow further.",
      "Client tenure and concentration are not provided; 62 clients is healthy, but the top-5 share matters.",
    ],
    ask_title: "Recommended ask",
    ask_body:
      "Sign NDA. Ask Mark Werbalowsky at Sunbelt Atlanta for the franchisor name and FDD Item 19. Counter at $300k OR ask for a seller note to close the gap. Pre-qualify with an SBA preferred lender in parallel.",
    risk_level: "medium",
    gauge_state: "negotiable",
    band_color: "var(--gilt)",
  },
  L003: {
    eyebrow: "V — Future-target",
    title: "L003 — FedEx P&D Routes (10)",
    lede:
      "The right model. The wrong moment. True absentee, owner out of state, full-time manager handling daily operations, ten protected zip-code territories. None of it solves the down-payment problem.",
    why_title: "Why this is the dream model",
    why_body:
      "Ten protected territories. A full-time manager. An owner who lives in another state and only handles administrative work. This is the operating profile a twelve-hours-a-week buyer wants when the rest of the math is in place. The reported cash flow of $162k clears the target draw on its own — no negotiation required.",
    middle_title: "Why it cannot happen today",
    middle_body:
      "The seller explicitly excludes SBA financing. The minimum down payment is $350,000. The buyer is at $22,000 liquid — sixteen times short. The acquisition strategy for buyer-001 begins and ends with SBA 7(a); without it, this deal is a wall. The fix is time and discipline: roughly eighteen to twenty-four months of consulting-bonus savings, paired with a recasting of the deal's structure when (or if) it re-emerges.",
    not_saying_title: "What is not yet known",
    not_saying: [
      "Truck payment amount the buyer must assume — undisclosed; reduces the effective $162k cash flow.",
      "Number of drivers / employees is not stated.",
      "FedEx ISP transfer approval — buyer with thin W-2 history and no logistics background; approval timeline 60–90 days even if it works.",
      "Holiday peak-season surge staffing not addressed.",
      "Seller financing language is 'with sufficient collaterals' — not a commitment.",
    ],
    ask_title: "Recommended action",
    ask_body:
      "Archive — do not engage today. Open a disciplined savings account now. Pre-qualify with an SBA preferred lender to start building the W-2 narrative. Track FedEx ISP listings monthly and revisit when liquid capital crosses $100k.",
    risk_level: "blocked",
    gauge_state: "gated",
    band_color: "var(--moss)",
  },
  L004: {
    eyebrow: "VI — Flagged",
    title: "L004 — Savannah Gasket Replacement",
    lede:
      "Looked like a 94% first-year return. Wasn't. The geography was the first reject. The broker-pattern was the second. The portfolio surfaces both because the filter only works if you can see what it caught.",
    why_title: "The original case",
    why_body:
      "On paper, the math was striking: $315k asking against $295k stated cash flow — a 1.07× SDE multiple, ten years of operating history, B2B recurring maintenance, no trade license required. Any system that saw this number and didn't lean in once would not be paying attention. The portfolio shows what attention discovered next.",
    middle_title: "The geography reject",
    middle_body:
      "Savannah is four hours from Atlanta. The buyer is a twelve-hours-a-week semi-absentee operator with no relocation flexibility. A remote business requires a credible local manager already in place — and the teaser disclosed nothing about hours, manager presence, or owner involvement. The price anomaly was not strong enough to override an operator-fit constraint that, in practice, would have meant the buyer cannot reliably oversee the business at all.",
    not_saying_title: "The pattern that emerged",
    not_saying: [
      "Four-plus listings from one broker (Donald Webster / businessbroker.net) across pest control, aircraft detailing, fencing, and gasket replacement — all under 1.5× SDE.",
      "Same broker, same anomaly, different industries. That is broker behavior, not coincidence.",
      "Most likely: the 'Asking' field is being misused for down-payment-required rather than total purchase price.",
      "The pattern was discovered in aggregate after a widened Phase-3 re-run. Isolated review would have missed it.",
      "L004 stays rejected on geography. It is flagged forever on the broker-pattern.",
    ],
    ask_title: "Why we surface this",
    ask_body:
      "Negative results are part of the product. The /system surface documents the retractions and the hardening that came out of them. Trust in the dossier depends on the filter being visible — what it caught is as important as what it kept.",
    risk_level: "blocked",
    gauge_state: "flagged",
    band_color: "var(--rust)",
  },
};

export default async function DealPage({ params }: PageProps) {
  const { id: idLower } = await params;
  const id = idLower.toUpperCase() as NarrativeListingId;
  if (!NARRATIVE_LISTING_IDS.includes(id)) {
    notFound();
  }
  const deal = getNarrativeDeal(id);
  const buyer = getBuyer();
  const narrative = NARRATIVE[id];
  const score = deal.assessment?.score_0_100 ?? null;

  return (
    <PageShell
      eyebrow={narrative.eyebrow}
      title={
        <>
          {narrative.title.split(" — ")[0]}
          <span className="block text-fg-muted">{narrative.title.split(" — ")[1]}</span>
        </>
      }
      lede={narrative.lede}
      asOf={deal.listing.as_of_date}
    >
      {/* Cover band */}
      <FadeUp>
        <section
          className="grid grid-cols-1 gap-10 rounded-sm border-l-2 bg-surface-ink p-8 md:grid-cols-[1fr_auto] md:p-12"
          style={{ borderLeftColor: narrative.band_color }}
        >
          <div className="grid grid-cols-2 gap-x-10 gap-y-6 md:grid-cols-3">
            <Stat label="Asking" value={deal.listing.asking_price_usd} format="currency" />
            <Stat
              label="Revenue"
              value={deal.listing.annual_revenue_usd}
              format="currency"
            />
            <Stat
              label={deal.listing.metric_type ?? "Earnings"}
              value={deal.listing.sde_or_ebitda_usd}
              format="currency"
              highlight={id === "L002"}
              caption={
                id === "L002"
                  ? `vs target ${formatCurrency(buyer.capital.target_owner_profit_usd)}`
                  : undefined
              }
            />
            <Stat
              label="Year established"
              value={deal.listing.year_established}
              format="plain"
            />
            <Stat
              label="Owner hrs / wk"
              value={deal.listing.owner_hours_per_week ?? "—"}
              format="plain"
            />
            <Stat label="City" value={deal.listing.city} />
          </div>
          <div className="flex flex-col items-center gap-4 md:items-end">
            <FitGauge
              score={score}
              state={narrative.gauge_state}
              size={180}
              label={
                score != null
                  ? `Fit score: ${score} of 100 — ${deal.classification}`
                  : `${deal.classification} — score withheld`
              }
            />
            <div className="t-caption text-fg-quiet">
              Score · <span className="text-fg">{deal.classification}</span>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Why */}
      <FadeUp className="mt-16">
        <section>
          <h2 className="t-h2 text-balance text-fg">{narrative.why_title}</h2>
          <p className="t-body text-pretty mt-5 prose-col text-fg-muted">
            {narrative.why_body}
          </p>
        </section>
      </FadeUp>

      {/* Middle section — gap-viz for L002, capital trajectory for L003, broker-pattern for L004 */}
      <FadeUp className="mt-16">
        <section>
          <h2 className="t-h2 text-balance text-fg">{narrative.middle_title}</h2>
          <p className="t-body text-pretty mt-5 prose-col text-fg-muted">
            {narrative.middle_body}
          </p>
          {id === "L002" && deal.listing.sde_or_ebitda_usd ? (
            <div className="mt-10">
              <GapVisualization
                reported={deal.listing.sde_or_ebitda_usd}
                target={buyer.capital.target_owner_profit_usd}
                adjusted={174000}
              />
            </div>
          ) : null}
          {id === "L004" ? (
            <div className="mt-10">
              <BrokerPatternFlag />
            </div>
          ) : null}
        </section>
      </FadeUp>

      {/* Risks + hard gates */}
      <FadeUp className="mt-16">
        <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h3 className="t-h3 text-fg">Hard gates</h3>
            <div className="mt-5">
              <HardGateBadge
                label="Target owner profit"
                result={deal.assessment?.hard_gates.target_owner_profit ?? "unknown"}
              />
              <HardGateBadge
                label="Financing feasibility"
                result={deal.assessment?.hard_gates.financing_feasibility ?? "unknown"}
              />
              <HardGateBadge
                label="License transferability"
                result={deal.assessment?.hard_gates.license_transferability ?? "unknown"}
              />
            </div>
            <h3 className="t-h3 mt-10 text-fg">Risk</h3>
            <div className="mt-4">
              <RiskMeter
                level={narrative.risk_level}
                label={`Overall risk: ${narrative.risk_level}`}
              />
            </div>
          </div>
          <div>
            <h3 className="t-h3 text-fg">Top risks</h3>
            <ol className="mt-4 space-y-3 text-fg-muted">
              {(deal.assessment?.top_risks ?? []).map((r, i) => (
                <li key={i} className="t-body flex gap-3">
                  <span className="tnum mt-1 text-[0.86rem] text-fg-quiet">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-pretty">{r}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </FadeUp>

      {/* Opportunities */}
      {(deal.assessment?.top_opportunities?.length ?? 0) > 0 ? (
        <FadeUp className="mt-16">
          <section>
            <h3 className="t-h3 text-fg">Top opportunities</h3>
            <ol className="mt-5 space-y-3 text-fg-muted">
              {(deal.assessment?.top_opportunities ?? []).map((o, i) => (
                <li key={i} className="t-body flex gap-3">
                  <span className="tnum mt-1 text-[0.86rem]" style={{ color: "var(--moss)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-pretty">{o}</span>
                </li>
              ))}
            </ol>
          </section>
        </FadeUp>
      ) : null}

      {/* What the broker isn't saying */}
      <FadeUp className="mt-16">
        <section className="rounded-sm border border-rule bg-surface-ink p-8 md:p-10">
          <h3 className="t-h3 text-fg">{narrative.not_saying_title}</h3>
          <ul className="mt-5 space-y-3 text-fg-muted">
            {narrative.not_saying.map((s, i) => (
              <li key={i} className="t-body flex gap-3 text-pretty">
                <span className="mt-2 inline-block h-[2px] w-3 shrink-0 bg-gilt" aria-hidden="true" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      </FadeUp>

      {/* Recommended ask */}
      <FadeUp className="mt-16">
        <section>
          <div className="t-caption mb-3 text-gilt">{narrative.ask_title}</div>
          <p className="t-lead text-balance prose-col text-fg">{narrative.ask_body}</p>
          <Link
            href="/appendix"
            className="mt-8 inline-flex items-center gap-2 border-b border-gilt/40 pb-1 text-[0.86rem] uppercase tracking-[0.14em] text-gilt hover:border-gilt"
          >
            See the receipts
            <ArrowDown size={14} aria-hidden="true" />
          </Link>
        </section>
      </FadeUp>

      {/* Inter-page nav */}
      <FadeUp className="mt-20 border-t border-rule pt-8">
        <div className="flex items-center justify-between text-[0.86rem] uppercase tracking-[0.14em] text-fg-quiet">
          <Link href="/findings" className="hover:text-fg">
            ← Findings
          </Link>
          <Link
            href="/comparison"
            className="inline-flex items-center gap-1.5 text-gilt hover:underline underline-offset-4"
          >
            Cross-comparison
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </FadeUp>
    </PageShell>
  );
}
