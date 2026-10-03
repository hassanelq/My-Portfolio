# Data and model notes

## Portfolio content

The current text and claims were adopted from the supplied `portfolio-content.md` and `projects-spec.md`, with the owner's approval for this first implementation. They remain editable in `content/`. They have not been independently audited.

Repository slugs were checked against the public `hassanelq` GitHub repositories. Aleph Math's repository URL comes from its existing local Git remote; its visibility may require authorization. No repository URL was available for Artisan ERP, so it is marked as a private client project. Existing demo URLs are external services and are not reimplemented by this portfolio.

## Chart Turing test

- Source: [Plotly public stockdata.csv](https://github.com/plotly/datasets/blob/master/stockdata.csv).
- Series: `GSPC`, recorded daily S&P 500 index closes. No dividend reinvestment is assumed.
- Local file: `content/market-windows.json`.
- Extraction: parse dates, sort ascending, take 90 recorded observations starting on or after 2007-01-03, 2008-09-02, 2009-03-02, 2011-07-01, and 2013-01-02. Each window records its actual start/end date. These are **90 trading observations**, not 90 calendar days.
- Both charts start at 100. A simulated path draws normal daily log returns with mean and standard deviation estimated from the corresponding real window. The pair shares a vertical scale. The simulated sample need not realize exactly the same drift or volatility.
- The real dates, context label, and source link are shown after an answer. There is no live market feed or network dependency during play.

## Historical DCA calculator

The owner’s later request replaces the initial fixed-rate illustration with historical replay. Snapshot retrieved **2 October 2026**, cut off at **June 2025** because this is the last observed Moroccan monthly CPI month in the downloaded IMF series. No extrapolation is used.

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

## FIRE retirement planner

The default uses the same S&P 500 total-return reconstruction and monthly Moroccan CPI as DCA, January 1960–June 2025 (786 observations). The optional US reference uses January 1928–June 2025 (1,170 observations), including the 1929 crash. Both end at the same cutoff; results and sources from the user’s reference screenshot are not hard-coded.

### US reference and reproducibility

- Market series: the same Shiller dividend-reinvestment formula through June 2023, followed by Yahoo `^SP500TR` ratios. Rebase January 1928 to 100. Returns in the overlapping period match the Moroccan model.
- US inflation: the Shiller `Consumer Price Index` column through June 2023, then [BLS CPI-U](https://www.bls.gov/cpi/data.htm), series `CUUR0000SA0` (all items, US city average, not seasonally adjusted). Chain BLS monthly changes onto Shiller’s June 2023 CPI level to avoid a rounding discontinuity. No post-cutoff month or missing month is interpolated.
- `content/retirement-us-history.json` is generated by `python3 scripts/import-retirement-data.py`. Raw BLS data and source hashes live in `data/retirement/`; market inputs are reused from `data/dca/raw/`.
- `--download` refreshes the BLS response. When extending the snapshot, refresh the shared DCA data first and review the BLS query’s configured end year. The importer requires every month up to the DCA cutoff.
- Research context: [Bengen (1994)](https://www.financialplanningassociation.org/sites/default/files/2021-04/MAR04%20Determining%20Withdrawal%20Rates%20Using%20Historical%20Data.pdf) and [Cooley, Hubbard & Walz (1998)](https://www.aaii.com/files/pdf/6794_retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable.pdf). This calculator has its own monthly timing, inflation data and 100% equity allocation; it does not reproduce those papers’ portfolios or assume their headline withdrawal rates.

### Historical target

Let `R[t] = (index[t]/index[0]) / (CPI[t]/CPI[0])`, and let `W` be monthly spending in today’s money. A retirement of `H` months starting at observation `s` needs:

```text
capital(s) = W × sum(R[s] / R[s+k], k = 0 … H−1)
realBalance(k+1) = (realBalance(k) − W) × R[s+k+1] / R[s+k]
historicalTarget = max(capital(s)) across complete windows
initialAnnualWithdrawalRate = 12 × W / historicalTarget
```

Withdrawals occur at the **beginning** of each month, followed by market growth and CPI adjustment. Spending stays fixed in purchasing power, rather than being a fixed percentage of the remaining account. A complete window requires `H+1` monthly levels, giving `N−H` windows. For 30 years the current snapshot supplies 426 Moroccan-inflation windows and 810 US-inflation windows. This is the minimum capital that funds the prescribed withdrawals in every available period; the most demanding window finishes at approximately zero. Excess existing investments can leave a surplus. Other windows may also tie the minimum.

The chart’s retirement segment replays the most demanding start, sampled annually. Passing every recorded period is not a forecast or guarantee. The alternative ages are whole-year estimates: each candidate has a new retirement duration and therefore a separately calculated target. An insufficient history produces a coverage message.

### Accumulation and average-return mode

Accumulation uses a **constant estimated real monthly growth factor** `g = (R[last]/R[first])^(1/(N−1))`. Existing savings are invested immediately; contributions arrive at month-end. For `M` months and contribution `C`, the final balance is `starting × g^M + C × sum(g^k, k=0…M−1)`. Solve this for `C`, floored at zero. Round the displayed contribution upward to the next dirham; use the precise amount for the chart. A shortfall with zero saving months is shown as an immediate investment requirement.

Unlike DCA, retirement contributions are **constant real amounts**, so their nominal value must rise with inflation. The smooth accumulation line is an estimate from a historical compound return, not a historical replay or predicted return path.

Optional average-return mode uses `W × sum(g^(−k), k=0…H−1)` as its target and the same constant factor during retirement. It spends that target down by the end age, but ignores the actual order of returns in its plotted path. Its target is still tested against every real historical retirement window; the UI shows how many it funds and warns that other sequences can fail. The success count is a count of recorded outcomes, not future odds.

Zero spending needs zero capital. Flat and negative real returns are supported. Existing investments above the target require no further monthly contribution. The planning end age is adjustable and is not a life-expectancy estimate.

### Scope

All retirement assets are S&P 500 equities with reinvested dividends. A DH label assumes unchanged USD/MAD exchange rates. No tax, fees, access costs, pensions, variable spending, bonds or inheritance target is modeled. The longer US reference changes both inflation and market coverage; it is not a forecast of Moroccan prices. Figures use observed CPI changes, never a fixed inflation assumption.

## Emergency cash cushion

This tool uses a deterministic planning heuristic, not a dataset or historical backtest. The supplied reference gives thresholds but does not disclose answer weights. We retain its thresholds and self-employment minimum, while defining an explicit scoring table in `content/emergency.ts`:

| Factor | Choice → points |
| --- | --- |
| Income | Steady → 0; variable/interrupted → 2; self-employed → 3 |
| Unemployment support | Essentials covered → 0; partial → 1; none or unsure → 2 |
| Dependents | Just you → 0; shared support → 1; primarily your responsibility → 2 |
| Housing and fixed bills | Mortgage-free with bills ≤30%, or combined costs ≤30% of pay → 0; >30% to 60% → 1; >60% or no current income → 2 |
| Replacing income | Under 3 months → 0; 3–6 months → 1; over 6 months or unsure → 2 |
| Downturn exposure | Low → 0; unsure → 1; likely hit early → 2 |
| Required loan repayments | None → 0; under 20% of pay → 1; ≥20% or repayments without current income → 2 |

Scores 0–4 map to 3 months, 5–7 to 6 months, 8 to 9 months and 9+ to 12 months. Apply a minimum of 6 months for self-employment. These weights are editorial planning assumptions, not empirically calibrated loss probabilities. All seven answers are required; uncertainty is an explicit choice with the stated score.

`target = months × monthlyEssentialSpending`; `remaining = max(0, target − currentCash)`. Coverage is current cash divided by monthly spending. Progress is capped at 100%; surplus cash is reported separately. Amount inputs are whole DH, spending is at least 1 DH and cash is nonnegative. No interest, future inflation, benefit income or investment return is added. Housing and debt can both add risk points, but actual repayments are included only once in essential spending.

The current choice counts are `3 × 4 × 3 × 4 × 4 × 3 × 3 = 5,184`, all exercised by the unit tests. The reference’s 9,072-combination claim is not used. Tests establish deterministic behavior, not financial validation of the heuristic.

General guidance on keeping emergency cash safe, accessible and separate is supported by the [CFPB emergency fund guide](https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/), consulted 3 October 2026. This source does not endorse this scoring table. Local benefit eligibility and bank/deposit-protection terms are not inferred; users supply their own situation. No specific product or jurisdictional protection limit is recommended. Answers stay in React state, survive tool switching and clear on reload; no AI processes them.

## Quant Lab

- Black-Scholes: European, no dividends; analytical Greeks. Vega/rho per percentage point, theta per calendar day. Expiry and zero-volatility cases use explicit limiting conventions.
- Monte Carlo: geometric Brownian motion, 252 steps/year, 1,000 paths. VaR and expected shortfall are reported as nonnegative losses, floored at zero. The worker keeps repeat simulations off the main UI thread.
- Frontier: four illustrative assets with fixed expected returns, volatilities and a covariance model in `lib/math/portfolio.ts`. Long-only optima are solved over feasible asset subsets, independent of the 2,500-point sampled cloud.
- VaR: Gaussian returns, zero mean, square-root-of-time scaling, 252 trading days/year.
- DCF: five annual FCFs, growth from year 2, Gordon terminal value. WACC must exceed terminal growth.
- Payoffs: one unit per leg, European Black-Scholes premiums, all nonnegative expiry prices considered for maxima/minima. Fees and premium financing excluded.
- Binomial: CRR, optional American exercise; European Black-Scholes benchmark. Only the first five levels are drawn when the tree is larger.

## Arcade mechanics

Correlation samples are centered, standardized and orthogonalized so their sample Pearson correlation matches the target. Score and best streak are stored only in browser localStorage; unavailable storage does not prevent play.

Kelly uses the same independent coin outcomes for both paths, 60% win probability, even payouts, and 25 flips. The 20% comparator maximizes expected logarithmic growth for those assumptions; it neither guarantees a short-run win nor implies that every overbetting path reaches ruin within 25 flips. No real money is involved.
