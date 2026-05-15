import { PageShell } from "@/components/page-shell";
import { FadeUp } from "@/components/sections/fade-up";
import { Phone, PiggyBank, FileCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata = {
  title: "Next steps — Buyer 001 Dossier",
};

interface Step {
  n: number;
  title: string;
  body: string;
  estimate: string;
  source: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    n: 1,
    title: "Call Mark Werbalowsky at Sunbelt Atlanta about L002.",
    body: "Sign the NDA. Ask for the franchisor name and FDD Item 19. State the gap directly: reported EBITDA is $107k, target draw is $140k, the adjusted figure requires eliminating the manager. Counter at $300k OR ask for a seller note that closes the gap.",
    estimate: "30 min · this week",
    source: "L002 — Sunbelt Atlanta · Listing SA1761",
    icon: Phone,
  },
  {
    n: 2,
    title: "Open a savings-discipline account now.",
    body: "L003 needs $350,000 of liquid capital and SBA financing is explicitly blocked. Eighteen months of consulting bonuses, holiday pay, and side-saving — without lifestyle creep — is the runway. Treat it as a fixed expense, not an aspiration.",
    estimate: "1 hour · this week",
    source: "buyer-001 consistency flags · L003 — gabusinessbrokers.com",
    icon: PiggyBank,
  },
  {
    n: 3,
    title: "Pre-qualify with an SBA preferred lender.",
    body: "Six months of W-2 plus a clear narrative beats waiting two years. The thin-W-2 flag is the load-bearing financing question. Get an underwriter's read now, even if the answer is conditional, so the next L002-shaped opportunity can move on a 30-day clock.",
    estimate: "2 weeks · in parallel with step 1",
    source: "buyer-001 consistency flag · thin_w2_history",
    icon: FileCheck,
  },
];

export default function NextStepsPage() {
  return (
    <PageShell
      eyebrow="VIII — Next steps"
      title="Three things, in order."
      lede="The dossier is information. These are decisions. None of them requires a hundred-percent answer. All of them are time-boxed to this month."
      asOf="2026-05-15"
    >
      <ol className="space-y-px overflow-hidden rounded-sm border border-rule">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <FadeUp key={s.n} delay={i * 0.06}>
              <li className="group flex gap-7 bg-surface-ink p-7 transition-colors hover:bg-bg-elevated md:p-10">
                <div
                  className="tnum mt-1 shrink-0 text-[3rem] leading-none transition-colors group-hover:text-gilt"
                  style={{ color: "var(--fg-quiet)", fontVariantNumeric: "tabular-nums" }}
                  aria-hidden="true"
                >
                  {String(s.n).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="t-caption mb-2 inline-flex items-center gap-2 text-gilt">
                    <Icon size={14} aria-hidden="true" />
                    <span>{s.estimate}</span>
                  </div>
                  <h2 className="t-h3 text-balance text-fg">{s.title}</h2>
                  <p className="t-body text-pretty mt-3 prose-col text-fg-muted">{s.body}</p>
                  <div className="t-caption mt-5 text-fg-quiet">
                    Source · <span className="text-fg-muted">{s.source}</span>
                  </div>
                </div>
              </li>
            </FadeUp>
          );
        })}
      </ol>

      <FadeUp delay={0.2} className="mt-16">
        <div className="rounded-sm border border-gilt/30 bg-surface-ink p-8">
          <div className="t-caption text-gilt">A note on cadence</div>
          <p className="t-body text-pretty mt-3 prose-col text-fg-muted">
            None of these steps is the deal. They are the discipline that produces the deal.
            Step&nbsp;1 is the only one with a real broker counterpart — the other two are
            personal infrastructure. Doing them in order is what makes the next L002-shaped
            opportunity actionable on a 30-day clock instead of an 18-month clock.
          </p>
        </div>
      </FadeUp>
    </PageShell>
  );
}
