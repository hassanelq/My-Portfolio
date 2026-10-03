# Projects

**Route:** `/projects` · **Content:** `content/projects.ts` · **UI:** `components/projects/project-catalog.tsx` and `project-mark.tsx`.

## Catalog behavior

The catalog has nine independent records. Options pricing and Heston calibration are separate projects. Filters cover all projects, quantitative finance, AI/data science, and full-stack/systems. Entries display their date, description, highlights, technology stack and available source/demo/report links.

Sort by `realizedAt` descending. Dates support `YYYY`, `YYYY-MM` or `YYYY-MM-DD`; retain the precision supported by the owner's records. Current entries use years, so ties retain declaration order. Repository activity dates are not completion dates. The homepage uses the same sorted list, filtered by `featured`.

## Current records, in display order

| Year | Project | Stable ID | Available links |
| --- | --- | --- | --- |
| 2026 | Portfolio optimization & stress-testing | `portfolio-optimization` | GitHub |
| 2026 | Dar-Dmana Decor workshop ERP | `artisan-erp` | Private client project; no repository URL supplied |
| 2026 | STEM learning & Olympiad community | `math-platform` | GitHub; access may depend on repository visibility |
| 2025 | Options pricing | `options-pricing` | GitHub, existing demo |
| 2025 | Heston model calibration | `options-calibration` | GitHub, local research report |
| 2025 | Yield curves & interest rate swaps | `yield-curves` | GitHub |
| 2025 | Financial sentiment with FinBERT | `finbert` | GitHub, existing demo |
| 2025 | Agadir real estate valuation | `real-estate` | GitHub, existing demo |
| 2024 | Ordinals sales tracker & AMBcheck | `ordinals` | GitHub, existing demo |

The Heston ID preserves its existing public anchor. Actual URLs, stacks, highlights and optional metrics live in the records, avoiding a second copy that can drift.

## Scope and maintenance

The portfolio showcases these projects and links to their external applications. It does not embed a new Heston engine, FinBERT service, ERP or other project application. Illustrations are local presentation assets, not live backend demonstrations.

To add a project, copy a `Project` record, assign a stable ID and supported date, choose an existing category, then add only real links. `featured: true` includes it on the homepage. Filters/counts derive from the list. Preserve old anchors or update the explicit redirects in `next.config.mjs`.

The Heston report is served from `public/PFA_Calibration_Heston_Hassan_ELQADI.pdf`. External demo availability can change. Benchmarks and achievement claims come from the supplied portfolio material and require their own evidence; a link's presence is not proof of a claim or current service availability.

See [content guide](content-guide.md) for record editing and [portfolio](portfolio.md) for homepage placement.
