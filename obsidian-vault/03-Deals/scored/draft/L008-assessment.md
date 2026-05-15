---
id: L008-assessment
title: Deal Assessment — L008 (RETRACTED — Verification Failed)
note_type: deal
category: underwriting
source_url: https://www.bizbuysell.com/georgia/atlanta-metro-area/laundromats-and-coin-laundry-businesses-for-sale/
source_type: due_diligence_web
license: n/a-public-record
checksum_sha256: pending
confidence: 0.00
citation:
  - L008-laundromat-duluth-snippet
  - L008-dd
as_of_date: 2026-05-15
validator_id: orchestrator-playwright
status: rejected
tags: [assessment, draft, phase-3, L008, retracted, verification-failed]
---

# Deal Assessment — L008 — **RETRACTED**

The prior 68/100 score for this listing was speculative — based on an unverified search snippet. Playwright verification confirmed the underlying listing **does not exist on the cited BizBuySell Atlanta-metro laundromat page**. The score is retracted in full.

```json
{
  "listing_id": "L008",
  "buyer_id": "buyer-001",
  "score_0_100": null,
  "fit_summary": "RETRACTED — underlying listing not verifiable on cited source URL.",
  "scored_at": "2026-05-15T00:00:00Z",
  "hard_gates": {
    "target_owner_profit": "unknown",
    "financing_feasibility": "unknown",
    "license_transferability": "unknown"
  },
  "status": "retracted",
  "retraction_reason": "verification_failed_via_playwright"
}
```

## Audit trail

- Original score: 68/100 (confidence 0.20), authored by `due-diligence-researcher` 2026-05-15
- Retracted: orchestrator-playwright pass, 2026-05-15
- Prior committed version: git commit `50dda6c`
