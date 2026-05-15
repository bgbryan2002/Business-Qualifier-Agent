---
id: L007-laundromat-powder-springs-snippet
title: Laundromat — Powder Springs GA (VERIFICATION FAILED)
note_type: deal
category: research
source_url: https://www.bizbuysell.com/georgia/laundromats-and-coin-laundry-businesses-for-sale/
source_type: marketplace_teaser
license: n/a-public-record
checksum_sha256: pending
confidence: 0.00
citation:
  - https://www.bizbuysell.com/georgia/laundromats-and-coin-laundry-businesses-for-sale/
as_of_date: 2026-05-15
validator_id: orchestrator-playwright
status: rejected
tags: [deal, draft, phase-3, Georgia, laundromat, powder-springs, verification-failed, retracted]
---

# L007 — Laundromat, Powder Springs GA — **VERIFICATION FAILED**

## Retraction notice (2026-05-15, orchestrator-playwright pass)

This listing was originally drafted from a Google search snippet by `due-diligence-researcher` with the claim: *"Powder Springs, GA: $360,000 with $140,000 cash flow"*.

On orchestrator-driven playwright verification of the cited source URL, the listing **was not found**:

- Navigated to: https://www.bizbuysell.com/georgia/laundromats-and-coin-laundry-businesses-for-sale/
- Page fully rendered (27 listings present, "Showing 27 results")
- Full-page text search: `Powder Springs` → **0 matches**
- Closest Cobb County listing on the page: "Semi-Absentee Cobb County, GA" at $175,000 / $60,000 CF — does not match the claimed $360k / $140k numbers
- No listing matching the claimed price + CF combination exists on the page

**Conclusion:** The agent's snippet was either pulled from a stale search-engine cache (listing sold/removed before the verification pass), drawn from a different source that was misattributed to BizBuySell, or hallucinated from search-result fragments. Either way, no actionable lead exists at this URL today.

## Status

- `status: rejected`
- `confidence: 0.00`
- All prior speculative fields (asking_price, sde) are retracted — they were not verifiable on the cited source.

## Audit trail

- Originally written by: `due-diligence-researcher` agent run, 2026-05-15, agentId `ae20e708337925b99`
- Retracted by: orchestrator playwright pass, 2026-05-15, see RUN-LOG.md "Phase 3 playwright verification" block
- Prior committed version: git commit `50dda6c` (preserves original draft)

## Implication

Treat *all* listings in this discovery pass with `confidence ≤ 0.30` and `source_type: marketplace_teaser` as snippet-only until directly verified. L008 (Duluth) follows the same pattern and was also verification-failed in the same pass.
