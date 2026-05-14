---
id: skill-playwright
title: Playwright (Claude Code plugin)
note_type: skill
category: research
source_url: https://claude.com/plugins/playwright
source_repo: microsoft/playwright
source_type: official_docs
license: Apache-2.0
checksum_sha256: pending-local-install
confidence: 0.95
citation:
  - https://claude.com/plugins/playwright
  - https://github.com/microsoft/playwright/blob/main/LICENSE
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted
tags: [skill, plugin, research, browser-automation, tier-1]
---

# Playwright

Browser automation. Used for: rendering and reading public diligence pages, screenshotting our own dashboard / portfolio for `04-Dashboard/screenshots/` and `06-Portfolio/published/screenshots/`, and end-to-end smoke tests.

## Authorized uses (Lane B due-diligence)

- Render JS-heavy public registry pages (Secretary of State portals, court records)
- Screenshot review pages (BBB, Yelp, Google Maps) for evidence in `DueDiligencePacket`
- Capture business website snapshots
- Pull licensing-database query results

## Hard restrictions

- **No marketplace scraping** (BizBuySell, BizQuest, broker portals). Listings flow in via importer only.
- **Respect robots.txt and ToS**. If a site disallows automated access, stop and log to `RUN-LOG.md`.
- Throttle to <1 req/sec per host. Bulk crawling is not in scope.
- For paywalled / login-required pages, only operate with explicit human-supplied credentials.

## How subagents invoke it

- `due-diligence-researcher`: primary user; produces `DueDiligencePacket.claims[]` with screenshot evidence
- `dashboard-builder` (Phase 4): screenshots `/`, `/deals`, one deal detail page
- `portfolio-designer` (Phase 5): screenshots every portfolio surface
- Optional: end-to-end smoke tests (`npm run e2e`) after dashboard build

## License

Apache-2.0 — verified at https://github.com/microsoft/playwright/blob/main/LICENSE
