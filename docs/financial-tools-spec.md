# Financial tools

The owner’s latest DCA request supersedes the initial constant-growth calculator. The reference supplies calculation logic and useful details only. The owner requested an original layout using the portfolio design system, not the reference’s colors or composition. Keep the larger typography and existing site navigation.

## Tools workspace

- Left-hand tool list on desktop; horizontally scrollable tabs above the content on mobile.
- Four available tools: DCA simulator, Retirement Planner, Emergency Fund and Rent or Buy. The Savings Goal placeholder is removed.
- Selection updates the main panel without leaving `/tools`. Returning to a calculator preserves its inputs and settings, including incomplete emergency-fund answers.
- Keyboard arrows, Home and End navigate the tabs. The tool catalog lives in `content/tools.ts`.
- Follow `DESIGN.md`: 1200px content column, obsidian canvas, regular Aeonik headlines, Input metadata, graphite dividers, outlined fields, 4–8px corners and compass-gold icons. No green UI accents.

## Main screen

- Heading: “DCA simulator.” with a short introduction and a “What is this?” button.
- Inputs above the chart: compact controls for current savings, monthly contribution, age and target age, with editable values and plus/minus buttons. Recalculate immediately.
- “Compare with” shows inline checkboxes: S&P 500, Gold and MSCI World. No annual-return fields, flat-rate input, CAC 40 or DAX. The zero-interest bank baseline is always visible.
- Historical median outcome and selected horizon above a full-width chart.
- Interactive chart: hover, tap or use arrow keys to show the selected assets’ values at an age. Series use chalk, ash and smoke, with distinct solid/dashed/dotted patterns repeated in legends and checkboxes.
- Divided outcome table: median and lower/upper (10th/90th percentile) historical balances over the chosen horizon.
- “How this works” button below the results.

## Shared popups

Define the modal first in `components/ui/dialog.tsx`, then reuse it for the overview, calculation methodology and input explanations. Native dialog behavior provides focus trapping, Escape and focus restoration. Include a close icon, “Got it” button and backdrop dismissal. Long explanations scroll within the modal. Use the shared obsidian surface, neutral hairline border, 8px corners and white pill action; no green outline.

## Historical method

Read `DATA_SOURCES.md` for the exact data, units, splice and limitations. Replay complete monthly-start windows using recorded index/price levels and Moroccan CPI. Contributions arrive at month-end. Plot pointwise medians across a fixed cohort, with final P10/P90 outcomes.

The available histories differ. MSCI World is price-only; S&P 500 includes reinvested dividends. DH display assumes constant FX. Do not hard-code the reference's annualized returns, window counts, source descriptions, or links to its legal terms. Explain the method actually implemented, with current coverage/counts derived from the dataset.

## Maintenance

- `content/tools.ts`: tool catalog, defaults, theme-token series colors/patterns, labels and source descriptions.
- `content/dca-history.json`: normalized monthly observations.
- `data/dca/raw/` and `data/dca/manifest.json`: pinned sources and hashes.
- `scripts/import-dca-data.py`: reproducible import and optional refresh.
- `lib/math/dca.ts`: calculation engine and independent benchmark tests.

## Retirement planner

The owner’s FIRE reference supplies the functionality and explanation topics. Use the same portfolio design as DCA: inputs above results, a full-width interactive chart, graphite dividers, outlined controls and neutral series with gold icons. Do not reproduce the reference’s split-screen layout or green accents.

- Main inputs: monthly living costs, current age and retirement age. Defaults: 8,000 DH, 25 and 45.
- Advanced: existing investments (default zero), planning end age (75), historical stress test or average-return spend-down, Moroccan or US inflation.
- Show the FIRE number, monthly investment required, initial withdrawal rate, historical starts funded and retirement duration. The end age is a planning horizon, not a life-expectancy estimate.
- The default tests every complete historical retirement period and finds the capital needed to fund all of them. The rate, most demanding start and window count are computed, never copied from the reference.
- Accumulation uses the historical compound real return as a smooth estimate. Monthly contributions are constant in purchasing power, so they must increase with inflation. This differs from DCA’s fixed nominal monthly deposits.
- The chart separates estimated accumulation from withdrawals during the most demanding historical period, marks the retirement age, and exposes balances through hover, touch and keyboard controls. `components/ui/age-chart.tsx` is shared with DCA.
- Average-return mode models spending down at one constant real return, while showing how many actual historical periods its target would fund. Label this mode and its sequence-of-returns risk visibly.
- Compare 3,000 DH/month, the calculated contribution and 12,000 DH/month. Recalculate the required capital for each candidate age’s remaining retirement duration. Clicking an age applies it to the plan.
- Explain zero spending, sufficient existing investments and immediate funding shortfalls. Unsupported horizons show a coverage message, without extrapolated history.
- Reuse `Dialog` for “How much to invest?”, living costs, the retirement horizon and “How this works”. The method popup includes dynamic figures, actual dataset coverage, the longer US reference and source links.

### Retirement maintenance

- `content/retirement.ts`: defaults, comparison contributions and reference descriptions.
- `lib/math/retirement.ts`: monthly historical withdrawal engine and accumulation calculations; independent nominal-ledger benchmarks in `retirement.test.ts`.
- `content/retirement-us-history.json`: longer US market/CPI reference. Moroccan calculations reuse `dca-history.json`.
- `data/retirement/`: pinned BLS CPI and provenance manifest; market raw files are shared with DCA.
- `scripts/import-retirement-data.py`: rebuild the US reference, or refresh BLS with `--download`.
- `DATA_SOURCES.md`: exact timing, equations, source splice, limitations and reproducibility.

## Emergency fund

Use the DCA design system and shared `Dialog`. The owner explicitly requested questions with choices and numeric inputs instead of AI or a free-text description.

- Guided first pass: nine steps, comprising essential monthly spending, seven risk factors and current cash savings. One question per screen, with progress, Back and Continue controls. Choices must be explicit; spending must be positive. Cash starts at a visible, editable zero.
- Risk factors: income stability, unemployment support, dependents, home/fixed-bill burden, time to replace income, downturn exposure and required loan payments.
- The final step opens the result: 3, 6, 9 or 12 months; target in DH; the largest contributing factors; existing coverage and remaining amount to save. Self-employed users receive at least six months.
- All nine answers are editable together beneath the result. Changes recalculate immediately, without another questionnaire. Switching tools preserves progress and results. Reload clears the in-memory answers.
- The month scale is a result indicator, not a slider that bypasses the scoring rule. Progress toward the target is capped visually at 100%; extra savings are shown as a surplus.
- “How much cash?” describes the actual guided flow. “How this works” gives every choice’s points, the bands, current score and arithmetic. It distinguishes this planning heuristic from the historical simulations in the other tools.
- Give general guidance on accessible, separate bank savings and link the CFPB emergency-fund guide. Do not assume local unemployment eligibility, advertise a specific bank or copy the reference’s legal terms.
- No AI, external calculation service, database or stored personal profile. All calculations run in the browser.

### Emergency fund maintenance

- `content/emergency.ts`: question wording, choices, points, explanations, bands and source link.
- `lib/math/emergency.ts`: deterministic scoring, target, coverage and remaining savings.
- `components/tools/emergency-fund.tsx`: questionnaire, editable results and shared popups.
- `lib/math/emergency.test.ts`: boundary, validation and exhaustive choice checks.
- `tests/e2e/emergency.spec.ts`: question flow, retained state, direct edits, keyboard controls, popups and responsive layouts.

The reference supplies the month thresholds but no per-choice weights. This version defines and documents its own weights; it does not claim to reproduce the reference’s 9,072 combinations. See `DATA_SOURCES.md` for the exact table.

## Rent or buy

The fourth tool compares owning a home with renting an equivalent home and investing the difference. Six main inputs and expandable assumptions update a wealth comparison, interactive chart, monthly-cost summary, sustained break-even and exit breakdown. Both paths have equal starting resources and invest their monthly savings symmetrically. The comparison includes amortization, purchase/sale costs, maintenance, insurance, rental deposits and inflation; tax allowances are explicit.

Read [`rent-buy-spec.md`](rent-buy-spec.md) for the researched sources, dated Moroccan benchmarks, exact monthly equations, assumptions, limits and maintenance paths. This is an editable future scenario, not a replay of historical housing data. Shared chart support now covers negative wealth and a Year axis.
