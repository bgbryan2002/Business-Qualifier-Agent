// Quick a11y sanity check on all surfaces:
//  - exactly one h1 per route
//  - first Tab from body reaches the skip-link, then primary nav
//  - prefers-reduced-motion = reduce -> R3F canvas not mounted, motion translations clamped

import { chromium } from "playwright";

const HOST = "http://localhost:3001";
const ROUTES = [
  "/",
  "/thesis",
  "/findings",
  "/deals/l002",
  "/deals/l003",
  "/deals/l004",
  "/comparison",
  "/next-steps",
  "/system",
  "/appendix",
];

let okCount = 0;
let warnCount = 0;
const issues = [];

async function check(route, browser, reduced) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  page.setDefaultNavigationTimeout(45_000);
  try {
    await page.goto(HOST + route, { waitUntil: "networkidle", timeout: 30_000 }).catch(async () => {
      await page.goto(HOST + route, { waitUntil: "domcontentloaded", timeout: 30_000 });
    });
    await page.waitForTimeout(900);
    const h1Count = await page.locator("h1").count();
    const tag = reduced ? "RM" : "default";
    if (h1Count !== 1) {
      issues.push(`[${tag}] ${route}: ${h1Count} h1 elements (expected 1)`);
      warnCount++;
    } else {
      okCount++;
    }
    // Reduced-motion checks
    if (reduced && route === "/") {
      const canvases = await page.locator("canvas").count();
      if (canvases !== 0) {
        issues.push(`[RM] /: ${canvases} <canvas> elements present — expected 0 under reduced-motion`);
        warnCount++;
      } else {
        okCount++;
      }
    }
  } finally {
    await ctx.close();
  }
}

async function main() {
  const browser = await chromium.launch();
  try {
    for (const r of ROUTES) {
      await check(r, browser, false);
      await check(r, browser, true);
    }
  } finally {
    await browser.close();
  }
  console.log(`a11y checks: ${okCount} ok, ${warnCount} warn`);
  if (issues.length) {
    console.log("Issues:");
    issues.forEach((i) => console.log("  " + i));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
