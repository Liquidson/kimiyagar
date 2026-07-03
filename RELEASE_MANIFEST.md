# KIMIYAGAR GitHub Release Manifest

## Release identity

- Release name: `KIMIYAGAR-GITHUB-RELEASE`
- Creation date: 2026-07-03
- Source: user-provided project snapshot `kimiyagar v-1-2.zip`
- Source Git branch/commit: not embedded in the uploaded snapshot; provenance must be attached by the repository owner when publishing
- Runtime version: KIMIYAGAR v1
- Release status: ready for GitHub source publication with the limitations listed below

## Included

- Modular Legacy v1 runtime: `index.html`, `css/`, `js/`, `sw.js`
- Visual assets: `assets/`؛ بنر، لوگو و پنج اینفوگرافی از `README.md` با لینک نسبی قابل مشاهده‌اند.
- Mostahsela V1 and V2 tests and Golden fixtures: `tests/`
- Public Node.js calculation-tools regression suite: `tests/calculation-tools.test.mjs`
- Project-owned Volume 2 single-file reference required by the integration test: `references/kimiyagar-v1-volume2-single-file-clean.html`
- Public documentation: `README.md`, `docs/ARCHITECTURE.md`, `docs/MIGRATION_PLAN.md`
- Release metadata and QA: `RELEASE_MANIFEST.md`, `RELEASE_QA_REPORT.md`
- Test runner metadata: `package.json`

## Release-only cleanup

The original project files were not modified. The sanitized staging copy applies these publication changes:

1. Added a public README, architecture summary, package scripts and release reports.
2. Moved the public migration plan into `docs/MIGRATION_PLAN.md`.
3. Excluded the obsolete browser-only file `js/core/calculation-tools/tests.js`.
4. Replaced it with `tests/calculation-tools.test.mjs`, which runs in Node.js and corrects three invalid test expectations:
   - `سامان` contains 5 valid letters, not 4.
   - spaces are ignored without reducing the 5-letter count.
   - a one-character Taksir Sadr cycle records one transformation, not zero.
5. Added `tests/run-all.mjs` so all public suites can run using `npm test`.

No calculation engine or application runtime behavior was changed for packaging.

## Excluded

- `.git/` and repository history
- `.claude/`, `CLAUDE.md`, `Instructions.md`, `models.md`, `claude-skills.md`
- Internal AI governance prompts and local runtime settings
- Rollback archives, governance archives and previous ZIP files
- `backup-before-final-modularization/`, `original/`, broken/restoration HTML copies
- `debug.log` and local verification logs
- Internal stabilization, audit and implementation reports not intended for public users
- `graphify-out/` and `graphify_ast.py` because the generated graph is stale, contains backup/internal-file nodes and includes machine-specific metadata
- Graphify caches and AST/semantic caches
- Private books, author PDFs and algorithm-source PDFs
- `node_modules/`, build output, coverage output and temporary directories

## Test summary

| Suite | Total | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
| Mostahsela V1 | 20 | 20 | 0 | 0 |
| Golden regression | 15 | 15 | 0 | 0 |
| Mostahsela V2 | 16 | 16 | 0 | 0 |
| V2 auto-spacing | 3 | 3 | 0 | 0 |
| Volume 2 integration | 9 | 9 | 0 | 0 |
| Calculation tools | 45 | 45 | 0 | 0 |
| **Total** | **108** | **108** | **0** | **0** |

## Known limitations

- The separate React/TypeScript v2 workspace was not present in the uploaded source snapshot, so it is not included.
- Browser automation could not navigate to local URLs in the execution environment because navigation was blocked by the platform administrator. Browser smoke is therefore marked pending, not passed.
- Local HTTP serving and all 45 local HTML assets were verified with HTTP 200 responses.
- The Service Worker is minimal and does not implement full offline caching or installable-PWA behavior.
- Google Fonts require network access; system fallback fonts are used when unavailable.
- No software license was present in the source snapshot. Users must not assume reuse rights.
- Git source commit information was not available inside the uploaded ZIP.

## Archive structure

- Final archive entries: 79 files
- Top-level directory: `KIMIYAGAR-GITHUB-RELEASE/`
- ZIP entry separators: portable POSIX `/`
- Forbidden archive contents detected: 0

## Archive checksum

The finalized ZIP SHA-256 is supplied beside the downloadable archive and in the assistant delivery message. A ZIP cannot reliably embed its own final checksum without changing the archive and invalidating that checksum.
