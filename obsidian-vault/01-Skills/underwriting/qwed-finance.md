---
id: skill-qwed-finance
title: qwed-finance
note_type: skill
category: underwriting
source_url: https://github.com/QWED-AI/qwed-finance
source_repo: QWED-AI/qwed-finance
source_type: github_repo
license: Apache-2.0
checksum_sha256: pending-local-install
confidence: 0.65
citation:
  - https://github.com/QWED-AI/qwed-finance
  - https://github.com/QWED-AI/qwed-finance
as_of_date: 2026-05-14
validator_id: repo-validator (orchestrator-fallback)
status: accepted-with-flags
tags: ['skill', 'underwriting', 'apache-2-0', 'low-confidence', 'low-stars-confirm-provenance']
---

# qwed-finance

## Purpose

Symbolic-math verification layer for NPV/IRR/amortization correctness. Use as a test oracle, not a production dependency, until provenance is confirmed.

## Install / use

```
(verify Apache-2.0 LICENSE file before installing)
```

## License

`Apache-2.0` — OSI-approved permissive with patent grant. Safe to ingest and vendor. Preserve NOTICE if present.

## Validator notes

> Deterministic verification middleware for financial calculations using SymPy symbolic math. Covers NPV, IRR, loan amortization, and risk metrics (VaR, Beta, Sharpe). Useful as a correctness layer wrapping DSCR/SDE computations. Apache-2.0 confirmed via GitHub. v2.1.0 released 2026-05-02, 89 commits. Low star count (2); org account unclear lineage — validator should confirm org provenance and that Apache-2.0 LICENSE file is present and complete.

## Flags

- `low-confidence`
- `low-stars-confirm-provenance`
