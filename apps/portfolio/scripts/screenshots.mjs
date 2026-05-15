// Screenshot every portfolio surface at 1440x900 + hero mobile 375x812.
// Uses playwright from the sibling dashboard app's node_modules.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const OUT = path.join(REPO_ROOT, "obsidian-vault", "06-Portfolio", "published", "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const HOST = process.env.PORTFOLIO_HOST || "http://localhost:3001";

const SURFACES = [
  { slug: "01-hero", url: "/", waitMs: 3000 },
  { slug: "02-thesis", url: "/thesis", waitMs: 900 },
  { slug: "03-findings", url: "/findings", waitMs: 1200 },
  { slug: "04-deal-l002-negotiable", url: "/deals/l002", waitMs: 1400 },
  { slug: "05-deal-l003-future-target", url: "/deals/l003", waitMs: 1100 },
  { slug: "06-deal-l004-flagged", url: "/deals/l004", waitMs: 1600 },
  { slug: "07-comparison", url: "/comparison", waitMs: 1500 },
  { slug: "08-next-steps", url: "/next-steps", waitMs: 900 },
  { slug: "09-system", url: "/system", waitMs: 1100 },
  { slug: "10-appendix", url: "/appendix", waitMs: 900 },
];

async function shoot() {
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    page.setDefaultNavigationTimeout(90_000);
    for (const s of SURFACES) {
      const url = HOST + s.url;
      console.log(`-> ${s.slug} ${url}`);
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
      } catch (e) {
        console.warn(`  networkidle timeout, falling back to domcontentloaded`);
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
      }
      // Scroll through full document to trigger any IO-based or scroll-revealed
      // animations and let lazy assets boot, then return to top for capture.
      await page.evaluate(async () => {
        const totalH = document.body.scrollHeight;
        const step = Math.max(window.innerHeight * 0.6, 400);
        for (let y = 0; y <= totalH; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(s.waitMs);
      if (s.slug === "10-appendix") {
        await page.evaluate(() => {
          document
            .querySelectorAll('button[data-state="closed"]')
            .forEach((b) => b.click());
        });
        await page.waitForTimeout(900);
      }
      const out = path.join(OUT, `${s.slug}.png`);
      await page.screenshot({ path: out, fullPage: true });
      console.log(`   saved ${out}`);
    }
    await ctx.close();

    // Mobile hero spot-check
    const mobile = await browser.newContext({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 2,
    });
    const mPage = await mobile.newPage();
    mPage.setDefaultNavigationTimeout(60_000);
    await mPage.goto(HOST + "/", { waitUntil: "networkidle", timeout: 60_000 }).catch(async () => {
      await mPage.goto(HOST + "/", { waitUntil: "domcontentloaded", timeout: 60_000 });
    });
    await mPage.waitForTimeout(2500);
    const mOut = path.join(OUT, "01-hero-mobile.png");
    await mPage.screenshot({ path: mOut, fullPage: true });
    console.log(`   saved ${mOut}`);
    await mobile.close();
  } finally {
    await browser.close();
  }
}

shoot().catch((e) => {
  console.error(e);
  process.exit(1);
});
