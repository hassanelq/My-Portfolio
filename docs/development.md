# Development and maintenance

## Local setup

Use Node.js 22 or later and npm. From the repository root:

```sh
npm ci
npm run dev
```

The default development URL is `http://localhost:3000`. No database, secrets or financial-data API key is needed for the current app. Before changing Next.js code, follow `AGENTS.md` and read the relevant installed guide in `node_modules/next/dist/docs/`.

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

`npm test` runs the pure-engine Vitest checks. A production build also checks the application compilation. In environments that block Turbopack's internal CSS-worker port, use:

```sh
npm run build -- --webpack
```

Browser checks require a completed production build and Playwright Chromium:

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright starts `next start` on port 3100 using `playwright.config.ts`; it does not build the application. Rebuild after application changes. Development uses port 3000. Scope checks to the affected behavior when appropriate:

```sh
npm run test:e2e -- tests/e2e/rent-buy.spec.ts
```

| Test area | Files |
| --- | --- |
| Lab formulas and game mathematics | `lib/math/math.test.ts` |
| Historical DCA | `lib/math/dca.test.ts`, `tests/e2e/dca.spec.ts` |
| Retirement | `lib/math/retirement.test.ts`, `tests/e2e/retirement.spec.ts` |
| Emergency fund | `lib/math/emergency.test.ts`, `tests/e2e/emergency.spec.ts` |
| Rent/buy | `lib/math/rent-buy.test.ts`, `tests/e2e/rent-buy.spec.ts` |
| Routes, content, lab and arcade interactions | `tests/e2e/portfolio.spec.ts` |

Keep test counts out of permanent documentation: they change as coverage grows. For documentation-only edits, check local links and stale references; a full browser run is unnecessary.

## Refresh historical data

Reproduce snapshots from checked-in raw inputs:

```sh
python3 scripts/import-dca-data.py
python3 scripts/import-retirement-data.py
```

Add `--download` only for an intentional source refresh. Review importer date bounds, source schemas, raw-file diffs, hashes and coverage. Update DCA first because retirement reuses its market inputs and cutoff. Then run the affected math tests and review the UI's generated counts, source notes and coverage messages.

See [data sources](data-sources.md), [DCA](tools/dca.md) and [retirement](tools/retirement.md). Refreshing a file alone does not make its manifest current; keep raw data, normalized output and manifest together. Do not fill missing observations with invented returns.

## Vercel

Import the Git repository into Vercel with the Next.js preset, Node.js 22, install command `npm ci` and build command `npm run build`. Configure the real canonical domain in `content/site.ts` and Vercel's domain settings. Analytics and Speed Insights components load in production; dashboards depend on the Vercel project configuration.

Review the preview's routes, CV downloads, external links and source notes before publishing. Deployment and domain configuration are account operations, separate from local changes. This guide does not record whether a particular commit is deployed.

## Changes to features

1. Edit the typed content/defaults or pure engine as appropriate.
2. Update the corresponding page under `docs/tools/`, `docs/quant-lab/` or `docs/arcade/`.
3. For math changes, verify independent benchmark cases and meaningful boundary cases.
4. For UI changes, check relevant keyboard/touch interactions and narrow widths.
5. For renamed routes, content IDs or assets, preserve or update links and redirects.
