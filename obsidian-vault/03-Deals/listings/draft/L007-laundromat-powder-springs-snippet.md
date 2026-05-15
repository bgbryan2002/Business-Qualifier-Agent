---
id: L007-laundromat-powder-springs-snippet
title: Laundromat — Powder Springs GA (BizBuySell Snippet)
note_type: deal
category: research
source_url: https://www.bizbuysell.com/georgia/laundromats-and-coin-laundry-businesses-for-sale/
source_type: marketplace_teaser
license: n/a-public-record
checksum_sha256: pending
confidence: 0.25
citation:
  - https://www.bizbuysell.com/georgia/laundromats-and-coin-laundry-businesses-for-sale/
as_of_date: 2026-05-15
validator_id: due-diligence-researcher
status: draft
tags: [deal, draft, phase-3, Georgia, laundromat, powder-springs, snippet-only, needs-NDA-fetch]
---

# L007 — Laundromat, Powder Springs GA (Search Snippet — Unverified)

## ListingPacket

```json
{
  "listing_id": "L007",
  "business_name": null,
  "industry": "Coin Laundry / Laundromat",
  "naics_code": "812310",
  "state": "GA",
  "city": "Powder Springs",
  "asking_price_usd": 360000,
  "annual_revenue_usd": null,
  "sde_or_ebitda_usd": 140000,
  "metric_type": "SDE",
  "year_established": null,
  "employees": null,
  "real_estate": "unknown",
  "owner_hours_per_week": null,
  "license_required": null,
  "broker": null,
  "source": {
    "source_type": "marketplace_teaser",
    "source_url_or_path": "https://www.bizbuysell.com/georgia/laundromats-and-coin-laundry-businesses-for-sale/",
    "as_of_date": "2026-05-15"
  },
  "raw_text": "Snippet from WebSearch result: 'Powder Springs, GA: $360,000 with $140,000 cash flow' — derived from Google search result snippet for BizBuySell Georgia laundromats category page. Direct URL to individual listing not captured; BizBuySell returned 403 on direct fetch.",
  "gaps_to_fill": [
    "CRITICAL: This packet is based on a Google search snippet, not a direct page fetch — confidence is low",
    "Individual listing URL not captured — BizBuySell returned HTTP 403 on direct fetch",
    "Business name not disclosed in snippet",
    "Revenue not stated",
    "Year established unknown",
    "Manager in place / semi-absentee not stated",
    "Lease terms unknown",
    "Broker name unknown",
    "Seller financing unknown",
    "This listing requires human to navigate BizBuySell manually and fetch the individual URL"
  ],
  "needs_playwright": true
}
```

## Data Provenance Warning

This packet is derived entirely from a Google search result snippet. The snippet text "Powder Springs, GA: $360,000 with $140,000 cash flow" appeared in a WebSearch response but the underlying BizBuySell listing page returned HTTP 403 Forbidden when fetched directly. The financial figures ($360k asking / $140k CF) match the buyer's rubric precisely and are worth manual follow-up, but no field in this packet should be treated as verified data.

**Set `needs_playwright: true` and `confidence: 0.25`.**

## Rubric 30-Second Filter (8 criteria — based on snippet only)

| Criterion | Status | Notes |
|---|---|---|
| 1. Atlanta metro / driveable | PASS | Powder Springs is ~30 min west of Atlanta |
| 2. Asking $250k–$550k | PASS | $360,000 (snippet) |
| 3. Revenue ≥ $250k | UNKNOWN | Not in snippet |
| 4. SDE $140k–$220k | PASS | $140,000 (snippet) — exactly at lower bound |
| 5. Semi-absentee / manager in place | UNKNOWN | Not in snippet |
| 6. Recurring revenue | LIKELY PASS | Self-service laundromat = recurring |
| 7. Years in business ≥ 5 | UNKNOWN | Not in snippet |
| 8. Seller financing ≥ 10–15% | UNKNOWN | Not in snippet |

**Rubric score: 3/8 confirmed + 5 unknown — needs human fetch to evaluate**
