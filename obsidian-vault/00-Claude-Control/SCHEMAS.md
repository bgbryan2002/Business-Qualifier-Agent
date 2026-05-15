---
id: schemas
title: Schemas
note_type: validation
category: automation
source_url: internal
source_type: github_repo
license: n/a-public-record
checksum_sha256: pending
confidence: 1.0
citation:
  - kickoff-prompt-section-7
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted
tags: [control, schemas]
---

# Schemas

JSON-Schema-style definitions for every structured artifact produced in this project. Subagents validate against these before handing off to `vault-librarian`.

## frontmatter-contract

Every external artifact in `obsidian-vault/` (outside `99-Human/`) must carry this YAML frontmatter:

```yaml
id: <stable-slug>
title: <human-readable>
note_type: skill | buyer | deal | due-diligence | dashboard | portfolio | validation | research
category: <accounting|legal|underwriting|ui|animation|research|automation|business-profile>
source_url: <canonical>
source_repo: <owner/repo if github>             # optional for non-github sources
source_type: github_repo | official_docs | broker_export | user_upload | due_diligence_web
license: <SPDX id or 'unverified' or 'n/a-public-record'>
checksum_sha256: <of ingested files concatenated>
confidence: <0..1>
citation:
  - <list of source identifiers>
as_of_date: <YYYY-MM-DD>
validator_id: <agent name>
status: accepted | accepted-with-flags | rejected
tags: [...]
```

## BuyerProfile

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "id": "BuyerProfile",
  "type": "object",
  "required": ["id", "as_of_date", "capital", "operator_profile", "geography", "industry_preferences", "deal_constraints"],
  "properties": {
    "id":           { "type": "string" },
    "as_of_date":   { "type": "string", "format": "date" },
    "capital": {
      "type": "object",
      "required": ["liquid_usd", "borrowing_capacity_usd", "target_owner_profit_usd"],
      "properties": {
        "liquid_usd":              { "type": "number", "minimum": 0 },
        "borrowing_capacity_usd":  { "type": "number", "minimum": 0 },
        "target_owner_profit_usd": { "type": "number", "minimum": 0 },
        "sba_eligibility":         { "type": "string", "enum": ["likely", "unlikely", "unknown"] }
      }
    },
    "operator_profile": {
      "type": "object",
      "required": ["hours_per_week_available", "involvement_level", "skills"],
      "properties": {
        "hours_per_week_available": { "type": "integer", "minimum": 0, "maximum": 80 },
        "involvement_level":        { "type": "string", "enum": ["absentee", "semi-absentee", "owner-operator", "working-owner"] },
        "skills":                   { "type": "array", "items": { "type": "string" } },
        "industries_lived":         { "type": "array", "items": { "type": "string" } }
      }
    },
    "geography": {
      "type": "object",
      "required": ["home_metro", "willing_to_relocate", "max_commute_minutes"],
      "properties": {
        "home_metro":          { "type": "string" },
        "willing_to_relocate": { "type": "boolean" },
        "max_commute_minutes": { "type": "integer", "minimum": 0 },
        "preferred_states":    { "type": "array", "items": { "type": "string" } }
      }
    },
    "industry_preferences": {
      "type": "object",
      "properties": {
        "must_have":    { "type": "array", "items": { "type": "string" } },
        "must_avoid":   { "type": "array", "items": { "type": "string" } },
        "open_to":      { "type": "array", "items": { "type": "string" } },
        "license_willingness": { "type": "string", "enum": ["any", "professional-only", "none"] }
      }
    },
    "deal_constraints": {
      "type": "object",
      "properties": {
        "min_revenue_usd":      { "type": "number" },
        "max_purchase_price":   { "type": "number" },
        "max_payback_years":    { "type": "number" },
        "min_seller_financing": { "type": "number", "minimum": 0, "maximum": 1 },
        "deal_breakers":        { "type": "array", "items": { "type": "string" } }
      }
    },
    "scoring_weights_override": {
      "type": "object",
      "description": "If a 99-Human/ note overrides scoring weights, mirror them here for traceability."
    }
  }
}
```

## SkillCandidate

```jsonc
{
  "id": "SkillCandidate",
  "required": ["slug", "category", "source_url", "license", "confidence", "validator_notes"],
  "properties": {
    "slug":            { "type": "string" },
    "category":        { "type": "string" },
    "source_url":      { "type": "string", "format": "uri" },
    "source_repo":     { "type": "string" },
    "license":         { "type": "string" },
    "checksum_sha256": { "type": "string" },
    "confidence":      { "type": "number", "minimum": 0, "maximum": 1 },
    "validator_notes": { "type": "string" },
    "rejected_reason": { "type": "string" }
  }
}
```

## ValidationRecord

```jsonc
{
  "id": "ValidationRecord",
  "required": ["artifact_id", "validator_id", "verdict", "checks", "as_of_date"],
  "properties": {
    "artifact_id":  { "type": "string" },
    "validator_id": { "type": "string" },
    "verdict":      { "type": "string", "enum": ["accepted", "accepted-with-flags", "rejected"] },
    "checks": {
      "type": "object",
      "properties": {
        "license_present":      { "type": "boolean" },
        "checksum_matches":     { "type": "boolean" },
        "source_canonical":     { "type": "boolean" },
        "citations_resolvable": { "type": "boolean" },
        "schema_valid":         { "type": "boolean" }
      }
    },
    "flags":       { "type": "array", "items": { "type": "string" } },
    "as_of_date":  { "type": "string", "format": "date" }
  }
}
```

## ListingPacket

Normalized form of a broker listing. Produced by `acquisition-analyst` from broker CSV/PDF/JSON.

```jsonc
{
  "id": "ListingPacket",
  "required": ["listing_id", "asking_price_usd", "annual_revenue_usd", "sde_or_ebitda_usd", "source"],
  "properties": {
    "listing_id":        { "type": "string" },
    "business_name":     { "type": "string" },
    "industry":          { "type": "string" },
    "naics_code":        { "type": "string" },
    "state":             { "type": "string" },
    "city":              { "type": "string" },
    "asking_price_usd":  { "type": "number" },
    "annual_revenue_usd":{ "type": "number" },
    "sde_or_ebitda_usd": { "type": "number" },
    "metric_type":       { "type": "string", "enum": ["SDE", "EBITDA", "unknown"] },
    "year_established":  { "type": "integer" },
    "employees":         { "type": "integer" },
    "real_estate":       { "type": "string", "enum": ["included", "lease", "owned-separate", "unknown"] },
    "owner_hours_per_week": { "type": "integer" },
    "license_required":  { "type": "string" },
    "broker":            { "type": "string" },
    "source": {
      "type": "object",
      "required": ["source_type", "source_url_or_path", "as_of_date"],
      "properties": {
        "source_type":        { "type": "string", "enum": ["broker_export", "user_upload", "manual_paste"] },
        "source_url_or_path": { "type": "string" },
        "as_of_date":         { "type": "string", "format": "date" }
      }
    },
    "raw_text": { "type": "string", "description": "Original listing prose for audit." }
  }
}
```

## DueDiligencePacket

Lane-B research output, attached 1:1 to a `DealAssessment`.

```jsonc
{
  "id": "DueDiligencePacket",
  "required": ["listing_id", "as_of_date", "researcher_id", "claims"],
  "properties": {
    "listing_id":   { "type": "string" },
    "as_of_date":   { "type": "string", "format": "date" },
    "researcher_id":{ "type": "string" },
    "claims": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["category", "claim", "source_url", "retrieved_at", "confidence"],
        "properties": {
          "category":     { "type": "string", "enum": ["registry", "court", "reviews", "news", "licensing", "operator-track-record", "competitive-density", "regulatory", "owned-web-presence"] },
          "claim":        { "type": "string" },
          "source_url":   { "type": "string", "format": "uri" },
          "retrieved_at": { "type": "string", "format": "date-time" },
          "confidence":   { "type": "number", "minimum": 0, "maximum": 1 },
          "note":         { "type": "string" }
        }
      }
    },
    "red_flags":        { "type": "array", "items": { "type": "string" } },
    "follow_up_actions":{ "type": "array", "items": { "type": "string" } }
  }
}
```

## DealAssessment

```jsonc
{
  "id": "DealAssessment",
  "required": ["listing_id", "buyer_id", "score_0_100", "fit_summary", "scored_at", "hard_gates"],
  "properties": {
    "listing_id":   { "type": "string" },
    "buyer_id":     { "type": "string" },
    "score_0_100":  { "type": "number", "minimum": 0, "maximum": 100 },
    "fit_summary":  { "type": "string" },
    "scored_at":    { "type": "string", "format": "date-time" },
    "subscores": {
      "type": "object",
      "properties": {
        "cash_flow_fit":       { "type": "number" },
        "operator_fit":        { "type": "number" },
        "geography_fit":       { "type": "number" },
        "industry_fit":        { "type": "number" },
        "deal_structure_fit":  { "type": "number" },
        "diligence_risk":      { "type": "number" }
      }
    },
    "hard_gates": {
      "type": "object",
      "required": ["target_owner_profit", "financing_feasibility", "license_transferability"],
      "properties": {
        "target_owner_profit":      { "type": "string", "enum": ["pass", "fail", "unknown"] },
        "financing_feasibility":    { "type": "string", "enum": ["pass", "fail", "unknown"] },
        "license_transferability":  { "type": "string", "enum": ["pass", "fail", "unknown"] }
      }
    },
    "diligence_packet_id": { "type": "string" },
    "top_risks":           { "type": "array", "items": { "type": "string" } },
    "top_opportunities":   { "type": "array", "items": { "type": "string" } }
  }
}
```

## EntityAdvisory

```jsonc
{
  "id": "EntityAdvisory",
  "required": ["listing_id", "buyer_id", "options_considered", "human_signoff_required"],
  "properties": {
    "listing_id": { "type": "string" },
    "buyer_id":   { "type": "string" },
    "options_considered": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "structure":      { "type": "string", "enum": ["LLC", "S-Corp", "C-Corp", "asset-purchase", "stock-purchase", "holding-LLC-with-opco"] },
          "rationale":      { "type": "string" },
          "tradeoffs":      { "type": "array", "items": { "type": "string" } },
          "open_questions_for_advisor": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "human_signoff_required": { "type": "boolean", "const": true },
    "signoff_checklist_path": { "type": "string" }
  }
}
```

## DashboardPlan

```jsonc
{
  "id": "DashboardPlan",
  "required": ["routes", "components", "motion_budget", "accessibility_notes"],
  "properties": {
    "routes":             { "type": "array", "items": { "type": "object" } },
    "components":         { "type": "array", "items": { "type": "object" } },
    "motion_budget":      { "type": "object" },
    "accessibility_notes":{ "type": "array", "items": { "type": "string" } }
  }
}
```

## PortfolioPlan

```jsonc
{
  "id": "PortfolioPlan",
  "required": ["aesthetic_direction", "narrative_structure", "motion_budget", "asset_pipeline"],
  "properties": {
    "aesthetic_direction": {
      "type": "object",
      "properties": {
        "typography": { "type": "object" },
        "palette":    { "type": "object" },
        "motion_language": { "type": "string" }
      }
    },
    "narrative_structure": { "type": "array", "items": { "type": "string" } },
    "motion_budget":       { "type": "object" },
    "asset_pipeline":      { "type": "array", "items": { "type": "object" } }
  }
}
```

## VaultWriteReport

Returned by `vault-librarian` after each write batch.

```jsonc
{
  "id": "VaultWriteReport",
  "required": ["paths_written", "changelog_lines_appended", "commit_sha", "pushed"],
  "properties": {
    "paths_written":            { "type": "array", "items": { "type": "string" } },
    "changelog_lines_appended": { "type": "integer" },
    "commit_sha":               { "type": "string" },
    "pushed":                   { "type": "boolean" },
    "validation_errors":        { "type": "array", "items": { "type": "string" } }
  }
}
```
