import { getBuyer } from "@/lib/vault";
import { PageShell } from "@/components/page-shell";
import { FadeUp } from "@/components/sections/fade-up";
import { Stat } from "@/components/atoms/stat";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Thesis — Buyer 001 Dossier",
};

export default function ThesisPage() {
  const b = getBuyer();
  return (
    <PageShell
      eyebrow="II — Thesis"
      title="Who you are. What you are hunting."
      lede="The constraints are the strategy: twelve hours a week, twenty-two thousand liquid, four hundred fifty in SBA capacity, six months of W-2 history, and the discipline of a buyer who already knows how to read a model."
      asOf={b.as_of_date}
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
        {/* Left column — prose */}
        <div className="prose-col text-balance">
          <FadeUp>
            <h2 className="t-h3 mb-3">Posture</h2>
            <p className="t-body text-fg-muted">
              Twenty-two years old. Six months into a Big&nbsp;4 management-consulting role in
              Atlanta. Lives at home. Just financed a car. The play is leveraged: minimal cash
              down, ten-to-twenty percent seller note, seventy-to-eighty percent SBA. The math
              only works on deals where reported earnings comfortably cover debt service
              <em> after</em> the target draw of{" "}
              <span className="tnum text-gilt">
                {formatCurrency(b.capital.target_owner_profit_usd)}
              </span>{" "}
              per year.
            </p>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="t-h3 mb-3 mt-10">Operator profile</h2>
            <p className="t-body text-fg-muted">
              Twelve hours a week. Semi-absentee. Skills are{" "}
              <em>financial modeling, project management, client communication, advisory</em>{" "}
              — the operator-fit of a buyer who can read a P&amp;L, write a memo, and manage
              a manager. Operational firepower in the businesses themselves: none yet. Every
              business on the open-to list would be a first. That raises diligence weight on
              the manager-in-place quality and on operational handoff completeness.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="t-h3 mb-3 mt-10">Geography</h2>
            <p className="t-body text-fg-muted">
              Atlanta is home. Forty-five-minute commute cap. Preferred states are Georgia,
              Tennessee, Alabama, South Carolina. Not willing to relocate; remote operation of
              a four-hour-distant business needs a credible local manager already in place —
              the constraint that ultimately retired L004.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <h2 className="t-h3 mb-3 mt-10">Must-haves and must-avoids</h2>
            <ul className="t-body grid grid-cols-1 gap-2.5 text-fg-muted">
              <li>
                <span className="t-caption text-moss">Must have</span> &nbsp;manager in place,
                recurring revenue, owner not the sole salesperson, documented SOPs.
              </li>
              <li>
                <span className="t-caption text-rust">Must avoid</span> &nbsp;food service,
                trade-license-required, owner-operator model, single customer over forty
                percent.
              </li>
              <li>
                <span className="t-caption text-gilt">Open to</span> &nbsp;laundromats,
                self-storage, car washes, vending routes, small B2B SaaS, FBA e-commerce,
                niche service with manager-in-place.
              </li>
            </ul>
          </FadeUp>
        </div>

        {/* Right column — pull-quote / metrics */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FadeUp delay={0.1}>
            <div className="rounded-sm border border-rule bg-surface-ink p-8">
              <div className="t-caption mb-4 text-fg-quiet">Target owner profit</div>
              <div
                className="tnum text-[clamp(3rem,9vw,5rem)] leading-none text-gilt"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatCurrency(b.capital.target_owner_profit_usd)}
              </div>
              <div className="t-caption mt-3 text-fg-quiet">/ year, after debt service</div>
              <div className="rule-horizontal my-7" />
              <div className="grid grid-cols-2 gap-6">
                <Stat label="Liquid" value={b.capital.liquid_usd} format="compact-usd" />
                <Stat
                  label="SBA capacity"
                  value={b.capital.borrowing_capacity_usd}
                  format="compact-usd"
                />
                <Stat
                  label="Hours / week"
                  value={b.operator_profile.hours_per_week_available}
                  format="plain"
                />
                <Stat label="Home metro" value={b.geography.home_metro.split(",")[0]} />
              </div>
              <div className="rule-horizontal my-7" />
              <p className="text-[0.84rem] leading-relaxed text-fg-quiet text-pretty">
                Rule of thumb passes:{" "}
                <span className="tnum text-fg">$140k ≤ 0.4 × $472k = $188.8k</span>.
                Tight, but within the cash-flow-match rule. Two flags carry forward into
                scoring: thin W-2 history (six months), and every open-to industry is outside
                the buyer&rsquo;s lived experience.
              </p>
            </div>
          </FadeUp>
        </aside>
      </div>
    </PageShell>
  );
}
