---
id: L007-assessment
title: Deal Assessment — L007 (RETRACTED — Verification Failed)
note_type: deal
category: underwriting
source_url: https://www.bizbuysell.com/georgia/laundromats-and-coin-laundry-businesses-for-sale/
source_type: due_diligence_web
license: n/a-public-record
checksum_sha256: pending
confidence: 0.00
citation:
  - L007-laundromat-powder-springs-snippet
  - L007-dd
as_of_date: 2026-05-15
validator_id: orchestrator-playwright
status: rejected
tags: [assessment, draft, phase-3, L007, retracted, verification-failed]
---

# Deal Assessment — L007 — **RETRACTED**

The prior 71/100 score for this listing was speculative — based on an unverified search snippet rather than direct content from the cited source URL.

Playwright verification on 2026-05-15 confirmed the underlying listing **does not exist on the cited BizBuySell GA laundromat page**. The score is therefore retracted in full.

```json
{
  "listing_id": "L007",
  "buyer_id": "buyer-001",
  "score_0_100": null,
  "fit_summary": "RETRACTED — underlying listing not verifiable on cited source URL. See L007-laundromat-powder-springs-snippet.md retraction notice.",
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

- Original score: 71/100 (confidence 0.20), authored by `due-diligence-researcher` 2026-05-15
- Retracted: orchestrator-playwright pass, 2026-05-15, after live-page verification at BizBuySell
- Prior committed version: git commit `50dda6c`
