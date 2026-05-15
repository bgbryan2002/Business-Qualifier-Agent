"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { DueDiligencePacket, Memo } from "@/lib/vault";
import { cn } from "@/lib/utils";

interface Props {
  panels: Array<{
    id: string;
    title: string;
    subtitle: string;
    dd: DueDiligencePacket | null;
    memo: Memo | null;
    tone: "negotiable" | "future-target" | "flagged";
  }>;
}

const TONE_COLOR = {
  negotiable: "var(--gilt)",
  "future-target": "var(--moss)",
  flagged: "var(--rust)",
};

export function DueDiligenceAccordion({ panels }: Props) {
  return (
    <Accordion.Root type="multiple" className="space-y-px overflow-hidden rounded-sm border border-rule">
      {panels.map((p) => (
        <Accordion.Item
          key={p.id}
          value={p.id}
          className="bg-surface-ink data-[state=open]:bg-bg-elevated"
        >
          <Accordion.Header asChild>
            <h2 className="flex">
              <Accordion.Trigger
                className={cn(
                  "group flex flex-1 items-center justify-between gap-6 px-7 py-7 text-left transition-colors md:px-10",
                  "hover:bg-bg-elevated focus-visible:outline-none"
                )}
              >
                <div>
                  <div
                    className="t-caption mb-2"
                    style={{ color: TONE_COLOR[p.tone] }}
                  >
                    {p.id} · {p.subtitle}
                  </div>
                  <span className="t-h3 text-balance text-fg">{p.title}</span>
                </div>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-fg-muted transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
                />
                <span className="sr-only">
                  Toggle full due-diligence packet for {p.id}.
                </span>
              </Accordion.Trigger>
            </h2>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-out_180ms_ease-out] data-[state=open]:animate-[acc-in_220ms_ease-out]">
            <div className="border-t border-rule px-7 pb-10 pt-7 md:px-10">
              {/* Claims table */}
              {p.dd && p.dd.claims.length > 0 ? (
                <section>
                  <h3 className="t-caption text-fg-quiet">Claims</h3>
                  <table className="mt-4 w-full text-left">
                    <thead>
                      <tr className="border-b border-rule">
                        <th className="t-caption py-2">Category</th>
                        <th className="t-caption py-2">Claim</th>
                        <th className="t-caption py-2 text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.dd.claims.map((c, i) => (
                        <tr key={i} className="border-b border-rule/60 align-top">
                          <td className="py-3 pr-4 text-[0.86rem] text-fg-muted">
                            {c.category}
                          </td>
                          <td className="py-3 pr-4 text-[0.94rem] text-fg">
                            <p className="text-pretty">{c.claim}</p>
                            {c.source_url ? (
                              <a
                                href={c.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1.5 block break-all text-[0.78rem] text-fg-quiet hover:text-gilt"
                              >
                                {c.source_url}
                              </a>
                            ) : null}
                          </td>
                          <td className="tnum py-3 text-right text-[0.86rem] text-fg-muted">
                            {c.confidence.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              ) : null}

              {/* Red flags */}
              {p.dd && p.dd.red_flags.length > 0 ? (
                <section className="mt-8">
                  <h3 className="t-caption text-rust">Red flags</h3>
                  <ul className="mt-3 space-y-2.5">
                    {p.dd.red_flags.map((f, i) => (
                      <li key={i} className="t-body flex gap-3 text-fg-muted">
                        <span className="mt-2 inline-block h-[2px] w-3 shrink-0 bg-rust" aria-hidden="true" />
                        <span className="text-pretty">{f}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Follow-ups */}
              {p.dd && p.dd.follow_up_actions.length > 0 ? (
                <section className="mt-8">
                  <h3 className="t-caption text-gilt">Follow-up actions</h3>
                  <ol className="mt-3 space-y-2.5">
                    {p.dd.follow_up_actions.map((a, i) => (
                      <li key={i} className="t-body flex gap-3 text-fg-muted">
                        <span className="tnum mt-1 text-[0.82rem] text-fg-quiet">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-pretty">{a}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {/* If no DD packet, show memo if available */}
              {!p.dd && p.memo ? (
                <section>
                  <h3 className="t-caption text-fg-quiet">Acquisition memo</h3>
                  <p className="text-pretty mt-3 text-fg-muted">
                    Full memo lives in <code className="tnum">{p.memo.id}.md</code> in the
                    vault. Status: {p.memo.status}.
                  </p>
                </section>
              ) : null}

              {/* Source link */}
              {p.dd ? (
                <div className="t-caption mt-8 text-fg-quiet">
                  Retrieved · <span className="tnum text-fg-muted">{p.dd.as_of_date}</span>{" "}
                  · researcher · <span className="text-fg-muted">{p.dd.researcher_id}</span>
                </div>
              ) : null}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
      <style>{`
        @keyframes acc-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes acc-out {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-6px); }
        }
      `}</style>
    </Accordion.Root>
  );
}
