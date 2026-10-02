# Historical monthly investing simulator

The owner’s latest DCA request supersedes the initial constant-growth calculator. The supplied screenshots guide the compact layout. Keep the portfolio's larger typography and existing site navigation.

## Main screen

- Heading: “What if you invested every month?” with a “What is this?” button.
- Compact controls for current savings, monthly contribution, age and target age, with editable values and plus/minus buttons. Recalculate immediately.
- “Compare with” expands a checkbox list: S&P 500, Gold and MSCI World. No annual-return fields, flat-rate input, CAC 40 or DAX. The zero-interest bank baseline is always visible.
- Hero outcome in today’s DH, with a short comparison sentence.
- Interactive chart: hover, tap or use arrow keys to show the selected assets’ values at an age. Series colors: chalk, gold, green and muted slate.
- Compact outcome table: median and 10th/90th percentile historical balances over the chosen horizon.
- “How this works” button below the results.

## Shared popups

Define the modal first in `components/ui/dialog.tsx`, then reuse it for the overview, calculation methodology and input explanations. Native dialog behavior provides focus trapping, Escape and focus restoration. Include a close icon, “Got it” button and backdrop dismissal. Long explanations scroll within the modal.

## Historical method

Read `DATA_SOURCES.md` for the exact data, units, splice and limitations. Replay complete monthly-start windows using recorded index/price levels and Moroccan CPI. Contributions arrive at month-end. Plot pointwise medians across a fixed cohort, with final P10/P90 outcomes.

The available histories differ. MSCI World is price-only; S&P 500 includes reinvested dividends. DH display assumes constant FX. Do not hard-code the reference's annualized returns, window counts, source descriptions, or links to its legal terms. Explain the method actually implemented, with current coverage/counts derived from the dataset.

## Maintenance

- `content/tools.ts`: defaults, colors, labels and source descriptions.
- `content/dca-history.json`: normalized monthly observations.
- `data/dca/raw/` and `data/dca/manifest.json`: pinned sources and hashes.
- `scripts/import-dca-data.py`: reproducible import and optional refresh.
- `lib/math/dca.ts`: calculation engine and independent benchmark tests.
