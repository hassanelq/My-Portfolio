# Editing the portfolio

The site's content lives here, independently of page layouts. Save a file and the local preview updates. A Git commit records exactly what changed. No database or CMS is needed for this version.

| File                  | Edit here                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `site.ts`             | Name, description, availability, contact, canonical domain, navigation, CV paths, page introductions           |
| `portfolio.ts`        | Hero, about, skills, experience, education, certifications, honors, extracurricular roles                         |
| `projects.ts`         | Project descriptions, categories, highlights, technologies, repository/demo/report URLs and homepage selection |
| `articles.ts`         | Substack publication URL and published article metadata                                                        |
| `tools.ts`            | Tool navigation, placeholder copy, DCA defaults, series styles and sources                                           |
| `retirement.ts`       | FIRE planner defaults, alternative monthly contributions and research references |
| `emergency.ts`        | Emergency-fund questions, choices, scoring points, month bands and guidance source |
| `market-windows.json` | Sourced S&P 500 observations used by the chart game (see `docs/DATA_SOURCES.md`)                               |

## Add a project

Add a record to `projectEntries` in `projects.ts`. Copy an existing entry to preserve its shape. `id` is the permanent URL anchor; `category` must match `categories`. Set `featured: true` to show the project on the homepage (three recommended). Omit a link when it does not exist. A private client project is labeled accordingly rather than given an invented repository URL. Project filters and counts update automatically. `realizedAt` accepts `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` and sorts the catalog and featured homepage entries newest first. Use only the date precision supported by your records; current entries mostly have a year, so their within-year order is preserved. Repository update dates are not completion dates.

Claims and metrics currently use the supplied portfolio documents, as requested. Review those before publishing. The Artisan ERP repository URL is still unknown; add its actual URL when available.

## Publish an article

1. Publish on Substack.
2. Set `publicationUrl` in `articles.ts` to your publication's real URL.
3. Add `{ title, summary, publishedAt: "YYYY-MM-DD", substackUrl }` to `articles` using the published article URL.

The list sorts newest first. With an empty array it displays **Articles coming soon.** The initial version uses a curated list, so publishing on Substack alone does not add a row automatically.

## Update the CV

Replace `public/cv/hassan-elqadi-en.pdf` and `public/cv/hassan-elqadi-fr.pdf`, preserving filenames. The EN/FR control selects the download language; it does not translate the website. Current source PDFs remain in `docs/`. The former `/CV_Hassan.pdf` URL redirects to the English replacement.

## Adjust the design or calculations

- `app/globals.css`: shared design tokens, layout, component styles and breakpoints.
- `components/`: reusable UI, lab controls and arcade games.
- `lib/math/`: pure calculation functions and benchmark tests.
- `app/`: route composition and metadata.

Run `npm run typecheck` after content edits. Run `npm test` when changing calculations, and `npm run build` before deployment. Keep real data sources and illustrative assumptions clearly distinguished.

## Refresh historical DCA data

The versioned observations are in `dca-history.json`; provenance and SHA-256 hashes are in `data/dca/manifest.json`. Run `python3 scripts/import-dca-data.py` to reproduce the normalized file from pinned raw data, or add `--download` to refresh the public sources. Review coverage, upstream schemas and the configured Yahoo end-date before refreshing. No missing observations are filled with assumed returns. The current snapshot ends in June 2025. `lib/math/dca.ts` contains the rolling-window calculation.

## Add a tool

Edit `toolCatalog` in `tools.ts` to add or rename a tool. Entries with `status: "coming-soon"` automatically get a selectable navigation item and placeholder panel. When a tool is ready, add its component and panel to `components/tools/tools-workspace.tsx`, using the entry’s stable ID for the tab/panel relationship. Available calculators stay mounted when switching tools, so edits and questionnaire progress are preserved. Series colors reference the shared design tokens; line patterns distinguish the chart comparisons.

## Edit emergency-fund questions and rules

`emergency.ts` is the single source for the seven scored questions: each option has a stable value, label, detail, points and optional explanation. Questionnaire choices, result dropdowns and the methodology table all read it. The numeric spending and saved-cash fields do not add points. Month thresholds live in `emergencyBands`; self-employment has a six-month minimum in `lib/math/emergency.ts`. Keep stable IDs when changing wording, and update tests and `docs/DATA_SOURCES.md` if the weights or choice counts change. This is a planning rule, not historical market data or AI. Nothing needs downloading to refresh it.

## Maintain retirement data

The FIRE planner reuses DCA’s market data and Moroccan CPI. `retirement-us-history.json` adds the longer US inflation reference from 1928. Rebuild it with `python3 scripts/import-retirement-data.py` after updating DCA data. Add `--download` to refresh the BLS CPI source, reviewing the configured end year first. Raw BLS data and source hashes are pinned in `data/retirement/`. Defaults and comparison amounts live in `retirement.ts`; withdrawal rates and worst periods are derived in `lib/math/retirement.ts`. See `docs/DATA_SOURCES.md` for timing, inflation and accumulation assumptions.

## Update experience and extracurricular roles

Edit `experience` or `extracurricular` in `portfolio.ts`. The six extracurricular records render automatically in the homepage’s dedicated section. Set `current: true` on the current professional role to show its label. Perenity Software is recorded as Oct 2026 — Present per the owner’s instruction; update the hero, about copy, and `site.ts` status when that changes.
