---
id: L004-assessment
title: Deal Assessment — L004 Gasket Replacement Savannah
note_type: deal
category: underwriting
source_url: https://www.businessbroker.net/business-for-sale/commercial-kitchen-gasket-replacement-service-savannah-georgia/1009783.aspx
source_type: due_diligence_web
license: n/a-public-record
checksum_sha256: pending
confidence: 0.55
citation:
  - L004-gasket-replacement-savannah
  - L004-dd
as_of_date: 2026-05-15
validator_id: due-diligence-researcher
status: rejected
tags: [assessment, phase-3, L004, rejected-geography-fail]
---

# Deal Assessment — L004 (Gasket Replacement, Savannah GA)

> **BROKER-PATTERN FLAG (2026-05-15):** This listing matches the Donald Webster / businessbroker.net 1.0× SDE pattern (see `search-rubric-buyer-001.md` § "Broker patterns to flag automatically"). The original rejection reason (geography) stands, but the deal's economic claims are also suspect. Even if the buyer reconsiders geography, do NOT NDA without first calling the broker to clarify what the "Asking" figure represents.

```json
{
  "listing_id": "L004",
  "buyer_id": "buyer-001",
  "score_0_100": 58,
  "fit_summary": "Compelling B2B recurring-revenue route business at an anomalously low asking price (~1x SDE), but the price anomaly itself is the biggest risk. Geography (Savannah, 4 hrs from Atlanta) is a meaningful strain on a 12-hr/wk semi-absentee buyer. If the financials hold and a manager can be identified, this is the most unusual value proposition in the discovery set.",
  "scored_at": "2026-05-15T00:00:00Z",
  "subscores": {
    "cash_flow_fit": 85,
    "operator_fit": 45,
    "geography_fit": 30,
    "industry_fit": 70,
    "deal_structure_fit": 40,
    "diligence_risk": 35
  },
  "hard_gates": {
    "target_owner_profit": "unknown",
    "financing_feasibility": "unknown",
    "license_transferability": "pass"
  },
  "diligence_packet_id": "L004-dd",
  "top_risks": [
    "Price anomaly — $314k asking for $295k CF is not rational at face value; implies hidden issue",
    "Geography — 4-hour drive from buyer's home; remote management from day one required",
    "Owner-hours and manager-in-place not disclosed; may be owner-dependent operation",
    "Key-person risk — 4 employees; technician departure could cripple route density",
    "Franchisor / competitor (Gasket Guy) in same market"
  ],
  "top_opportunities": [
    "Lowest asking price relative to CF in the entire discovery set if financials are real",
    "B2B recurring route model requires no inventory, no retail presence, low overhead",
    "Established 2015 — 10-year track record in foodservice B2B maintenance",
    "Route scalability — adding territories or technicians multiplies revenue without proportionate overhead",
    "SBA 7(a) eligible business type (if loan can be structured; asking is below $500k SBA threshold)"
  ]
}
```

## Scoring Rationale

- **cash_flow_fit (85)**: $295k SDE against $140k target is the best CF ratio in the set — IF the number is real
- **operator_fit (45)**: Buyer's skills (financial modeling, client communication) fit the administrative side; no technical background for gasket/refrigeration work is a gap
- **geography_fit (30)**: Savannah is 3.5-4 hours from Atlanta. This is the rubric's biggest miss.
- **industry_fit (70)**: B2B recurring maintenance fits the model well; not trade-licensed; not food service
- **deal_structure_fit (40)**: No seller financing disclosed; price anomaly raises structure uncertainty; SBA eligibility unclear at this listing stage
- **diligence_risk (35)**: Very high uncertainty — price anomaly, missing CF breakdown, no broker identity

## User decision (2026-05-15) — PASS

Buyer-001 passed on this listing post-GATE 3 review. Primary reason: **geography**. Savannah is 4 hours from Atlanta, and the 12-hr/wk semi-absentee operator profile cannot reliably manage a remote business from day one. The price anomaly was interesting, but not interesting enough to overcome the geography gap given the buyer's operator constraints.

`status: rejected`. `reason: geography-fail`. Not pursued.
