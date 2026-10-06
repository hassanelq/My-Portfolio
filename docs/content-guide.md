# Content guide

The site's content lives in `content/`, independently of page layouts. Bare filenames below refer to `content/`; paths with directories are relative to the repository root. Save a file and the local preview updates. A Git commit records exactly what changed. No database or CMS is needed for this version.

| File in `content/`    | Edit here                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `site.ts`             | Name, description, availability, contact, canonical domain, navigation, CV paths, page introductions           |
| `portfolio.ts`        | Hero, about, skills, experience, education, certifications, honors, extracurricular roles                         |
| `projects.ts`         | Project descriptions, categories, highlights, technologies, repository/demo/report URLs and homepage selection |
| `articles.ts`         | Hassan's and Zeta's Substack profile and publication RSS feed URLs                                       |
| `tools.ts`            | Tool navigation, DCA defaults, series styles and sources                                           |
| `retirement.ts`       | FIRE planner defaults, alternative monthly contributions and research references |
| `emergency.ts`        | Emergency-fund questions, choices, scoring points, month bands and guidance source |
| `rent-buy.ts`         | Rent/buy defaults, assumption fields, limits, explanations and dated source notes |
| `dca-history.json` | Generated monthly market, bond and Moroccan/US CPI snapshot; refresh through the importer |
| `retirement-us-history.json` | Generated US retirement reference; refresh through the importer |
| `market-windows.json` | Sourced S&P 500 observations used by the chart game (see [data sources](data-sources.md))                               |

## Add a project

Add a record to `projectEntries` in `projects.ts`. Copy an existing entry to preserve its shape. `id` is the permanent URL anchor; `category` must match `categories`. Set `featured: true` to show the project on the homepage (three recommended). Omit a link when it does not exist. A private client project is labeled accordingly rather than given an invented repository URL. Project filters and counts update automatically. `realizedAt` accepts `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` and sorts the catalog and featured homepage entries newest first. Use only the date precision supported by your records; current entries have a year, so their within-year order is preserved. Repository update dates are not completion dates.

Claims and metrics originate in the owner’s supplied material and are maintained in the typed records. Review the underlying evidence when changing or publishing them. The Artisan ERP repository URL is still unknown; add its actual URL when available.

## Publish an article

Publish on Hassan's Substack; the article appears in the primary `/articles` section after the publication RSS feed refreshes (up to one hour). Hassan's feed is already configured and currently empty. Zeta's four newest posts appear separately as writing he follows. A profile URL is not itself an RSS URL; see [articles](articles.md).

## Update the CV

Replace `public/cv/hassan-elqadi-en.pdf` and `public/cv/hassan-elqadi-fr.pdf`, preserving filenames. The EN/FR control selects the download language; it does not translate the website. The served PDFs in `public/cv/` are the maintained copies; duplicate PDFs in `docs/` are not required. The former `/CV_Hassan.pdf` URL redirects to the English replacement.

## Adjust the design or calculations

- `app/globals.css`: shared design tokens, layout, component styles and breakpoints.
- `components/`: reusable UI, lab controls and arcade games.
- `lib/math/`: pure calculation functions and benchmark tests.
- `app/`: route composition and metadata.

Run `npm run typecheck` after content edits. Run `npm test` when changing calculations, and `npm run build` before deployment. Keep real data sources and illustrative assumptions clearly distinguished.

## Refresh historical DCA data

The versioned observations are in `dca-history.json`; provenance and SHA-256 hashes are in `data/dca/manifest.json`. Run `python3 scripts/import-dca-data.py` to reproduce the normalized file from pinned raw data, or add `--download` to refresh the public sources. Review coverage, upstream schemas and the configured Yahoo end-date before refreshing. No missing observations are filled with assumed returns. The current snapshot ends in June 2025. `lib/math/dca.ts` contains the rolling-window calculation and the 60/30/10 `portfolioWeights`. The allocation tooltip documents these weights; when changing them, update the label/basis/details in `content/tools.ts` and the equations and descriptions in `dca-method.tsx` and `docs/tools/dca.md`. The same math module defines `portfolioCosts` (illustrative trade fee and modeled realized-gains tax), and `portfolioWindow` tracks basis and settles monthly fees/taxes. Update the methodology and recorded result examples when these assumptions change. Bonds use VBMFX adjusted closes. US CPI reads the shared raw BLS file; see the refresh order in [development](development.md).

## Add a tool

Edit `toolCatalog` in `tools.ts` to add or rename a tool, pass its component from `app/tools/page.tsx`, then add its panel to `components/tools/tools-workspace.tsx`, using the entry’s stable ID for the tab/panel relationship. The five tools are DCA, retirement, emergency savings, rent/buy and investment fees. There are no placeholder panels. Available calculators stay mounted when switching tools, so edits and questionnaire progress are preserved. Shared currency is provided by `tools-settings.tsx` and `formatMoney` in `lib/format.ts`; use them for all money inputs, outputs and chart labels. CPI controls remain local to relevant tools through `useInflationReference`. DCA uses distinct muted asset colors (gold for gold), with patterns; other tool series use the shared design tokens; line patterns distinguish the chart comparisons.

## Maintain the rent/buy example

Edit `rent-buy.ts` for defaults and advanced assumption descriptions. The 5.18% mortgage benchmark and 1.5% home-growth starting value are dated 2025 references, not live offers or forecasts. Other numbers are illustrative. The engine in `lib/math/rent-buy.ts` uses monthly amortization, equal cash resources, symmetric investment of savings, hypothetical exit costs and inflation. See [Rent or buy?](tools/rent-or-buy.md) for the source record and complete equations. Updating a source does not automatically justify using its latest observation as a future growth forecast.

## Edit emergency-fund questions and rules

`emergency.ts` is the single source for the seven scored questions: each option has a stable value, label, detail, points and optional explanation. Questionnaire choices, result dropdowns and the methodology table all read it. The numeric spending and saved-cash fields do not add points. Month thresholds live in `emergencyBands`; self-employment has a six-month minimum in `lib/math/emergency.ts`. Keep stable IDs when changing wording, and update tests and [emergency fund](tools/emergency-fund.md) if the weights or choice counts change. This is a planning rule, not historical market data or AI. Nothing needs downloading to refresh it.

## Maintain retirement data

The FIRE planner reuses DCA’s market data and Moroccan CPI. `retirement-us-history.json` adds the longer US inflation reference from 1928. Rebuild it with `python3 scripts/import-retirement-data.py` after updating DCA data. Add `--download` to refresh the BLS CPI source, reviewing the configured end year first. Raw BLS data and source hashes are pinned in `data/retirement/`. Defaults and comparison amounts live in `retirement.ts`; withdrawal rates and worst periods are derived in `lib/math/retirement.ts`. See [retirement](tools/retirement.md) for timing, inflation and accumulation assumptions.

## Update experience and extracurricular roles

Edit `experience` or `extracurricular` in `portfolio.ts`. The six extracurricular records render automatically in the homepage’s dedicated section. Set `current: true` on the current professional role to show its label. Perenity Software is recorded as Oct 2026 — Present per the owner’s instruction; update the hero, about copy, and `site.ts` status when that changes.


## Documentation responsibilities

Runtime text comes from the TypeScript records, not Markdown. Update the related documentation when changing behavior, fields, model assumptions or source coverage. A wording-only edit does not require copying the entire content record into the docs.

- [Portfolio](portfolio.md): homepage structure and current profile context.
- [Projects](projects.md): catalog behavior, date precision and links.
- [Articles](articles.md): publishing and empty state.
- [Tools](tools/README.md): one detailed guide per calculator.
- [Quant lab](quant-lab/README.md) and [arcade](arcade/README.md): short guides for each instrument and game.

### Investment fees

Edit `content/fees.ts` for provider plans, four form templates, document dates, field lists, important fields, evidence labels and reference-only charges. Morocco includes bank/broker routes and two equity funds; France/USA are disabled. BANK OF AFRICA remains unavailable pending its securities tariff; Artbourse has indexed terms but its PDF currently returns 404. Preserve published ranges, maximums, missing costs and billing/unit assumptions. Store monetary defaults in MAD and use `useCurrencyInputs`; custody-band metadata remains canonical MAD and converts at display/calculation time. Selecting/resetting a plan restores that option, including hidden fields and clears input drafts. Three-option selection is supported. The pure monthly model and structured guide share the same records. Public PDFs and hashes are in `data/fees/`; run `node scripts/export-fee-sources.mjs` after source-data edits to regenerate research snapshots. Provider source lines use printed document dates, never retrieval dates or URL folders. See [Investment fees](tools/investment-fees.md) and [detailed source records](tools/investment-fees-sources.md).
