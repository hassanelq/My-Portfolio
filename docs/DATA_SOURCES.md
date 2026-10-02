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

## DCA calculator, initial version

The current implementation uses editable **constant nominal annual assumptions**, as requested. It does not perform rolling historical replay. The initial S&P 500 (10.5%), gold (8.2%), and inflation (4%) inputs come from the earlier feature spec but are presented only as scenario assumptions; they are not certified historical estimates or forecasts.

Monthly update: `balance = balance * (1 + annualReturn)^(1/12) + monthlyContribution`. The initial amount is invested at time zero, and fixed nominal deposits arrive at each month-end. At each year, the complete nominal balance is divided by `(1 + annualInflation)^elapsedYears`. MAD is the scenario's unit of account; no USD/MAD conversion is applied. Fees, taxes and market volatility are omitted. There are no invented historical percentiles or worst/best outcomes.

A future historical edition requires versioned monthly total-return, gold, FX and Moroccan inflation observations, aligned dates and an agreed contribution/currency methodology.

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
