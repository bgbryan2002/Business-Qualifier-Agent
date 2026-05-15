import { PageShell } from "@/components/page-shell";
import { getNarrativeDeals } from "@/lib/vault";
import { DueDiligenceAccordion } from "@/components/sections/dd-accordion";

export const metadata = {
  title: "Appendix — Buyer 001 Dossier",
};

export default function AppendixPage() {
  const deals = getNarrativeDeals();
  const panels = deals.map((d) => ({
    id: d.id,
    title: d.listing.business_name ?? d.listing.title,
    subtitle:
      d.classification === "negotiable"
        ? "Negotiable"
        : d.classification === "future-target"
          ? "Future-target"
          : "Flagged",
    dd: d.diligence,
    memo: d.memo,
    tone: d.classification,
  }));

  return (
    <PageShell
      eyebrow="X — Appendix"
      title="See the receipts."
      lede="The full due-diligence packet for each candidate — claims with source URLs, red flags, follow-up actions. This is the show-your-work surface."
      asOf="2026-05-15"
    >
      <DueDiligenceAccordion panels={panels} />
      <p className="text-pretty mt-12 max-w-2xl text-fg-quiet">
        Confidence scores are deliberately conservative. A 0.65 means &ldquo;a single fetch
        of the broker&rsquo;s teaser page, no NDA, no CIM, no on-site visit, no lender
        pre-qualification.&rdquo; Real diligence happens after the broker conversation in
        step&nbsp;1 of <em>Next steps</em>.
      </p>
    </PageShell>
  );
}
