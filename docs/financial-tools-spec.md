# Historical monthly investing simulator

The owner’s latest DCA request supersedes the initial constant-growth calculator. The reference supplies calculation logic and useful details only. The owner requested an original layout using the portfolio design system, not the reference’s colors or composition. Keep the larger typography and existing site navigation.

## Tools workspace

- Left-hand tool list on desktop; horizontally scrollable tabs above the content on mobile.
- DCA simulator is available. Savings Goal and Retirement Planner each open a “Coming soon” panel.
- Selection updates the main panel without leaving `/tools`. Returning to DCA preserves the current inputs and comparisons.
- Keyboard arrows, Home and End navigate the tabs. The tool catalog and placeholder copy live in `content/tools.ts`.
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
