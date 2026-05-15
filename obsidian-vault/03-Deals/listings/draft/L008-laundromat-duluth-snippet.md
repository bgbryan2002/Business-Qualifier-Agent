---
id: L008-laundromat-duluth-snippet
title: Laundromat — Duluth GA (BizBuySell Snippet)
note_type: deal
category: research
source_url: https://www.bizbuysell.com/georgia/atlanta-metro-area/laundromats-and-coin-laundry-businesses-for-sale/
source_type: marketplace_teaser
license: n/a-public-record
checksum_sha256: pending
confidence: 0.25
citation:
  - https://www.bizbuysell.com/georgia/atlanta-metro-area/laundromats-and-coin-laundry-businesses-for-sale/
as_of_date: 2026-05-15
validator_id: due-diligence-researcher
status: draft
tags: [deal, draft, phase-3, Georgia, laundromat, Duluth, Gwinnett, snippet-only, needs-NDA-fetch]
---

# L008 — Laundromat, Duluth GA (Search Snippet — Unverified)

## ListingPacket

```json
{
  "listing_id": "L008",
  "business_name": null,
  "industry": "Coin Laundry / Laundromat",
  "naics_code": "812310",
  "state": "GA",
  "city": "Duluth",
  "asking_price_usd": 450000,
  "annual_revenue_usd": null,
  "sde_or_ebitda_usd": 240000,
  "metric_type": "SDE",
  "year_established": null,
  "employees": null,
  "real_estate": "unknown",
  "owner_hours_per_week": null,
  "license_required": null,
  "broker": null,
  "source": {
    "source_type": "marketplace_teaser",
    "source_url_or_path": "https://www.bizbuysell.com/georgia/atlanta-metro-area/laundromats-and-coin-laundry-businesses-for-sale/",
    "as_of_date": "2026-05-15"
  },
  "raw_text": "Snippet from WebSearch result: 'Duluth, GA ($450,000 with $240,000 cash flow)' — derived from Google search result snippet for BizBuySell Georgia Atlanta Metro laundromats. Direct URL to individual listing not captured; BizBuySell returned 403 on direct fetch.",
  "gaps_to_fill": [
    "CRITICAL: Based on Google search snippet only — not direct fetch. Confidence low.",
    "Individual listing URL not captured — BizBuySell 403 on direct fetch",
    "Business name not disclosed",
    "Revenue not stated in snippet",
    "Year established unknown",
    "Manager in place not stated",
    "Lease terms unknown",
    "Broker unknown",
    "Seller financing unknown",
    "SDE of $240k is above buyer target range ($140k-$220k) — asking price may reflect this premium",
    "This listing requires human to navigate BizBuySell manually"
  ],
  "needs_playwright": true
}
```

## Data Provenance Warning

Same provenance issue as L007. Snippet-only data. The $450k asking / $240k CF figures appeared in a Google search result preview of BizBuySell's Georgia laundromat category pages. BizBuySell returned HTTP 403 on all direct fetches during this research pass.

Note: $240k CF on $450k asking = 1.88x SDE multiple — this is on the lower end for a laundromat, which might indicate older equipment or lease concerns. However it's a better multiple than market (typically 2.5x–3.5x) which warrants investigation.

## Rubric 30-Second Filter (8 criteria — snippet only)

| Criterion | Status | Notes |
|---|---|---|
| 1. Atlanta metro / driveable | PASS | Duluth is ~30 min NE of Atlanta (Gwinnett County) |
| 2. Asking $250k–$550k | PASS | $450,000 (snippet) |
| 3. Revenue ≥ $250k | UNKNOWN | Not in snippet |
| 4. SDE $140k–$220k | OVER | $240,000 is above target range — positive but may signal higher multiple |
| 5. Semi-absentee / manager in place | UNKNOWN | Not in snippet |
| 6. Recurring revenue | LIKELY PASS | Self-service laundromat |
| 7. Years in business ≥ 5 | UNKNOWN | Not in snippet |
| 8. Seller financing ≥ 10–15% | UNKNOWN | Not in snippet |

**Rubric score: 3/8 confirmed + 5 unknown — needs human fetch to evaluate**
