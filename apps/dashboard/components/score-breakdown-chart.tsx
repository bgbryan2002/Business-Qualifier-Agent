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
  subscores: DealAssessment["subscores"];
}

const FIELDS: Array<{ key: keyof NonNullable<DealAssessment["subscores"]>; label: string }> = [
  { key: "cash_flow_fit", label: "Cash flow" },
  { key: "operator_fit", label: "Operator" },
  { key: "geography_fit", label: "Geography" },
  { key: "industry_fit", label: "Industry" },
  { key: "deal_structure_fit", label: "Structure" },
  { key: "diligence_risk", label: "Diligence" },
];

export function ScoreBreakdownChart({ subscores }: Props) {
  if (!subscores) {
    return (
      <p className="text-sm text-muted-foreground">No subscores available.</p>
    );
  }
  const data = FIELDS.map((f) => ({
    name: f.label,
    value: typeof subscores[f.key] === "number" ? (subscores[f.key] as number) : 0,
  }));
  const summary = data.map((d) => `${d.name} ${d.value}`).join(", ");
  return (
    <figure aria-labelledby="score-breakdown-caption">
      <div
        role="img"
        aria-label={`Six subscores: ${summary}. Each on a 0–100 scale.`}
        className="h-56 w-full"
      >
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={80}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              isAnimationActive={false}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption
        id="score-breakdown-caption"
        className="mt-2 text-xs text-muted-foreground"
      >
        Six subscores, each on a 0–100 scale. Higher = better fit for buyer.
      </figcaption>
      <table className="sr-only">
        <caption>Subscore breakdown (screen reader data table)</caption>
        <thead>
          <tr>
            <th scope="col">Subscore</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.name}>
              <th scope="row">{d.name}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
