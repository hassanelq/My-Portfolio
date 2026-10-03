# Portfolio documentation

Current implementation, reviewed **3 October 2026**. These guides describe the application in this repository. Runtime copy and defaults live in `content/`; calculations live in `lib/math/`.

## Start here

| Guide | What it covers |
| --- | --- |
| [Design reference](DESIGN.md) | Preserved visual reference, typography, palette and readability adjustments |
| [Architecture](architecture.md) | Stack, routes, rendering, components, state and data flow |
| [Development](development.md) | Local setup, checks, dataset updates and Vercel deployment |
| [Content guide](content-guide.md) | Where and how to edit copy, projects, CVs, articles and defaults |
| [Portfolio](portfolio.md) | Homepage sections, current role and six extracurricular experiences |
| [Projects](projects.md) | Nine project records, ordering, categories and external links |
| [Articles](articles.md) | Substack RSS integration and source-switching workflow |
| [Data sources](data-sources.md) | Dataset inventory, provenance and links to each model's methodology |

## Feature documentation

### Financial tools — detailed

[Workspace and shared behavior](tools/README.md)

1. [DCA simulator](tools/dca.md) — monthly historical investing, inflation and percentile outcomes.
2. [Retirement planner](tools/retirement.md) — historical withdrawals, accumulation and alternative retirement ages.
3. [Emergency fund](tools/emergency-fund.md) — guided questions, explicit scoring and editable results.
4. [Rent or buy?](tools/rent-or-buy.md) — mortgage, housing costs, investment opportunity cost and exit wealth.

### Quant lab — concise

[Overview](quant-lab/README.md) · [Black-Scholes](quant-lab/black-scholes.md) · [Monte Carlo](quant-lab/monte-carlo.md) · [Efficient frontier](quant-lab/efficient-frontier.md) · [Value at risk](quant-lab/value-at-risk.md) · [DCF](quant-lab/dcf.md) · [Option payoffs](quant-lab/option-payoffs.md) · [Binomial tree](quant-lab/binomial-tree.md)

### Arcade — concise

[Overview](arcade/README.md) · [Chart Turing test](arcade/chart-turing-test.md) · [Guess the correlation](arcade/guess-the-correlation.md) · [Kelly criterion](arcade/kelly-criterion.md)

## Current scope

Six routes are implemented: `/`, `/projects`, `/lab`, `/tools`, `/arcade`, `/articles`. There are four active financial tools, seven lab instruments and three games. Articles reads Hassan's publication feed first and shows Zeta's four newest posts in a separate reading section. Projects link to their repositories and existing demos. English and French CVs are served from `public/cv/`.

The rebuild plans and superseded feature blueprints have been consolidated into these guides. Deployment status is managed in Vercel; this documentation does not certify a production release.

## Keeping this current

- Update the relevant feature page whenever behavior, formulas, assumptions or data coverage changes.
- Update the content guide when a content field or publishing workflow changes.
- Preserve the source dates of financial benchmarks; a documentation edit does not refresh a dataset.
- Keep detailed methods in the tool's own file. The source index points there rather than repeating the equations.
- `DESIGN.md` remains the original reference. Current portfolio overrides are summarized in [architecture](architecture.md); executable styling lives in `app/globals.css`.
