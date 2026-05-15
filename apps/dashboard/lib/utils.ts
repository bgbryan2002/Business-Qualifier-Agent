import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUsd(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US").format(n);
}

export function scoreBand(score: number): "red" | "amber" | "green" | "emerald" {
  if (score < 40) return "red";
  if (score < 60) return "amber";
  if (score < 80) return "green";
  return "emerald";
}

export function scoreBandLabel(score: number): string {
  const band = scoreBand(score);
  return band === "red"
    ? "red band, low fit"
    : band === "amber"
      ? "amber band, marginal fit"
      : band === "green"
        ? "green band, good fit"
        : "emerald band, strong fit";
}

export function confidenceLabel(value: number): string {
  if (value < 0.25) return "very low";
  if (value < 0.5) return "low-medium";
  if (value < 0.75) return "medium-high";
  return "high";
}
