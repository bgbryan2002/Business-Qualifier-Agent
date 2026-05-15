---
id: buyer-001-summary
title: Buyer 001 — Profile Summary
note_type: buyer
category: business-profile
source_url: internal
source_type: user_upload
license: n/a-public-record
checksum_sha256: pending
confidence: 0.7
citation:
  - obsidian-vault/02-Buyers/interviews/buyer-001-2026-05-14.md
  - obsidian-vault/02-Buyers/profiles/buyer-001.json
as_of_date: 2026-05-14
validator_id: buyer-profiler
status: accepted-with-flags
tags: [buyer, profile, fabricated-specifics, phase-1]
---

# Buyer 001 — Profile Summary

> *Specifics fabricated by the orchestrator under explicit human authorization. The real constraints — recent college grad, 6 months into a Big 4 consulting role, living at parents', recent new-car loan, loan-route-leveraged acquisition — are honored. Everything else (city, exact dollar amounts, industries) is a plausible reconstruction. Treat numbers as placeholders until a real interview replaces them.*

## Snapshot

22-year-old recent college graduate, six months into a Big 4 management-consulting role in Atlanta. Lives at home with parents (housing burn ≈ $0). Just financed a new car, which compresses his DTI. Has ~$22k saved and is explicitly leveraged-acquisition-minded: he's relying on SBA 7(a) + seller financing rather than personal cash. Targets a semi-absentee business he can operate ~12 hrs/wk while keeping the day job, with a 3-5 year horizon to replace consulting income. Day-job firepower: financial modeling, project management, Excel, slide-driven communication. Operational firepower: none yet — every business on his open-to list would be a first.

## Capital

| Field | Value |
|---|---|
| Liquid USD | $22,000 |
| Borrowing capacity USD | $450,000 (SBA 7(a) target — pre-qualification required) |
| Target owner profit USD | $140,000 / yr |
| SBA eligibility | likely (US citizen presumed, no bankruptcies, clean credit) |

Strategy: minimal buyer cash down (~10%), 10-20% seller note, 70-80% SBA. The math only works on deals where SDE/EBITDA comfortably covers debt service after his target owner profit.

## Operator

| Field | Value |
|---|---|
| Hours/week available | 12 |
| Involvement level | semi-absentee |
| Skills | financial modeling, Excel, PM, client communication, consulting/advisory, PowerPoint, light SQL/Python |
| Industries lived | consulting, corporate-services |

## Geography

| Field | Value |
|---|---|
| Home metro | Atlanta, GA |
| Willing to relocate | no (lives with parents) |
| Max commute (min) | 45 |
| Preferred states | GA, TN, AL, SC |

## Industry preferences

- **Must have**: absentee-friendly or strong manager-in-place, recurring revenue, owner not the sole salesperson, documented SOPs
- **Must avoid**: food service, trade-license-required (HVAC / electrical / plumbing), owner-operator model, single concentrated customer (>40%)
- **Open to**: laundromats, self-storage, car washes, vending routes, small B2B SaaS (~$200k-500k ARR), FBA e-commerce (~$300k-600k revenue), niche service businesses with manager-in-place
- **License willingness**: any (young, willing to study)

## Deal constraints

| Field | Value |
|---|---|
| Min revenue USD | $250,000 |
| Max purchase price | $550,000 |
| Max payback years | 4 |
| Min seller financing | 15% |
| Deal breakers | pending litigation; sole-key-person owner; non-transferable trade license; >25 hrs/wk owner attention; >40% customer concentration |

## Free-form context

- Works 50-60 hrs/wk at the day job; weekends and 1-2 weeknights are the realistic acquisition operating window
- Living at home → low personal burn → can survive on partial owner profit during ramp / debt-paydown
- Exit horizon from consulting: 3-5 years *if* the acquisition cashflows reliably
- Worries: financing approval with thin W-2 history; first-time operational risk; capacity to firefight if a manager-in-place quits
- Excites: building equity early, learning a real business from inside, eventual income replacement, optionality

## Consistency flags

| Check | Result | Note |
|---|---|---|
| `cash_flow_match` (target ≤ 0.4 × (liquid + borrowing)) | **PASS** | $140k ≤ 0.4 × $472k = $188.8k. Tight but within rule of thumb. |
| `hours_vs_involvement` (semi-absentee permits ~5-20 hrs/wk) | **PASS** | 12 hrs/wk fits semi-absentee comfortably. |
| `geo_vs_license` | **PASS / N/A** | license_willingness = "any"; no license-restrictive must-haves. |
| `industry_skill_gap` | **FLAG** | Every open-to industry is outside the buyer's lived experience. Doable, but raises diligence weight on existing-manager quality, operational-handoff completeness, and SOP maturity. Score these as higher `diligence_risk` until offset by listing-specific evidence. |
| `thin_w2_history` (custom, financing-feasibility) | **FLAG** | SBA underwriters typically want 2 years of stable W-2 income. Buyer has 6 months. Requires lender pre-qualification — and likely a strong personal-guaranty narrative around the parental safety net and consulting-firm earnings curve — before any LOI is credible. |

Flags are surfaced, not blocking. They feed `subscores.diligence_risk` and the `hard_gates.financing_feasibility` evaluation in `DealAssessment`.

## Open questions a human should answer before Phase 3 scoring

1. **Lender pre-qualification.** Has the buyer pinged an SBA preferred lender about the thin-W2 issue? Yes/no changes `financing_feasibility` from `unknown` to `pass`/`fail`.
2. **Parental cosigner / guaranty.** Available? If yes, expands borrowing_capacity and softens the W-2 flag.
3. **Exit-from-consulting trigger.** What concrete event (achieved owner profit run-rate, manager-in-place tenure, etc.) would prompt leaving Big 4? Useful for ranking deals on speed-to-target-profit vs. patient-equity.
4. **First-six-months operating bandwidth.** Is the 12 hrs/wk a hard cap, or can he carve out 20 hrs/wk for the first 90 days post-close? Changes the universe of acquirable businesses.
5. **Geography genuinely fixed?** Many strong SBA-friendly deals live in tier-2 cities the buyer's preferred-states list already includes (Chattanooga, Birmingham, Greenville). Confirm 45-min commute cap is from his parents' address vs. flexible if a relocation eventually makes sense.
