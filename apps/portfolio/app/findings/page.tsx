import Link from "next/link";
import { getNarrativeDeals } from "@/lib/vault";
import { PageShell } from "@/components/page-shell";
import { FadeUp } from "@/components/sections/fade-up";
import { FitGauge, type GaugeState } from "@/components/atoms/fit-gauge";
import { formatCompactUsd } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Findings — Buyer 001 Dossier",
};

const CLASSIFICATION_COPY = {
  negotiable: {
    label: "Negotiable",
    tone: "var(--gilt)",
    body: "One business is the right model in the right city. The earnings are below target — and that is the conversation worth having today.",
  },
  "future-target": {
    label: "Future-target",
    tone: "var(--moss)",
    body: "One business is structurally ideal — true absentee, manager in place, protected territory. The financing math is not solvable today; it becomes possible in eighteen to twenty-four months.",
  },
  flagged: {
    label: "Flagged",
    tone: "var(--rust)",
    body: "One business looked like a ninety-four-percent first-year return. It was retired on geography — and then re-flagged when the broker’s pattern surfaced. The system shows what it caught.",
  },
} as const;

function gaugeStateFor(classification: keyof typeof CLASSIFICATION_COPY): GaugeState {
  if (classification === "negotiable") return "negotiable";
  if (classification === "future-target") return "gated";
  return "flagged";
}

export default function FindingsPage() {
  const deals = getNarrativeDeals();
  return (
    <PageShell
      eyebrow="III — Findings"
      title="Three listings. Zero clean wins. One conversation worth having today."
      lede="This is the honesty pivot. The filter did its job — but the job today is to tell the buyer what is actually here, not to soften the result. Each block below is one finding and one judgment."
      asOf="2026-05-15"
    >
      <div className="space-y-px overflow-hidden rounded-sm border border-rule">
        {deals.map((deal, idx) => {
          const copy = CLASSIFICATION_COPY[deal.classification];
          const score = deal.assessment?.score_0_100 ?? null;
          const gaugeState = gaugeStateFor(deal.classification);
          return (
            <FadeUp key={deal.id} delay={idx * 0.04} className="block">
              <article className="grid grid-cols-1 gap-6 bg-surface-ink p-8 transition-colors hover:bg-bg-elevated md:grid-cols-[1fr_auto] md:gap-12 md:p-12">
                <div>
                  <div className="t-caption mb-4 flex items-center gap-3" style={{ color: copy.tone }}>
                    <span>{deal.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{copy.label}</span>
                  </div>
                  <h2 className="t-h2 text-balance text-fg">
                    {deal.listing.business_name ?? deal.listing.title}
                  </h2>
                  <p className="t-body text-pretty mt-4 prose-col text-fg-muted">{copy.body}</p>

                  <dl className="mt-7 grid max-w-md grid-cols-3 gap-6">
                    <div>
                      <dt className="t-caption text-fg-quiet">Asking</dt>
                      <dd className="tnum mt-1 text-[1.25rem] text-fg">
                        {formatCompactUsd(deal.listing.asking_price_usd)}
                      </dd>
                    </div>
                    <div>
                      <dt className="t-caption text-fg-quiet">
                        {deal.listing.metric_type ?? "Earnings"}
                      </dt>
                      <dd className="tnum mt-1 text-[1.25rem] text-fg">
                        {formatCompactUsd(deal.listing.sde_or_ebitda_usd)}
                      </dd>
                    </div>
                    <div>
                      <dt className="t-caption text-fg-quiet">City</dt>
                      <dd className="mt-1 text-[1.05rem] text-fg">
                        {deal.listing.city ?? "—"}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`/deals/${deal.id.toLowerCase()}`}
                    className="mt-9 inline-flex items-center gap-1.5 text-[0.86rem] uppercase tracking-[0.14em] text-gilt hover:underline underline-offset-4"
                  >
                    Read the {copy.label.toLowerCase()} case
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>

                <div className="flex flex-col items-center gap-3 md:items-end">
                  <FitGauge
                    score={score}
                    state={gaugeState}
                    size={156}
                    label={
                      score != null
                        ? `Fit score: ${score} of 100 — ${copy.label.toLowerCase()}`
                        : `${copy.label} — score withheld`
                    }
                  />
                </div>
              </article>
            </FadeUp>
          );
        })}
      </div>

      <FadeUp delay={0.2} className="mt-16">
        <p className="t-body text-pretty mx-auto max-w-2xl text-center italic text-fg-muted">
          “The portfolio's job is to tell the truth about what's here, not to invent what
          isn't. The negative results are part of the product.”
        </p>
      </FadeUp>
    </PageShell>
  );
}
