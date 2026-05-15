import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.env.OUT_DIR
  || path.resolve(process.cwd(), "..", "..", "obsidian-vault", "04-Dashboard", "screenshots");

fs.mkdirSync(OUT, { recursive: true });

const routes = [
  { slug: "home", url: "/" },
  { slug: "deals", url: "/deals" },
  { slug: "deal-L002", url: "/deals/L002" },
  { slug: "deal-L004-broker-pattern", url: "/deals/L004" },
  { slug: "deal-L007-retracted", url: "/deals/L007" },
  { slug: "buyer-001", url: "/buyers/buyer-001" },
  { slug: "skills", url: "/skills" },
  { slug: "memo-L004", url: "/memos/L004-memo" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "light",
});
const page = await context.newPage();

for (const r of routes) {
  const url = BASE + r.url;
  console.log(`[capture] ${url}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  // Give Recharts an extra moment for SVG layout
  await page.waitForTimeout(600);
  const file = path.join(OUT, `${r.slug}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`         -> ${file}`);
}

await context.close();
await browser.close();
console.log("done");
