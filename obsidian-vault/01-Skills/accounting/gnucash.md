---
id: skill-gnucash
title: gnucash
note_type: skill
category: accounting
source_url: https://github.com/GnuCash/gnucash
source_repo: GnuCash/gnucash
source_type: github_repo
license: GPL-2.0-or-later
checksum_sha256: pending-local-install
confidence: 0.82
citation:
  - https://github.com/GnuCash/gnucash
  - https://github.com/GnuCash/gnucash
as_of_date: 2026-05-14
validator_id: repo-validator (orchestrator-fallback)
status: accepted-with-flags
tags: ['skill', 'accounting', 'gpl-2-0-or-later', 'copyleft-no-vendoring']
---

# gnucash

## Purpose

Read-only ingestion target for SMB sellers who keep books in GnuCash. Use Python bindings or SQLite export.

## Install / use

```
(OS-level install; expose data via Python bindings or SQLite export)
```

## License

`GPL-2.0-or-later` — OSI-approved copyleft. External dependency only — DO NOT vendor source into apps.

## Validator notes

> Canonical OSS small-business double-entry accounting application (v5.15 March 2026, 74 releases); GPL-2.0-or-later confirmed; exposes Python bindings and XML/SQLite data formats suitable for read-only ingestion of SMB books.

## Flags

- `copyleft-no-vendoring`
