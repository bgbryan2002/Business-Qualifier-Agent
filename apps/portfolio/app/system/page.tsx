import { PageShell } from "@/components/page-shell";
import { FadeUp } from "@/components/sections/fade-up";

export const metadata = {
  title: "System integrity — Buyer 001 Dossier",
};

interface Event {
  date: string;
  phase: string;
  headline: string;
  outcome: string;
  takeaway: string;
  tone: "neutral" | "negative" | "positive";
}

const EVENTS: Event[] = [
  {
    date: "2026-05-15",
    phase: "Phase 3",
    headline: "Listing discovery — first pass",
    outcome:
      "8 listings discovered across 5 broker sites. 2 high-fit-but-gated (L002, L003). 1 memo (L004). 2 BizBuySell snippet-derived candidates (L007, L008) flagged speculative.",
    takeaway:
      "The agent's single-WebFetch-per-URL strategy is vulnerable to JS-shell marketplaces. Snippet data is not the same as listing data.",
    tone: "neutral",
  },
  {
    date: "2026-05-15",
    phase: "Phase 3",
    headline: "Playwright verification — L007 + L008 retracted",
    outcome:
      "Live BizBuySell pages rendered: zero matches for 'Powder Springs' or 'Duluth' in the verified listing set. Both candidates retracted to confidence 0.00 with status: rejected.",
    takeaway:
      "Every BizBuySell-class claim must be playwright-verified before a packet is treated above 0.20 confidence. The retraction is the system working — not a failure to surface.",
    tone: "positive",
  },
  {
    date: "2026-05-15",
    phase: "Phase 3",
    headline: "Widened re-run discarded — Donald Webster broker pattern",
    outcome:
      "Re-run produced 5 listings (L009–L013) — all off-brief industries and 4 of 5 from one broker (Donald Webster, businessbroker.net) at 0.87–1.07× SDE multiples. Whole batch discarded; not committed.",
    takeaway:
      "Single-broker concentration is a stronger signal than any individual listing's metrics. The 1× SDE anomaly is a structural pattern, not a deal of the century.",
    tone: "negative",
  },
  {
    date: "2026-05-15",
    phase: "Phase 3",
    headline: "Search-rubric hardened",
    outcome:
      "search-rubric-buyer-001.md gained a 'Broker patterns to flag automatically' section. due-diligence-researcher.md gained four pre-flight checks: industry filter, marketplace breadth, broker concentration cap (max 2 per batch), SDE-multiple sanity (< 1.5× auto-flags speculative).",
    takeaway:
      "Pre-flight mechanical rejections beat prose constraints. The agent definition now fails closed on the failure modes we saw.",
    tone: "positive",
  },
  {
    date: "2026-05-15",
    phase: "Phase 3",
    headline: "L004 retroactively flagged",
    outcome:
      "L004 (Savannah gasket) was already rejected on geography. It is now also flagged on the Donald Webster pattern. The status stays rejected; the dossier surfaces both reasons.",
    takeaway:
      "The flag is permanent. If geography ever stops being the blocker, the broker pattern is what to clarify by phone before any NDA.",
    tone: "negative",
  },
];

const TONE_COLOR: Record<Event["tone"], string> = {
  neutral: "var(--vellum)",
  positive: "var(--moss)",
  negative: "var(--rust)",
};

export default function SystemPage() {
  return (
    <PageShell
      eyebrow="IX — System integrity"
      title="What the system rejected, and why."
      lede="The negative results are part of the product. This page is the audit trail — the receipts that the filter is doing real work."
      asOf="2026-05-15"
    >
      <div className="relative grid grid-cols-1 gap-0 sm:grid-cols-[120px_1fr]">
        {/* Vertical rule */}
        <div className="absolute left-[60px] top-0 bottom-0 hidden w-px bg-rule sm:block" aria-hidden="true" />

        {EVENTS.map((e, i) => (
          <FadeUp key={i} delay={i * 0.05} className="contents">
            <div className="hidden flex-col items-center pt-1 sm:flex">
              <div className="t-caption tnum text-fg-quiet">{e.date.slice(5)}</div>
              <div
                className="mt-3 h-2.5 w-2.5 rounded-full ring-2"
                style={{
                  backgroundColor: TONE_COLOR[e.tone],
                  // ring tinted ink to read on either mode
                  boxShadow: "0 0 0 2px var(--bg)",
                }}
                aria-hidden="true"
              />
            </div>
            <article className="border-b border-rule py-7 pl-4 last:border-b-0 sm:pl-10">
              <div className="t-caption mb-2" style={{ color: TONE_COLOR[e.tone] }}>
                {e.phase} · <span className="text-fg-quiet">{e.date}</span>
              </div>
              <h2 className="t-h3 text-balance text-fg">{e.headline}</h2>
              <p className="t-body text-pretty mt-3 prose-col text-fg-muted">{e.outcome}</p>
              <div className="t-caption mt-5 text-fg-quiet">Takeaway</div>
              <p className="text-pretty mt-1 italic text-fg">{e.takeaway}</p>
            </article>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.15} className="mt-16">
        <div className="rounded-sm border border-rule bg-surface-ink p-8">
          <div className="t-caption text-gilt">Why this surface exists</div>
          <p className="t-body text-pretty mt-3 prose-col text-fg-muted">
            A dossier that only showed survivors would be a marketing brochure. The
            retractions, the broker-pattern, the pre-flight checks — these are how the
            filter earns the right to recommend L002 as the conversation to have today.
            Trust is the differentiator.
          </p>
        </div>
      </FadeUp>
    </PageShell>
  );
}
