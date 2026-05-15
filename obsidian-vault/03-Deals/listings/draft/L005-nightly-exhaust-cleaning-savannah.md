---
id: L005-nightly-exhaust-cleaning-savannah
title: Nightly Commercial Exhaust Cleaning — Savannah GA
note_type: deal
category: research
source_url: https://www.businessbroker.net/business-for-sale/nightly-commercial-services-with-repeat-accounts-savannah-georgia/1009607.aspx
source_type: marketplace_teaser
license: n/a-public-record
checksum_sha256: pending
confidence: 0.30
citation:
  - https://www.businessbroker.net/business-for-sale/nightly-commercial-services-with-repeat-accounts-savannah-georgia/1009607.aspx
  - https://www.businessbroker.net/city/savannah-ga-businesses-for-sale.aspx
as_of_date: 2026-05-15
validator_id: due-diligence-researcher
status: draft
tags: [deal, draft, phase-3, Georgia, Savannah, cleaning, exhaust-cleaning, low-confidence, price-anomaly]
---

# L005 — Nightly Commercial Exhaust Cleaning (Savannah, GA)

## ListingPacket

```json
{
  "listing_id": "L005",
  "business_name": "Nightly Commercial Services With Repeat Accounts",
  "industry": "Commercial Exhaust System Cleaning",
  "naics_code": "561720",
  "state": "GA",
  "city": "Savannah",
  "asking_price_usd": 28900,
  "annual_revenue_usd": 1948332,
  "sde_or_ebitda_usd": 401332,
  "metric_type": "SDE",
  "year_established": 2010,
  "employees": 6,
  "real_estate": "lease",
  "owner_hours_per_week": null,
  "license_required": null,
  "broker": null,
  "source": {
    "source_type": "marketplace_teaser",
    "source_url_or_path": "https://www.businessbroker.net/business-for-sale/nightly-commercial-services-with-repeat-accounts-savannah-georgia/1009607.aspx",
    "as_of_date": "2026-05-15"
  },
  "raw_text": "Nightly commercial services with repeat accounts. Savannah, GA. Est. 2010. Asking $28,900. Annual Revenue $1,948,332. Cash Flow $401,332. 6 employees. Not home-based, not franchise resale. Exhaust system cleaning for restaurants and commercial kitchens, work performed after hours. Recurring schedule. Clustered overnight operations allow multiple locations in a single shift.",
  "gaps_to_fill": [
    "CRITICAL: $28,900 asking price for $401k CF business is anomalous — almost certainly a partial asset sale, route rights only, or data entry error",
    "SDE at $401k on $1.9M revenue implies 20% margin — plausible for cleaning, but asking price at 0.07x CF is structurally impossible unless severely constrained",
    "No broker contact — direct seller unclear",
    "Reason for sale not stated",
    "Client contracts — month-to-month vs. annual?",
    "Owner involvement / manager in place not disclosed",
    "Geography: Savannah is 4+ hrs from Atlanta — outside buyer's commute range",
    "What exactly is being sold? The $28.9k price implies either: (a) route rights without business entity, (b) partial stake, (c) listing error"
  ],
  "needs_playwright": false
}
```

## CRITICAL ANOMALY — Price Does Not Match CF

$28,900 asking price for $401,332 annual cash flow is a 0.07x SDE multiple. Normal range for a cleaning business with this CF is 2x–3x ($800k–$1.2M). This listing is almost certainly:

1. An **asset sale of route rights only** (client list / accounts but not the operating entity)
2. A **data entry or formatting error** on the marketplace
3. A **partial stake sale** (e.g., 5% equity interest)

**Confidence set to 0.30** — the financial data as presented cannot be taken at face value. This listing requires direct seller contact before any interpretation is valid.

## Rubric 30-Second Filter (8 criteria)

| Criterion | Status | Notes |
|---|---|---|
| 1. Atlanta metro / driveable | FAIL | Savannah is ~4 hrs from Atlanta |
| 2. Asking $250k–$550k | FAIL | $28,900 is below rubric minimum |
| 3. Revenue ≥ $250k | PASS | $1,948,332 |
| 4. SDE $140k–$220k | OVER | $401,332 — above range |
| 5. Semi-absentee / manager in place | UNKNOWN | Not disclosed |
| 6. Recurring revenue | PASS | Recurring nightly schedule |
| 7. Years in business ≥ 5 | PASS | Est. 2010 = ~14 years |
| 8. Seller financing ≥ 10–15% | UNKNOWN | Not mentioned |

**Rubric score: 3/8 — below threshold; price anomaly disqualifies from top 5**
