# DCA simulator

**Workspace ID:** `dca` · **UI:** `components/tools/dca.tsx` · **Engine:** `lib/math/dca.ts`.

## Purpose and user flow

Explore what a starting investment and fixed monthly deposits would have become over past periods. The result is a historical comparison after the selected country’s inflation, not a forecast at an assumed annual return.

Four numeric controls update immediately, alongside an independent inflation selector. Checkboxes select S&P 500, gold, MSCI World, US bonds and the diversified portfolio; all except the standalone bond line start selected. The zero-interest bank baseline remains visible. There are no editable market-return fields, flat-rate option, CAC 40 or DAX series.

| Input | Default | UI bounds | Unit |
| --- | --- | --- | --- |
| Current savings | 0 | 0–100,000,000 | Selected currency (DH by default), invested immediately |
| Per month | 1,500 | 0–1,000,000 | Fixed nominal selected currency, month-end |
| Your age | 23 | 18–99 | Whole years |
| Until age | 50 | Current age + 1 through 100 | Whole years |

Changing the current age keeps the horizon ordered. A permitted input horizon can still exceed a series' available history; that produces a coverage message rather than invented observations.

## Currency and inflation

The shared sidebar contains **currency only**: DH (MAD) or USD. It applies to monetary inputs, balances, tables and chart tooltips in every financial tool. Numbers stay unchanged when switching currency; this selects a unit for the scenario, not a live FX conversion. Re-enter amounts when changing the scenario’s denomination.

DCA’s **Inflation reference** selector lives with its own controls. A currency change resets DCA to Moroccan CPI for DH or US CPI for USD. The user can then choose either CPI independently: DH + US CPI and USD + Moroccan CPI are supported. Selecting the already-active currency does not reset an override. DCA and retirement maintain separate CPI choices.

Both DCA CPI series are aligned to January 1960–June 2025, so changing inflation does not change an asset’s window cohort. USD market-return ratios are applied to the selected monetary unit. The DH interpretation assumes constant USD/MAD exchange rates; a CPI choice never adds an FX conversion.

## Results and interactions

- Headline median balance for the selected horizon and a full-width age chart. The DCA plot is 560 px tall at desktop chart widths and 430 px below 520 px, increasing vertical separation without cropping the value scale. Other tools retain their standard height.
- Annual pointwise median values available by hover, touch or keyboard.
- Final P10, median and P90 balances for each available comparison, with coverage and window counts. The summary uses a full-width table on desktop and labeled grid rows on narrow screens, keeping amounts readable without horizontal page overflow.
- Distinct muted line colors and patterns, repeated in controls and legends: blue S&P 500, gold Gold, teal MSCI World, violet bonds, coral portfolio and gray cash.
- Every numeric parameter, the CPI selector and the comparison group have a question-mark help icon: hover or focus for a short explanation, click or tap for a shared dialog. “What is this?” and “How this works” also use shared dialogs.
- Inflation summaries and the complete allocation explanation live in “How this works”; the main page keeps controls, comparisons, the chart and results. Comparison-option tooltips show brief source/basis details. The portfolio tooltip shows the 60/30/10 weights, monthly rebalancing, reinvested bond distributions, embedded fund expenses and modeled fee/tax assumptions. Mouse tooltips close on pointer exit even when the checkbox retains focus after a click; moving into the tooltip keeps it open. Keyboard focus opens the details, with blur or Escape dismissing them. Touch toggles the details. Outside presses and resizing also dismiss them; touch details close when scrolling, and their width stays within the viewport. Details open above the option when there is insufficient room below and enough space above.
- “How this works” is a sectioned guide with LaTeX equations, a live input summary, data coverage and window counts, a 12-month worked example from the selected headline series, and the current outcome table.
- Selection and inputs persist when switching tools, then reset on reload.

## Data and calculation

Original source snapshot retrieved **2 October 2026**; the bond series was added **4 October 2026**. All DCA series are cut off at **June 2025** because this is the last observed Moroccan monthly CPI month in the downloaded IMF series. No extrapolation is used.

| Series | Monthly observations | Basis |
| --- | --- | --- |
| S&P 500 | January 1960–June 2025; 786 levels | Shiller monthly prices/dividends, then Yahoo total-return ratios |
| Gold | January 1968–June 2025; 690 levels | World Bank USD gold price via DataHub |
| MSCI World | January 1985–June 2025; 486 levels | Yahoo `^990100-USD-STRD`, USD **price only** |
| US bonds | December 1986–June 2025; 463 levels | Yahoo `VBMFX` monthly adjusted closes; distributions included, fund expenses embedded |
| Diversified portfolio | December 1986–June 2025; 463 derived levels | 60% S&P 500, 30% US bonds, 10% gold; monthly rebalancing |
| US CPI | January 1960–June 2025; 786 levels | Shiller CPI, then chained BLS CPI-U (`CUUR0000SA0`) |
| Moroccan CPI | January 1960–June 2025; 786 levels | IMF IFS `M.MA.PCPI_IX` via DBnomics, monthly observations |

### Sources and reproducibility

- [Shiller / DataHub S&P 500](https://datahub.io/core/s-and-p-500): before July 2023, monthly gross-return factor is `(P[m] + annualizedDividend[m]/12) / P[m-1]`. The initial level is rebased to 100.
- [Yahoo S&P 500 Total Return Index](https://finance.yahoo.com/quote/%5ESP500TR/history/): from July 2023, chain observed month-to-month index ratios. The splice combines Shiller monthly average prices with Yahoo month-end total-return levels; it is an approximation rather than an official continuous total-return index before the splice.
- [Yahoo MSCI World index](https://finance.yahoo.com/quote/%5E990100-USD-STRD/history/): monthly closes; dividends are excluded. No ETF proxy or assumed dividend yield is substituted.
- [Yahoo VBMFX](https://finance.yahoo.com/quote/VBMFX/history/): monthly adjusted-close ratios serve as a distribution-reinvested fund-return proxy. Unlike the stock indices, fund expenses are already reflected. [Vanguard fund profile](https://investor.vanguard.com/investment-products/mutual-funds/profile/vbmfx) identifies the Total Bond Market Index Fund Investor Shares. Bonds add a different asset class but can still lose value.
- [BLS US CPI](https://www.bls.gov/cpi/): use Shiller’s CPI column through June 2023, then chain BLS unadjusted all-items CPI-U changes at the overlap. The BLS raw file is shared with retirement in `data/retirement/raw/us-cpi.json`; its hash is recorded as a DCA dependency. No US CPI month is interpolated.
- [DataHub gold](https://datahub.io/core/gold-prices): the current source is the World Bank Pink Sheet, not LBMA. Use recorded monthly prices from 1968.
- [IMF IFS Moroccan CPI via DBnomics](https://db.nomics.world/IMF/IFS/M.MA.PCPI_IX): the retrieved series contains valid monthly observations throughout 1960–June 2025. The reference’s claim that monthly CPI starts in 2007 does not apply to this snapshot. No annual interpolation or constant 4% assumption is needed.

Raw downloads are in `data/dca/raw/`. `data/dca/manifest.json` records URLs, exact source hashes and coverage. Rebuild the normalized `content/dca-history.json` with `python3 scripts/import-dca-data.py`. The script rejects missing months or nonpositive levels. `--download` refreshes the DCA market and Moroccan CPI inputs. The shared BLS file is refreshed by the retirement importer. For a full refresh, download retirement/BLS first, download DCA next, then rebuild retirement without downloading so both generated snapshots share the latest cutoff. Review the pinned Yahoo period-end and BLS end year before extending the date range.

### Rolling-window calculation

For a horizon of H months and N monthly levels, replay **N − H** complete windows, each using H+1 price/CPI levels. At each step: `nominal = nominal * level[t]/level[t-1] + monthlyDeposit`. Then `real = nominal * CPI[start]/CPI[t]`. Contributions are fixed nominal amounts paid at month-end. The starting amount is invested immediately. Each inflation-adjusted balance has the purchasing power of its own historical starting month; the chart does not convert all windows to one literal calendar date.

Use the same complete-window cohort at every plotted age; the chart is the pointwise median of annual checkpoints. It is not one particular historical path. The final result is the 50th percentile; “badly”/“well” use interpolated 10th/90th percentiles, not extrema or forecasts. A 27-year horizon currently has 462 S&P/bank windows, 366 gold windows and 162 MSCI World windows, plus 139 bond and portfolio windows.

Each investment uses its own available history. Selecting another line therefore does not change other lines. Periods are not identical across assets, and the explanation makes that comparison limitation explicit. The bank uses the full CPI cohort and earns zero nominal interest. Its P10/P90 range reflects differing historical inflation windows. Zero contributions produce zero balances; unsupported horizons show a coverage message instead of synthetic results.

Values labeled DH assume unchanged exchange rates for the USD market series; no historical currency conversion is performed. Standalone assets are gross benchmarks excluding personal taxes and trading costs. The portfolio deducts modeled trading fees and tax on rebalancing gains. VBMFX fund expenses are already embedded in its observations, so they are not charged again. The reference’s fixed CAGR, dividend-contribution and window-count claims are not copied into the interface because they are not established by this snapshot.

## Diversified portfolio

The illustrative allocation is **60% S&P 500, 30% US bonds (VBMFX), 10% gold**. It mixes three asset classes, but its equity and bond exposure is US-focused. These weights are an example, not an optimized allocation or recommendation. MSCI World remains a separate comparison, and is not a constituent of this example.

`portfolioWeights` in `lib/math/dca.ts` is the calculation’s source of truth; the comparison tooltip and methodology document those weights. `portfolioHistory` aligns every constituent to their common start, December 1986, and creates a base-100 series:

$$
R_{p,t}=0.60R_{S\&P,t}+0.30R_{bonds,t}+0.10R_{gold,t},\qquad
I_{p,t}=I_{p,t-1}(1+R_{p,t}).
$$

The gross combined index is used for source coverage and as a reference level in worked examples. The actual portfolio result uses the per-holding ledger below. Every month begins at the target weights; after market returns and the month-end deposit, fees and tax are paid from the portfolio before restoring those weights. The selected CPI deflates the resulting net balance. This is **not** a weighted sum of standalone medians; contemporaneous constituent returns determine each portfolio window. No pre-1986 bond or portfolio history is invented.

### Trading fees and modeled gains tax

`portfolioCosts` in `lib/math/dca.ts` supplies illustrative constants: **0.10% on every traded amount** (buys and sells) and **20% on positive modeled gains realized by rebalancing sales**. They are not statutory Moroccan/US tax rates or a broker quotation. These assumptions remain the same for both currencies and CPI choices. [SEC guidance on rebalancing](https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset) describes why transaction costs and tax consequences matter, and why new deposits can reduce selling.

For each historical start, track each holding's value and average acquisition basis separately. Apply the observed return to its value; add the deposit as cash. Let $A_i$ be post-return value, $K_i$ its basis, $w_i$ its target weight, $N$ total capital after deductions, $f=0.001$ and $\tau=0.20$:

$$
s_i=\max(A_i-w_iN,0),\qquad G_i=s_i\max(0,1-K_i/A_i)
$$
$$
F=f\sum_i|w_iN-A_i|,\qquad T=\tau\sum_iG_i,\qquad
N=\sum_iA_i+C-F-T.
$$

Zero-value holdings have zero gains. Solve the monotone cash-balance equation with 36 bisection steps over `[0, capital + deposit]`. After settlement, each holding equals `weight × N`. Purchases add their consideration to basis; a sale removes basis in proportion to the fraction sold. Fees are not capitalized into this simplified basis. New cash flows to underweight holdings first through the target equations, so the calculator does not sell and repurchase every holding each month.

The initial purchase invests `S / (1 + f)` and pays the remainder as its trading fee. Losses produce no tax refund or carry-forward. Unchanged weights do not themselves cause a sale. `portfolioWindow` returns monthly net balances and cash fees/tax; `replayPortfolio` uses them to form each inflation-adjusted historical outcome. The worked example shows cumulative fees and tax when the selected headline is the portfolio.

This is a **tax proxy**: total-return series do not isolate price gains from distributions, so growth is treated as appreciation for basis purposes. Separate dividend/income taxes, account exemptions, jurisdiction-specific relief and liquidation at the final age are not modeled. The displayed result is invested account value after the tax paid during rebalancing. VBMFX's existing fund expenses are not charged again. Standalone benchmark lines exclude these portfolio deductions.

## Recorded example results

For zero starting savings, 1,500 per month and ages 23–50 (324 contributions), total nominal deposits are 486,000. These are rounded historical medians from the bundled snapshot. The portfolio includes the modeled fee and gains tax above; the standalone benchmarks are gross. Amounts use the selected unit; the table changes only the CPI reference, not the numeric inputs or FX assumptions.

| Series | Complete windows | Moroccan CPI median | US CPI median |
| --- | ---: | ---: | ---: |
| S&P 500 | 462 | 879,360 | 991,156 |
| Gold | 366 | 522,127 | 605,523 |
| MSCI World, price only | 162 | 550,020 | 519,843 |
| US bonds | 139 | 524,652 | 518,447 |
| 60/30/10 portfolio, net of modeled costs/tax | 139 | 801,913 | 744,070 |
| No-interest cash | 462 | 134,110 | 170,032 |

Different series start at different dates. A portfolio median above an equity median is not evidence that the portfolio beat equities over identical periods. Switching comparison visibility never changes those cohorts.

For the full 462 eligible 27-year CPI windows:

| Inflation reference | P10 annualized inflation | Median | P90 |
| --- | ---: | ---: | ---: |
| Morocco | 1.85% | 4.88% | 7.00% |
| US | 2.31% | 3.97% | 5.64% |

Each window’s annualized summary is `(CPI[end]/CPI[start])^(1/27) − 1`. These rates describe history and are not used as fixed assumptions. The replay deflates each monthly balance with its actual `CPI[start]/CPI[month]` ratio. The UI recomputes these summaries, worked examples and results when the horizon or CPI changes.

## Edge cases and validation

The engine requires finite nonnegative starting savings and deposits, a positive whole-year horizon, equal-length market/CPI arrays and strictly positive finite levels. It returns no result for a series with fewer than `H+1` observations. Zero savings and deposits yield zero balances; chart endpoint labels stay within the plot even when all six lines coincide at zero. The bank can lose purchasing power without losing nominal cash.

Selecting or hiding an asset changes presentation, not another asset's cohort or calculation. Do not describe the pointwise median as one investor's path, P10/P90 as minimum/maximum, or historical frequencies as future probabilities.

## Maintenance and verification

| Responsibility | File |
| --- | --- |
| Defaults, asset styles and displayed sources | `content/tools.ts` |
| Shared currency and local CPI choices | `components/tools/tools-settings.tsx` |
| Portfolio weights, fee/tax assumptions and monthly ledger | `lib/math/dca.ts` |
| Methodology guide and formulas | `components/tools/dca-method.tsx`, `components/ui/math-formula.tsx` |
| Normalized observations | `content/dca-history.json` |
| Import, alignment and provenance | `scripts/import-dca-data.py`, `data/dca/manifest.json` |
| Historical replay and quantiles | `lib/math/dca.ts`, `lib/math/normal.ts` |
| Comparison tooltips | `components/ui/tooltip.tsx`, `content/tools.ts` |
| Chart adapter / shared chart | `components/tools/dca-chart.tsx`, `components/ui/age-chart.tsx` |
| Calculation tests | `lib/math/dca.test.ts` |
| Browser tests | `tests/e2e/dca.spec.ts` |

Calculation tests cover replay timing, independently calculated outcomes, percentiles, inflation, coverage and invalid data. Portfolio checks include flat-market cash conservation after fees, an analytically calculated taxable rebalance, zero balances and CPI deflation after deductions.

Browser checks cover controls, currency/CPI overrides, agreement between the headline and summary, formula rendering, tooltip dismissal after clicking, keyboard and touch chart exploration, zero/unsupported histories, dialogs and tool navigation. Layout checks cover 1440, 768, 390 and 320 px widths, including summary-table alignment and mobile grid rows.

Verified 5 October 2026: 10 calculation tests passed. All 12 DCA browser scenarios passed across the full run and the targeted rerun after correcting tooltip placement and automatic-scroll dismissal. Desktop and mobile screenshots were also inspected. The production Webpack build, TypeScript check, scoped ESLint checks and diff whitespace check passed.

When refreshing data, update this coverage description and the [source index](../data-sources.md), then regenerate retirement's dependent snapshot. See [development](../development.md) for commands.
