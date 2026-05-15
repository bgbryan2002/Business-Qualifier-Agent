---
id: skill-numpy-financial
title: numpy-financial
note_type: skill
category: underwriting
source_url: https://pypi.org/project/numpy-financial/
source_repo: numpy/numpy-financial
source_type: github_repo
license: BSD-3-Clause
checksum_sha256: pending-local-install
confidence: 0.92
citation:
  - https://pypi.org/project/numpy-financial/
  - https://github.com/numpy/numpy-financial
as_of_date: 2026-05-14
validator_id: repo-validator (orchestrator-fallback)
status: accepted
tags: ['skill', 'underwriting', 'bsd-3-clause']
---

# numpy-financial

## Purpose

Primary primitives for DSCR, SBA loan payment schedules, NPV, IRR. Foundational for the scoring engine.

## Install / use

```
pip install numpy-financial
```

## License

`BSD-3-Clause` — OSI-approved permissive. Safe to ingest and vendor.

## Validator notes

> Canonical NumPy-governed library replacing deprecated numpy financial functions. Implements pv, fv, pmt, nper, rate, irr, npv, mirr — the primitives needed to compute SBA 7(a) payment schedules and DSCR from NOI. BSD-3-Clause confirmed at github.com/numpy/numpy-financial (API + web). 401 stars, pushed 2025-05-20, actively maintained. PyPI v1.0.0 stable.
