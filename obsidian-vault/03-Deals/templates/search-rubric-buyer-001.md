---
id: search-rubric-buyer-001
title: Marketplace Search Rubric — Buyer 001
note_type: deal
category: business-profile
source_url: internal
source_repo: n/a
source_type: user_upload
license: n/a-public-record
checksum_sha256: derived-from-buyer-001
confidence: 0.85
citation:
  - obsidian-vault/02-Buyers/profiles/buyer-001.json
  - obsidian-vault/02-Buyers/profiles/buyer-001.md
as_of_date: 2026-05-14
validator_id: acquisition-analyst (orchestrator-fallback)
status: accepted
tags: [buyer, deal, search-rubric, prototype, phase-3-prep]
---

# Marketplace Search Rubric — Buyer 001

> Keep this open in a browser tab while you scroll BizBuySell, BizQuest, DealStream, brokerage sites, etc. Pre-filter at the marketplace level so the listings you click into are already "warm." Then paste the URLs of warm ones into `inputs/listings.json` and let the orchestrator do the rest.
>
> Derived from `02-Buyers/profiles/buyer-001.json`. Update this file when the buyer profile changes; don't drift them.

---

## The 30-second mental filter

A listing is worth a click if **all** of these are plausible from the teaser:

1. **Atlanta metro or driveable** (GA, TN, AL, SC — within ~3 hours of Atlanta)
2. **Asking price: $250k–$550k**
3. **Revenue: ≥ $250k/yr**
4. **SDE / EBITDA: $140k–$220k/yr** (lets debt service amortize and still leave target owner profit)
5. **Semi-absentee or "manager in place"** language anywhere in the teaser
6. **Recurring revenue, contracts, route, subscription, or repeat customer base** (not project-based one-offs)
7. **Years in business: ≥ 5** (avoid pre-revenue stories)
8. **Seller willing to finance ≥ 10–15%** (almost always mentioned in the listing details panel)

If 6 of 8 plausible → open it.
If 4 or fewer → keep scrolling.

---

## Hard "do not click" red flags in the teaser

| Phrase / signal | Why skip |
|---|---|
| "Owner is the operator" / "owner-operator required" | Buyer has a 50–60 hr/wk day job; this is a non-starter |
| "Owner is the only salesperson" | Single point of failure on revenue |
| "Trade license required" + HVAC / electrical / plumbing | Buyer has no trade background; license transfer is unrealistic |
| "Restaurant" / "food service" / "QSR" / "franchise food" | Per buyer profile must-avoid |
| "Real estate not included, separate lease required" + unclear terms | Diligence rabbit hole; revisit only if everything else is great |
| "Owner-financed only, no SBA" | SBA stack is the buyer's strategy; this kills the deal-structure-fit |
| "Confidential, broker only, $X to access" | Some are fine, but skip the ones charging an "info fee" |
| "Recently relocated" / "owner-relocating, must sell fast" without explanation | Reasons for forced sale need real diligence; the teaser-stage warmth is wrong |
| Listing price < $150k | Below the buyer's min — too small to justify operational drag |
| Listing price > $700k | SBA stack gets very hard for a thin-W2 buyer |
| "Will train new owner for 1 month" + heavily personality-driven business | Buyer-as-owner-personality risk |

---

## Broker patterns to flag automatically

Any single broker with ≥ 2 active listings showing < 1.5× SDE multiples across different industries/cities is a structural red flag. Possible causes: 'Asking' field is down-payment-only (mislabeled), NDA-harvest scam, or systematic data-entry error. Treat all listings from such broker as confidence ≤ 0.20 and status: speculative until: (a) direct broker phone call confirms what 'Asking' represents, AND (b) at least one listing from this broker has been independently verified via state Secretary of State filing.

**Known patterns as of 2026-05-15:**
- **Donald Webster / DW Marketing on businessbroker.net** — 4+ listings at 0.87–1.07× SDE across pest control, aircraft detailing, fencing, gasket replacement, across GA / TN / AL / SC. See `RUN-LOG.md` 2026-05-15 Phase 3 widened re-run entry for the discovery trail.

---

## Industries to filter INTO (use marketplace category filters)

Map directly to BizBuySell / BizQuest category checkboxes:

| Open-to industry | BizBuySell category | Notes |
|---|---|---|
| Laundromats | Coin Laundry | Strong absentee-friendly fit; look for newer machines (≤ 10 yrs) and decent lease term remaining |
| Self-storage | Self Storage / Storage Facilities | Capital-intensive land play, but high passive-management score; watch for facility-debt encumbering the deal |
| Car washes | Car Wash | Express tunnel models score better for absentee than full-serve; cap-ex schedules matter |
| Vending routes | Vending Machines / Coffee Service | Route density and machine-age the two diligence axes |
| Small B2B SaaS | Internet Businesses → SaaS / Software | $200k–$500k ARR sweet spot; watch for single-customer concentration |
| FBA e-commerce | Internet Businesses → Amazon Business | $300k–$600k revenue; SKU concentration + Amazon-account health are top risks |
| Commercial cleaning / janitorial w/ manager | Service Businesses → Cleaning | Manager-in-place is non-negotiable; route density wins |
| Landscaping w/ manager | Service Businesses → Lawn/Landscape | Same — manager-in-place; check for owner-as-foreman pattern |
| Pool service routes | Service Businesses → Pool Services | Recurring monthly revenue model; route quality matters |
| Niche route distribution (snacks/water/uniforms) | Distribution → Route Distribution | If you can find one in GA/TN at price, strong fit |

---

## Industries to FILTER OUT (uncheck or skip)

- All Food Service / Restaurants / Bars / QSR / Catering
- All Construction Trades requiring trade license (HVAC, electrical, plumbing, roofing)
- Auto Repair (specialized, owner-operator-skewed unless larger shop w/ manager)
- Auto Dealerships (capital + DMV licensing complexity beyond buyer's stack)
- Childcare / Daycare (licensing + life-safety regs heavy)
- Medical practices (license-required, owner-as-credentialed-provider)
- Anything farm / agriculture
- Anything cannabis-related (federal / banking complications + SBA exclusion)
- Anything wedding / event-driven (seasonal, personality-driven)
- Real estate (the business itself, not the underlying property — too capital-heavy)

---

## Marketplace search-form filter cheat sheet (BizBuySell)

When you're on https://www.bizbuysell.com/businesses-for-sale, set:

| Filter | Value |
|---|---|
| Location | Georgia (primary) — then add Tennessee, Alabama, South Carolina one at a time |
| Asking Price | $250,000 to $550,000 |
| Cash Flow (SDE) | $140,000 to $220,000 |
| Revenue | $250,000 minimum |
| Years Established | 5+ |
| Categories | (use the "Filter INTO" table above) |
| Keywords (one search per term) | "semi-absentee", "manager in place", "absentee owner", "recurring revenue", "monthly contracts", "route business" |
| Listing Type | For Sale by Owner *and* By Broker (both — broker listings are most of the market) |

Same drill for BizQuest, DealStream, LoopNet (for storage / car wash real estate plays).

---

## What to do when you find a "yes":

1. Copy the listing URL
2. Paste into `inputs/listings.json` (one entry per listing — JSON array of `{ "url": "...", "broker_name": "...", "notes_from_teaser": "..." }`)
3. Ask the orchestrator: *"Run Phase 3 on the new listings in inputs/listings.json"*

The agent will:

- Fetch each URL once (no bulk-scrape, no pagination loop)
- Parse out what's public into a `ListingPacket`
- Run `due-diligence-researcher` against business registries, court records, BBB, Google reviews, news, licensing DBs
- Compute the `DealAssessment` against buyer-001
- Flag anything the public teaser is hiding (broker silences, missing financials, registry-conflict)
- Surface top 5 at GATE 3 with memos + recommended next-step (NDA, LOI, pass, request docs)

For the listings worth pursuing further: request the broker's NDA, get the CIM, paste the CIM data back to refine the `ListingPacket`. Only AFTER NDA does diligence get real — public-web data is preliminary signal, not verdict.

---

## Calibration check (run this monthly)

If you're seeing zero listings clear the 30-second filter for two weeks in a row, one of these is wrong:

- **Price band is too narrow.** Widen to $200k–$650k for a month.
- **Geography is too narrow.** Add NC (Charlotte / Raleigh have good deal flow).
- **Categories are too restrictive.** Look at the "open to" list and pick one more.
- **Market is just thin right now.** Q1 + Q4 are slower; mid-Q2 and Q3 are usually richer.

If you're seeing 20+ listings clear filter per week, your rubric is too loose. Tighten the seller-financing min or the recurring-revenue requirement.
