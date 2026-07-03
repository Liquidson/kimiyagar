# KIMIYAGAR v1 — Persian Letter Calculation Platform

<p align="center">
  <a href="assets/Banner/Banner.png">
    <img src="assets/Banner/Banner.png" alt="KIMIYAGAR project banner" width="100%">
  </a>
</p>

<p align="center">
  <a href="assets/logo/logo.jpg">
    <img src="assets/logo/logo.jpg" alt="KIMIYAGAR logo" width="180">
  </a>
</p>

<p align="center">
  A modular, RTL-first Persian web application for letter-based calculation methods, Mostahsela extraction, calculation utilities, result history, and offline-friendly browser use.
</p>

---

## Project Overview

KIMIYAGAR is a browser-based Persian application for structured letter calculations and extraction workflows.  
Version 1 is preserved as the current **Legacy calculation authority** and serves as the regression baseline for the ongoing incremental React and TypeScript migration.

The project is designed around three core principles:

1. **Preserve verified behavior**
2. **Modernize architecture without breaking parity**
3. **Improve the interface only after calculation parity is secured**

No calculation algorithm was changed as part of this GitHub release packaging process.

---

## Project Media

All media files are stored inside this repository and use relative GitHub-compatible links.

### Main Banner

[Open the full-resolution banner](assets/Banner/Banner.png)

### Logo

[Open the full-resolution logo](assets/logo/logo.jpg)

### Infographics

- [Infographic 1](assets/Infographic/Infographic%201.jpg)
- [Infographic 2](assets/Infographic/Infographic%202.jpg)
- [Infographic 3](assets/Infographic/Infographic%203.jpg)
- [Infographic 4](assets/Infographic/Infographic%204.jpg)
- [Infographic 5](assets/Infographic/Infographic%205.jpg)

<p align="center">
  <a href="assets/Infographic/Infographic%201.jpg">
    <img src="assets/Infographic/Infographic%201.jpg" alt="KIMIYAGAR infographic 1" width="30%">
  </a>
  <a href="assets/Infographic/Infographic%202.jpg">
    <img src="assets/Infographic/Infographic%202.jpg" alt="KIMIYAGAR infographic 2" width="30%">
  </a>
  <a href="assets/Infographic/Infographic%203.jpg">
    <img src="assets/Infographic/Infographic%203.jpg" alt="KIMIYAGAR infographic 3" width="30%">
  </a>
</p>

<p align="center">
  <a href="assets/Infographic/Infographic%204.jpg">
    <img src="assets/Infographic/Infographic%204.jpg" alt="KIMIYAGAR infographic 4" width="30%">
  </a>
  <a href="assets/Infographic/Infographic%205.jpg">
    <img src="assets/Infographic/Infographic%205.jpg" alt="KIMIYAGAR infographic 5" width="30%">
  </a>
</p>

---

## Current Release Scope

This package contains the verified KIMIYAGAR v1 modular application.

### Included capabilities

- Three active Volume 1 calculation methods
- Mostahsela Volume 1
- Mostahsela Volume 2
- Six Mostahsela modes
- Three configurable Mostahsela validation tests
- Seven shared calculation engines
- Calculation Tools Volume 1 and Volume 2
- Shared Registry-driven tool discovery
- Shared History for saved results
- Result notes
- Copy, Share, and Delete actions
- Theme switching
- Responsive RTL interface
- Animated Persian-letter background
- Input normalization and automatic letter spacing
- Golden regression fixtures
- Node.js automated test suites

### Disabled capabilities

The following options remain intentionally disabled:

- Astrology calculations
- AI-assisted reading and interpretation
- AI chat

They are not enabled or simulated in this release.

---

## Release Status

- **Current packaged version:** v1
- **Calculation authority:** Legacy modular v1
- **React/TypeScript migration:** Incremental and separate
- **Calculation parity baseline:** Preserved
- **Selected automated tests:** 108/108 passed
- **Browser smoke test:** Manual verification still required
- **Production deployment approval:** Not implied by this source package

The source snapshot used to build this public release did not contain the separate React/TypeScript v2 workspace, so v2 is not included in this archive.

---

## Running the Application

KIMIYAGAR v1 does not require a build step.

Because browsers restrict Service Workers and local module behavior on `file://` URLs, run the project through a local HTTP server.

### Python

```bash
python -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

### Node.js

Any static HTTP server can be used.

Example:

```bash
npx serve .
```

---

## Running the Tests

### Requirements

- Node.js 18 or newer

### Run all public test suites

```bash
npm test
```

### Run suites individually

```bash
npm run test:mostahsela
npm run test:golden
npm run test:mostahsela-v2
npm run test:auto-spacing
npm run test:volume2
npm run test:calculation-tools
```

### Verified results

| Test suite | Total | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
| Mostahsela V1 | 20 | 20 | 0 | 0 |
| Golden regression | 15 | 15 | 0 | 0 |
| Mostahsela V2 | 16 | 16 | 0 | 0 |
| Volume 2 auto-spacing | 3 | 3 | 0 | 0 |
| Volume 2 integration | 9 | 9 | 0 | 0 |
| Calculation tools | 45 | 45 | 0 | 0 |
| **Total** | **108** | **108** | **0** | **0** |

These results describe the selected automated suites included with this package. They do not claim complete code coverage.

---

## Project Structure

```text
index.html                  Main application entry
css/                        Modular RTL styles
js/methods/                 Three active Volume 1 methods
js/core/mostahsela/         Mostahsela Volume 1 engine
js/core/mostahsela-v2/      Mostahsela Volume 2 engine
js/core/calculation-tools/  Seven shared calculation engines
js/tools/                   UI controllers
js/ui/                      Navigation, canvas, sharing, and toast utilities
tests/                      Node.js tests and Golden fixtures
references/                 Project-owned single-file Volume 2 parity reference
assets/                     Banner, logo, infographics, and icons
docs/                       Public architecture and migration documentation
```

---

## Architecture Notes

- Calculation engines are kept separate from UI controllers.
- Volume 1 and Volume 2 share common application infrastructure.
- The Registry is the primary source of feature metadata.
- History stores calculation results, stages, and notes.
- Input normalization occurs at the UI boundary before data reaches the calculation engine.
- The public Volume 2 reference HTML is used for parity testing and is not loaded by the production runtime.
- The React and TypeScript migration must preserve exact Legacy output before any Legacy engine is retired.

See:

- [Architecture](docs/ARCHITECTURE.md)
- [Migration Plan](docs/MIGRATION_PLAN.md)
- [Release Manifest](RELEASE_MANIFEST.md)
- [Release QA Report](RELEASE_QA_REPORT.md)

---

## Privacy and Public-Release Hygiene

This public source package excludes:

- Private books and reference PDFs
- Author source material not approved for redistribution
- API keys, tokens, private keys, and credentials
- Local Claude or AI settings
- Git metadata
- Rollback archives and local snapshots
- Graphify caches
- `node_modules`
- Build output
- Machine-specific absolute paths
- Local debug files and temporary reports

The packaged application runs locally in the browser and does not require an account or backend service.

---

## Known Limitations

- Browser automation could not be completed in the packaging environment, so a final manual browser smoke test is still recommended.
- The current Service Worker is minimal and does not provide complete offline caching or formal installable-PWA behavior.
- Google Fonts require network access; system fallback fonts are used when unavailable.
- The separate v2 React/TypeScript workspace is not included in this snapshot.
- No formal software license is included.

---

## License Status

No `LICENSE` file was present in the source snapshot.

This repository does not automatically grant permission to use, modify, redistribute, or commercially exploit the code.  
A license must be selected and added by the project owner before reuse terms are formally defined.

---

## Release Documentation

- [Release Manifest](RELEASE_MANIFEST.md)
- [Release QA Report](RELEASE_QA_REPORT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Migration Plan](docs/MIGRATION_PLAN.md)

---

## Maintainer

Project repository:

```text
https://github.com/Liquidson/kimiyagar-v1
```

Maintained under the GitHub identity **Liquidson**.
