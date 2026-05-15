"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { DealAssessment } from "@/lib/vault";

interface Props {
  assessments: DealAssessment[];
  binSize?: number;
}

export function DealsDistributionChart({ assessments, binSize = 10 }: Props) {
  const bins: Record<string, number> = {};
  const labels: string[] = [];
  for (let i = 0; i < 100; i += binSize) {
    const label = `${i}-${i + binSize - 1}`;
    labels.push(label);
    bins[label] = 0;
  }
  let unscoredCount = 0;
  for (const a of assessments) {
    if (a.score_0_100 == null) {
      unscoredCount += 1;
      continue;
    }
    const score = Math.max(0, Math.min(99, a.score_0_100));
    const idx = Math.floor(score / binSize);
    const label = labels[idx];
    bins[label] += 1;
  }
  const data = labels.map((label) => ({ bin: label, count: bins[label] }));

  const summary = data
    .filter((d) => d.count > 0)
    .map((d) => `${d.bin}: ${d.count}`)
    .join(", ");

  return (
    <figure aria-labelledby="deals-dist-caption">
      <div
        role="img"
        aria-label={`Deal score distribution histogram (${binSize}-point bins): ${summary || "no scored deals"}. ${unscoredCount} unscored.`}
        className="h-44 w-full"
      >
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="bin"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
            />
            <YAxis
              allowDecimals={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              isAnimationActive={false}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption id="deals-dist-caption" className="mt-2 text-xs text-muted-foreground">
        Score distribution across {assessments.length} assessment
        {assessments.length === 1 ? "" : "s"}
        {unscoredCount > 0 ? ` (${unscoredCount} unscored / retracted)` : ""}.
      </figcaption>
      <table className="sr-only">
        <caption>Deal score histogram (screen reader data table)</caption>
        <thead>
          <tr>
            <th scope="col">Bin</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.bin}>
              <th scope="row">{d.bin}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
