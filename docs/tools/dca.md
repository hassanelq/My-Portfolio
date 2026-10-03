# DCA simulator

**Workspace ID:** `dca` · **UI:** `components/tools/dca.tsx` · **Engine:** `lib/math/dca.ts`.

## Purpose and user flow

Explore what a starting investment and fixed monthly deposits would have become over past periods. The result is a historical comparison after Moroccan inflation, not a forecast at an assumed annual return.

Four editable controls update immediately. Checkboxes select S&P 500, gold and MSCI World; all three start selected. The zero-interest bank baseline remains visible. There are no editable market-return fields, flat-rate option, CAC 40 or DAX series.

| Input | Default | UI bounds | Unit |
| --- | --- | --- | --- |
| Current savings | 0 | 0–100,000,000 | DH, invested immediately |
| Per month | 1,500 | 0–1,000,000 | Fixed nominal DH, month-end |
| Your age | 23 | 18–99 | Whole years |
| Until age | 50 | Current age + 1 through 100 | Whole years |

Changing the current age keeps the horizon ordered. A permitted input horizon can still exceed a series' available history; that produces a coverage message rather than invented observations.

## Results and interactions

- Headline median balance for the selected horizon and a full-width age chart.
- Annual pointwise median values available by hover, touch or keyboard.
- Final P10, median and P90 balances for each available comparison, with coverage and window counts.
- Neutral solid/dashed/dotted series, repeated in controls and legends.
- “What is this?”, field explanations and “How this works” use shared dialogs.
- Selection and inputs persist when switching tools, then reset on reload.

## Data and calculation

Snapshot retrieved **2 October 2026**, cut off at **June 2025** because this is the last observed Moroccan monthly CPI month in the downloaded IMF series. No extrapolation is used.

| Series | Monthly observations | Basis |
| --- | --- | --- |
| S&P 500 | January 1960–June 2025; 786 levels | Shiller monthly prices/dividends, then Yahoo total-return ratios |
| Gold | January 1968–June 2025; 690 levels | World Bank USD gold price via DataHub |
| MSCI World | January 1985–June 2025; 486 levels | Yahoo `^990100-USD-STRD`, USD **price only** |
| Moroccan CPI / bank baseline | January 1960–June 2025; 786 levels | IMF IFS `M.MA.PCPI_IX` via DBnomics, monthly observations |

### Sources and reproducibility

- [Shiller / DataHub S&P 500](https://datahub.io/core/s-and-p-500): before July 2023, monthly gross-return factor is `(P[m] + annualizedDividend[m]/12) / P[m-1]`. The initial level is rebased to 100.
- [Yahoo S&P 500 Total Return Index](https://finance.yahoo.com/quote/%5ESP500TR/history/): from July 2023, chain observed month-to-month index ratios. The splice combines Shiller monthly average prices with Yahoo month-end total-return levels; it is an approximation rather than an official continuous total-return index before the splice.
- [Yahoo MSCI World index](https://finance.yahoo.com/quote/%5E990100-USD-STRD/history/): monthly closes; dividends are excluded. No ETF proxy or assumed dividend yield is substituted.
- [DataHub gold](https://datahub.io/core/gold-prices): the current source is the World Bank Pink Sheet, not LBMA. Use recorded monthly prices from 1968.
- [IMF IFS Moroccan CPI via DBnomics](https://db.nomics.world/IMF/IFS/M.MA.PCPI_IX): the retrieved series contains valid monthly observations throughout 1960–June 2025. The reference’s claim that monthly CPI starts in 2007 does not apply to this snapshot. No annual interpolation or constant 4% assumption is needed.

Raw downloads are in `data/dca/raw/`. `data/dca/manifest.json` records URLs, exact source hashes and coverage. Rebuild the normalized `content/dca-history.json` with `python3 scripts/import-dca-data.py`. The script rejects missing months or nonpositive levels. `--download` refreshes the raw inputs; review the pinned Yahoo period-end before extending the date range.

### Rolling-window calculation

For a horizon of H months and N monthly levels, replay **N − H** complete windows, each using H+1 price/CPI levels. At each step: `nominal = nominal * level[t]/level[t-1] + monthlyDeposit`. Then `real = nominal * CPI[start]/CPI[t]`. Contributions are fixed nominal amounts paid at month-end. The starting amount is invested immediately.

Use the same complete-window cohort at every plotted age; the chart is the pointwise median of annual checkpoints. It is not one particular historical path. The final result is the 50th percentile; “badly”/“well” use interpolated 10th/90th percentiles, not extrema or forecasts. A 27-year horizon currently has 462 S&P/bank windows, 366 gold windows and 162 MSCI World windows.

Each investment uses its own available history. Selecting another line therefore does not change other lines. Periods are not identical across assets, and the explanation makes that comparison limitation explicit. The bank uses the full CPI cohort and earns zero nominal interest. Its P10/P90 range reflects differing historical inflation windows. Zero contributions produce zero balances; unsupported horizons show a coverage message instead of synthetic results.

Values labeled DH assume unchanged exchange rates for the USD market series; no historical currency conversion is performed. Taxes, fees and trading costs are excluded. The reference’s fixed CAGR, dividend-contribution and window-count claims are not copied into the interface because they are not established by this snapshot.

## Edge cases and validation

The engine requires finite nonnegative starting savings and deposits, a positive whole-year horizon, equal-length market/CPI arrays and strictly positive finite levels. It returns no result for a series with fewer than `H+1` observations. Zero savings and deposits yield zero balances; the bank can lose purchasing power without losing nominal cash.

Selecting or hiding an asset changes presentation, not another asset's cohort or calculation. Do not describe the pointwise median as one investor's path, P10/P90 as minimum/maximum, or historical frequencies as future probabilities.

## Maintenance and verification

| Responsibility | File |
| --- | --- |
| Defaults, asset styles and displayed sources | `content/tools.ts` |
| Normalized observations | `content/dca-history.json` |
| Import, alignment and provenance | `scripts/import-dca-data.py`, `data/dca/manifest.json` |
| Historical replay and quantiles | `lib/math/dca.ts`, `lib/math/normal.ts` |
| Chart adapter / shared chart | `components/tools/dca-chart.tsx`, `components/ui/age-chart.tsx` |
| Calculation tests | `lib/math/dca.test.ts` |
| Browser tests | `tests/e2e/dca.spec.ts` |

Tests cover replay timing, independently calculated outcomes, percentiles, inflation, coverage and invalid data, plus UI controls and chart interaction. When refreshing data, update this coverage description and the [source index](../data-sources.md), then regenerate retirement's dependent snapshot. See [development](../development.md) for commands.
