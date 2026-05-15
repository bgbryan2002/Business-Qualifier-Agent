import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Self-hosted typography per PortfolioPlan §A.
 *
 * - Fraunces: variable, OPSZ + SOFT + WONK axes. Display headline.
 *   Variable axes require omitting the static `weight` field. The font carries
 *   the full weight range (100–900) when consumed as a variable font.
 * - Inter Tight: variable body.
 * - JetBrains Mono: variable tabular numerics.
 */

export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});
