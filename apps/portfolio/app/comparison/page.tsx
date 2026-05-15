import { PageShell } from "@/components/page-shell";
import { ComparisonScroll } from "@/components/sections/comparison-scroll";

export const metadata = {
  title: "Cross-comparison — Buyer 001 Dossier",
};

export default function ComparisonPage() {
  return (
    <PageShell
      eyebrow="VII — Cross-comparison"
      title="The same three listings, three axes."
      lede="Price against yield. Effort against fit. Capital today against capital in 24 months. Scroll to advance — or, if motion is reduced, the three axes stack."
      asOf="2026-05-15"
    >
      <ComparisonScroll />
      <div className="mt-16 grid grid-cols-1 gap-6 text-fg-muted md:grid-cols-3">
        <div>
          <span className="t-caption text-gilt">Negotiable</span>
          <p className="t-body text-pretty mt-2">
            L002 sits below the target-yield line on Axis&nbsp;1 — that is the gap. On
            Axis&nbsp;2 it has the strongest operator-fit. On Axis&nbsp;3 it is the only
            candidate that is feasible today.
          </p>
        </div>
        <div>
          <span className="t-caption text-moss">Future-target</span>
          <p className="t-body text-pretty mt-2">
            L003 sits above L002 on Axis&nbsp;1 in raw yield but its asking price is at the
            ceiling. Its strength is on Axis&nbsp;3 in the right column — patience makes it
            possible.
          </p>
        </div>
        <div>
          <span className="t-caption text-rust">Flagged</span>
          <p className="t-body text-pretty mt-2">
            L004 sits highest on Axis&nbsp;1 yield — and lowest on Axis&nbsp;2 fit. That gap
            between yield and fit is what the broker-pattern explains away.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
