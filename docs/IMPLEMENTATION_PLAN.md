# Portfolio Rebuild — Implementation Plan

This plan replaces the current portfolio application with Hassan EL QADI's six-part quant and engineering platform. It is a build plan, not a request to preserve the current page structure or visual components.

## Approved implementation scope

The owner approved starting the rebuild with the following decisions, which supersede the earlier historical-tool and project-demo steps below:

- Adopt the supplied content for now, with typed editable records for later review.
- Replace the old CV with the English/French PDFs now in `docs/`; include an EN/FR selector.
- Show **Articles coming soon.** until Substack posts exist.
- Keep DCA simple: editable constant-return projections with explicit assumptions. Historical replay is deferred.
- Link projects to repositories and known existing demos; do not implement those project applications inside the portfolio.

The six routes, shared visual system, seven lab instruments, three arcade games, metadata, redirects, font cleanup and content guide are implemented. Publishing and the final content review remain separate steps. See `DATA_SOURCES.md` for the data and methodology used.

## 1. Product and design decisions

- Use [`DESIGN.md`](DESIGN.md) as the visual reference: `#101010` canvas, `#f3f3f3` primary text, `#9c9c9c` secondary text, `#212121` hairline borders, generous editorial spacing, and 400-weight display typography. Use Hassan's name and content throughout; the Hyperstudio names and examples are reference material only.
- The newer design direction takes precedence over older cream panels, bright blue accents, gradients, and hard shadows in the feature specs. Retain the **information and interactions** from those specs, but redraw them in the new system. Semantic chart colors may be used where a legend or risk state needs clear distinction; ordinary icons stay chalk or compass gold.
- Use the approved `docs/Fonts/Aeonik-fontiko/Aeonik-Regular.ttf` and `docs/Fonts/Input-Regular/web/font/Input-Regular.woff2` with `next/font/local`. Copy them into the app's font assets, verify rendering, then remove unused duplicate weights, preview fonts, demo files, and legacy web formats from `docs/Fonts`. Aeonik is the primary face; Input is for metadata, labels, and numeric readouts.
- Build responsive layouts and accessible controls from the start. Preserve visible focus, keyboard operation, readable chart summaries, reduced-motion behavior, and adequate text contrast.

## 2. Routes and content

| Route | Deliverable |
| --- | --- |
| `/` | Hero with updated role and pitch; key metrics; about; skills matrix; selected projects; Finamaze and Oracle Capital experience; education, honors, CV, and direct contact. Content comes from [`portfolio-content.md`](portfolio-content.md). |
| `/projects` | Filterable catalog of the eight systems in [`projects-spec.md`](projects-spec.md). Each has a concise problem, solution, stack, evidence-backed metrics, relevant visual or interaction, and working source/demo/report links. Stable section anchors support direct links. |
| `/lab` | Seven instruments from [`quant-lab-spec.md`](quant-lab-spec.md): Black-Scholes and Greeks, Monte Carlo, efficient frontier, VaR/expected shortfall, DCF, option payoff builder, and binomial tree. Display values are computed from controls rather than copied from example screenshots. |
| `/tools` | Initial fixed-return DCA projection based on [`financial-tools-spec.md`](financial-tools-spec.md), with starting amount, monthly deposit, current age, target age, chart, nominal/real breakdown, and clear methodology. Historical replay is deferred. |
| `/arcade` | Three games from [`arcade-spec.md`](arcade-spec.md): chart Turing test, correlation guessing, and Kelly betting. Keep scoring locally in the browser. |
| `/articles` | Minimal dated list linking to canonical Substack posts, following [`articles-spec.md`](articles-spec.md). Show an honest empty state until the first article and publication URL exist. |

The global navigation covers all six routes. About and contact become sections of `/`. Redirect the existing `/about` and `/contact` URLs to their home-page sections and `/blogs` to `/articles`. Preserve existing `/projects/[id]` links with an explicit redirect map to a corresponding new project anchor or the best available destination. Do not leave outdated project pages live by accident.

## 3. Technical foundation

- Upgrade the repository in place from Next.js 14, React 18, JavaScript, and Tailwind 3 to **Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4**. Replace `next lint` with a direct ESLint command. Keep one package manager and lockfile.
- Use Vercel for branch previews and production, with local development through `next dev`. Set up build, typecheck, lint, and test checks before the first production release.
- Define the visual tokens in CSS/Tailwind once. Use small custom components for the header, footer, buttons, dividers, panels, fields, legends, and article rows. Add shadcn/ui primitives only for controls that benefit from them, such as sliders, tabs, dialogs, and accordions; style them to the design system. Use Lucide outline icons where needed.
- Keep page shells and content rendering as Server Components. Make filters, calculators, charts, and games isolated Client Components. Load expensive visual modules only when their section is needed.
- Put portfolio copy, project records, article metadata, and curated datasets in typed local files. Use pure TypeScript modules under `lib/math/` for formulas and simulations, with clear units and input bounds. Use Zod or equivalent parsing at user-input boundaries.
- Render light, precise charts with SVG. Use Canvas for dense Monte Carlo paths and arcade animations; move heavy simulations to Web Workers if they block input. Render equations with KaTeX. A large general-purpose chart library is unnecessary for the initial build.
- Use the Next.js Metadata API, generated sitemap/robots, descriptive social images, `next/image` for any retained project imagery, and Vercel Analytics/Speed Insights after consent and configuration decisions are made.
- Keep the first version database-free. The article index is a typed list of published Substack URLs. Add a service only when a feature truly needs one; a live FinBERT inference demo, for example, requires an available model endpoint rather than a fake local response.

## 4. Implementation sequence

### Phase A — Audit and source-of-truth cleanup

1. Inventory current assets, links, CV, project URLs, and legacy routes; identify what can be reused.
2. Reconcile the older docs with `DESIGN.md` and this plan, including the six-route navigation and the selected framework version. Treat example metrics and chart values as specifications to verify, not as validated facts.
3. Create typed content models and a checklist of claims requiring evidence: dates, employment, competition results, benchmark timings, user counts, model scores, and live demo status.
4. Identify the exact historical market, dividend, gold, Moroccan inflation, and (if outcomes are truly denominated in MAD) USD/MAD exchange-rate datasets needed for `/tools`. Record source, frequency, date range, and transformation rules.

**Exit:** agreed route map, design tokens, content schema, and a list of verified versus pending data.

### Phase B — App foundation and core showcase

1. Migrate dependencies and files to TypeScript and Tailwind 4; configure fonts, tokens, linting, and testing.
2. Build the global shell: responsive navigation, footer, page container, focus and motion rules, metadata, and 404 page.
3. Build `/` from the new profile content. Keep projects, experience, skills, honors, and contact data separate from layout. Update the CV asset and its link when the current CV is available.
4. Implement legacy route redirects and confirm old links still reach a meaningful destination.

**Exit:** the new home page and navigation work on desktop and mobile, with no old student/internship copy visible.

### Phase C — Projects and articles

1. Build `/projects` with eight records, category filters, stable anchors, and one shared project presentation component.
2. Use lightweight static SVG project illustrations. Link to repositories and existing external demos; do not rebuild project applications here.
3. Build `/articles` as the editorial list. Keep published posts on Substack, sort the local index newest first, and include the empty state until posts exist.

**Exit:** all links and filters work; every published claim and interactive label reflects what the project actually provides.

### Phase D — Quant Lab

1. Implement and test shared normal-distribution, Black-Scholes, random-sampling, portfolio, risk, DCF, payoff, and binomial-tree functions before connecting UI controls.
2. Build the seven instruments with validated ranges, sensible defaults, explicit units, and explanatory chart legends.
3. Cover edge cases such as zero time to expiry, zero volatility, invalid DCF growth/WACC combinations, unsupported option strategies, and simulation variability. Use repeatable random seeds in tests.
4. Measure UI responsiveness for 1,000 Monte Carlo paths and 2,500 portfolio points; offload work only where measurement shows a need.

**Exit:** benchmark test cases pass and changing a control updates both values and visuals consistently.

### Phase E — Financial tool and arcade

1. Build the initial DCA engine from editable constant nominal annual assumptions. Show monthly compounding, end-of-month contributions, inflation-adjusted values, and a nominal/real breakdown. Do not display historical percentiles.
2. Label MAD as the projection unit and explain that currency movements, taxes and fees are excluded. Historical FX/inflation datasets belong to a later historical edition. Expose the current assumptions in “How this works.”
3. Build the three arcade games, including source-backed market windows for the chart test, scoring and lives for correlation, and a fair Kelly comparison using the same flip sequence. Keep localStorage data limited to game scores/preferences.

**Exit:** calculations and game rules match their written methodology; data sources and limitations are visible to users.

### Phase F — Quality, review, and release

1. Run typecheck, ESLint, Vitest math tests, targeted Playwright flows, and a production build. Check mobile navigation, keyboard controls, canvas alternatives, and external links.
2. Inspect each route at mobile, tablet, and desktop widths. Measure page weight and Core Web Vitals; fix large client bundles and slow simulations.
3. Review the Vercel preview with the final copy, CV, project links, article state, and sourced datasets. Publish to production after the preview is approved.

**Exit:** all six routes are complete, old URLs resolve, production checks pass, and no unverified metric or sample article is presented as real.

## 5. Inputs that can arrive during the build

- Updated CV and any preferred final wording for role, availability, and contact CTAs.
- Verified project repositories, live URLs, reports, metrics, and permitted visual assets.
- Historical dataset choices and methodology decisions for the DCA comparison and chart Turing test.
- Substack publication URL and article metadata when the first posts are published.

These inputs do not block building the shared design, home page, projects structure, lab, arcade mechanics, or the articles empty state.


## Local verification

- Six routes implemented; responsive smoke checks cover desktop, tablet, and mobile.
- 16 benchmark and edge-case calculation tests.
- 9 browser flows cover routes, CV languages, redirects, mobile navigation, filters, lab updates, DCA and arcade scoring.
- TypeScript and ESLint checks. Production compilation verified with Next.js Webpack after the local sandbox blocked Turbopack’s internal CSS-worker port.
- Typography enlarged following the owner’s preview feedback.
- Owner still controls the final content review and publishing. No production deployment was performed.
