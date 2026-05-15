import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const findings = {};

async function runRoute(name, url) {
  console.log(`\n[a11y] ${url}`);
  await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 30000 });

  // Check page has exactly one h1
  const h1Count = await page.locator("h1").count();
  // Check skip link exists
  const skipLinkText = await page.locator("a:has-text('Skip to main content')").first().textContent().catch(() => null);

  // Tab a few times and check focus visibility
  await page.keyboard.press("Tab");
  const firstFocused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}:${el.textContent?.trim().slice(0, 40) ?? ""}` : "none";
  });
  await page.keyboard.press("Tab");
  const secondFocused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}:${el.textContent?.trim().slice(0, 40) ?? ""}` : "none";
  });

  // Check for figcaption near any chart svg
  const figcaptionCount = await page.locator("figcaption").count();
  const chartSvgCount = await page.locator("figure svg").count();

  // Check for sr-only data tables paired with charts
  const srOnlyTableCount = await page.locator("table.sr-only, .sr-only table").count();

  findings[name] = {
    url,
    h1Count,
    skipLinkPresent: skipLinkText !== null,
    firstFocused,
    secondFocused,
    figcaptionCount,
    chartSvgCount,
    srOnlyTableCount,
  };
  console.log(JSON.stringify(findings[name], null, 2));
}

await runRoute("home", "/");
await runRoute("deals", "/deals");
await runRoute("deal-detail", "/deals/L002");

await browser.close();

console.log("\n=== A11y sanity summary ===");
for (const [name, f] of Object.entries(findings)) {
  const checks = [
    `h1 count = ${f.h1Count} (${f.h1Count === 1 ? "OK" : "WARN"})`,
    `skip link present: ${f.skipLinkPresent}`,
    `first focus: ${f.firstFocused}`,
    `chart svg count: ${f.chartSvgCount}, figcaptions: ${f.figcaptionCount}, sr-only tables: ${f.srOnlyTableCount}`,
  ];
  console.log(`[${name}] ${checks.join(" | ")}`);
}
