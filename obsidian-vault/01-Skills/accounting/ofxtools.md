---
id: skill-ofxtools
title: ofxtools
note_type: skill
category: accounting
source_url: https://github.com/csingley/ofxtools
source_repo: csingley/ofxtools
source_type: github_repo
license: GPL-3.0
checksum_sha256: pending-local-install
confidence: 0.68
citation:
  - https://github.com/csingley/ofxtools
  - https://github.com/csingley/ofxtools
as_of_date: 2026-05-14
validator_id: repo-validator (orchestrator-fallback)
status: accepted-with-flags
tags: ['skill', 'accounting', 'gpl-3-0', 'copyleft-no-vendoring', 'low-confidence', 'stale-pypi-release']
---

# ofxtools

## Purpose

Parse OFX bank/brokerage feed exports. Useful for add-back identification from raw bank data. Pin the version; PyPI release is stale.

## Install / use

```
pip install ofxtools
```

## License

`GPL-3.0` — OSI-approved copyleft. External dependency only — DO NOT vendor source into apps.

## Validator notes

> Python library for consuming OFXv1/v2 bank and brokerage feeds; 1004 commits, GPL-3.0 confirmed on PyPI; last PyPI release v0.9.5 (Jan 2022) is a moderate staleness flag but CI still active on GitHub; useful for ingesting SMB bank statement exports as part of add-back identification workflows.

## Flags

- `copyleft-no-vendoring`
- `low-confidence`
- `stale-pypi-release`
