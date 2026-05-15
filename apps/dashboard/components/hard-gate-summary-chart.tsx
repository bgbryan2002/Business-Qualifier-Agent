"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DealAssessment, HardGateResult } from "@/lib/vault";

interface Props {
  assessments: DealAssessment[];
}

const GATE_LABELS = {
  target_owner_profit: "Owner CF",
  financing_feasibility: "Financing",
  license_transferability: "License",
} as const;

type GateKey = keyof typeof GATE_LABELS;

export function HardGateSummaryChart({ assessments }: Props) {
  const gateKeys: GateKey[] = [
    "target_owner_profit",
    "financing_feasibility",
    "license_transferability",
  ];

  const data = gateKeys.map((key) => {
    const tally: Record<HardGateResult, number> = {
      pass: 0,
      fail: 0,
      unknown: 0,
    };
    for (const a of assessments) {
      const v = a.hard_gates[key];
      if (v === "pass" || v === "fail" || v === "unknown") tally[v] += 1;
    }
    return {
      gate: GATE_LABELS[key],
      pass: tally.pass,
      fail: tally.fail,
      unknown: tally.unknown,
    };
  });

  const summarySentence = data
    .map(
      (d) =>
        `${d.gate}: ${d.pass} pass, ${d.fail} fail, ${d.unknown} unknown`
    )
    .join("; ");

  return (
    <figure aria-labelledby="hard-gate-chart-caption">
      <div
        role="img"
        aria-label={`Hard gate summary across ${assessments.length} assessments. ${summarySentence}.`}
        className="h-56 w-full"
      >
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid
              horizontal={false}
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              allowDecimals={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="gate"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={80}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar
              dataKey="pass"
              stackId="a"
              fill="hsl(var(--positive))"
              isAnimationActive={false}
              name="Pass"
            />
            <Bar
              dataKey="fail"
              stackId="a"
              fill="hsl(var(--destructive))"
              isAnimationActive={false}
              name="Fail"
            />
            <Bar
              dataKey="unknown"
              stackId="a"
              fill="hsl(var(--muted-foreground) / 0.6)"
              isAnimationActive={false}
              name="Unknown"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption
        id="hard-gate-chart-caption"
        className="mt-2 text-xs text-muted-foreground"
      >
        Hard-gate results across {assessments.length} scored assessment
        {assessments.length === 1 ? "" : "s"}. Stacked: pass, fail, unknown.
      </figcaption>
      <table className="sr-only">
        <caption>Hard-gate counts (screen reader data table)</caption>
        <thead>
          <tr>
            <th scope="col">Gate</th>
            <th scope="col">Pass</th>
            <th scope="col">Fail</th>
            <th scope="col">Unknown</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.gate}>
              <th scope="row">{d.gate}</th>
              <td>{d.pass}</td>
              <td>{d.fail}</td>
              <td>{d.unknown}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
