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
