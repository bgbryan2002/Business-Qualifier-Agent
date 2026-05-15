---
id: skill-sba-7a-foia-public-data
title: sba-7a-foia-public-data
note_type: skill
category: underwriting
source_url: https://data.sba.gov/dataset/7-a-504-foia
source_repo: n/a
source_type: official_docs
license: n/a-public-record
checksum_sha256: n/a-reference
confidence: 0.82
citation:
  - https://data.sba.gov/dataset/7-a-504-foia
as_of_date: 2026-05-14
validator_id: repo-validator (orchestrator-fallback)
status: accepted
tags: ['skill', 'underwriting', 'n/a-public-record']
---

# sba-7a-foia-public-data

## Purpose

Industry-benchmark dataset: SBA 7(a)/504 approvals by NAICS, default rates, typical loan sizes. Drives the `cash_flow_fit` and `financing_feasibility` rubric calibration.

## Install / use

```
(CSV download from data.sba.gov; confirm latest as_of_date before ingestion)
```

## License

`n/a-public-record` — U.S. government work, public domain (17 U.S.C. § 105). Cite the canonical source URL when referenced.

## Validator notes

> Official U.S. Small Business Administration FOIA dataset of all 7(a) and 504 loan approvals, including loan amounts, NAICS codes, approval dates, default/charge-off status. Published by a federal agency (SBA), therefore public domain / U.S. government works (17 U.S.C. § 105). Data.gov catalog record mirrors the dataset. Useful as an industry benchmark: approval rates, typical loan sizes, default rates by NAICS. Validator should confirm direct CSV download URL and as_of_date of latest release. NOTE: data.sba.gov returned 403 in this session (host-allowlist block); URL confirmed via data.gov catalog references and SBA.gov open-data documentation.
