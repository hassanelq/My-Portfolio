# The Quant Lab: Exact Instrument Specifications

> Implementation note: `DESIGN.md` supplies the current dark visual system. Older cream panels, terminal chrome and blue accents below are superseded. Instrument numbering is 01–07, and displayed values are computed.

*Direct specification of the 7 interactive quant instruments from the screenshots.*

Every instrument is contained in a vintage-modern macOS terminal-style panel:
- **Header Bar:** Dark background, terminal dots (red, yellow, green), uppercase green title on left, witty monospace subtitle on right.
- **Body Styling:** Warm cream background (`#F4F1E8`), dark ink borders (`1.5px solid #1E1E1E`), hard offset drop shadow (`4px 4px 0 #1E1E1E`).
- **Typography:** Serif blue font for large hero readouts, monospace (`JetBrains Mono` / `Geist Mono`) for inputs, table cells, and captions.

---

## 01. Black-Scholes Engine

- **Header Bar:** `01  BLACK-SCHOLES ENGINE`
- **Subtitle:** `est. 1973, still undefeated`

### Inputs (Top Row)
- `SPOT (S)`: Number input, default `100`
- `STRIKE (K)`: Number input, default `105`
- `TIME (YRS)`: Number input, default `0.5`
- `VOL (Σ, %)`: Number input, default `22`
- `RATE (R, %)`: Number input, default `4.5`
- `TYPE`: Dropdown `[Call | Put]`

### Left Column: Fair Value & Greeks
- **Label:** `FAIR VALUE`
- **Price Readout:** `$5.04` (Large blue serif font)
- **5 Greeks Cards (Horizontal Grid):**
  - `0.464` / `DELTA`
  - `0.0255` / `GAMMA`
  - `0.281` / `VEGA`
  - `-0.022` / `THETA/DAY`
  - `0.207` / `RHO`

### Right Column: Expiry P&L Chart
- Blue payoff line representing profit & loss at expiration ($S - K - \text{premium}$ for Call).
- Horizontal zero axis line (grey).
- Vertical dotted green line at `spot`.
- Vertical dashed grey line at `K=105`.
- Breakeven circle marker labeled `b/e 110.0`.
- Bottom right label: `P&L at expiry`.

### Footnote
> `Pricing options since 1973. Pricing my life choices since 1996.`

---

## 02. Monte Carlo · 1,000 Paths

- **Header Bar:** `02  MONTE CARLO · 1,000 PATHS`
- **Subtitle:** `geometric brownian motion, organic free-range randomness`

### Inputs (Top Row)
- `START VALUE ($)`: Number input, default `10000`
- `DRIFT (M, %/YR)`: Number input, default `7`
- `VOL (Σ, %/YR)`: Number input, default `18`
- `HORIZON (YRS)`: Number input, default `1`
- **Action Button:** `[SIMULATE]` (Bright blue button)

### Left Column: Canvas Path Simulator
- HTML5 Canvas rendering 1,000 translucent light blue paths:
  $$S_{t+\Delta t} = S_t \exp\left( (\mu - 0.5\sigma^2)\Delta t + \sigma \sqrt{\Delta t} Z \right), \quad Z \sim \mathcal{N}(0, 1)$$
- Central black line for median/mean path.
- Extreme markers: `$18,827` (Max), `$10,000` (Start), `$5,281` (Min).
- Green dots at terminal boundary for `P95` and `P5`.
- Footer: `1y · 1,000 paths · 252 steps`.

### Right Column: Metrics Blotter
- `MEAN TERMINAL`: `$10,700`
- `P5 / P95`: `$7,831 / $14,238`
- *(Divider line)*
- `VAR (95%)`: `-$2,169`
- `EXPECTED SHORTFALL`: `-$2,820`
- `P(PROFIT)`: `61.6%`
- `REGRET FACTOR*`: `1.8x` (in bright blue)

### Footnote
> `*Regret factor: how the best path will make you feel about the path you actually got. Not a recognized risk measure. Should be.`

---

## 03. The Efficient Frontier · Risk for Sale

- **Header Bar:** `03  THE EFFICIENT FRONTIER · RISK FOR SALE`
- **Subtitle:** `2,500 random portfolios, one of them is technically optimal`

### Left Column: Scatter Cloud Plot
- **Y-Axis:** `expected return` (`0%`, `10%`, `20%`, `30%`, `40%`)
- **X-Axis:** `annual volatility` (`0%`, `20%`, `40%`, `60%`, `80%`, `100%`)
- 2,500 gold/amber scatter points representing random portfolios generated via Dirichlet/random weights over Equities, Bonds, Gold, and Crypto.
- **Markers on the Frontier:**
  - Blue open circle: `MAX SHARPE`
  - Green open circle: `MIN VAR`

### Right Column: Controls & Allocations
- **Slider:** `RISK-FREE RATE · R_F = 2.00%` (Blue slider)
- **Max Sharpe Allocation:**
  - Vertical bar chart for asset weights: `E` (Equities), `B` (Bonds), `G` (Gold), `C` (Crypto) in blue.
- **Min Variance Allocation:**
  - Vertical bar chart for asset weights: `E`, `B`, `G`, `C` in green.
- **Subtext:** `assets: equities, bonds, gold, crypto. correlations included, free of charge.`

### Footnote
> `The model allocates almost nothing to crypto. The model is not your financial advisor.`

---

## 04. Value at Risk · Tail Risks, Quantified

- **Header Bar:** `04  VALUE AT RISK · TAIL RISKS, QUANTIFIED`
- **Subtitle:** `how much can you lose, with what confidence, by when`

### Inputs (Top Row)
- `PORTFOLIO VALUE`: Number input, default `1000000`
- `ANNUAL VOL · 15%`: Interactive slider
- `HORIZON`: Radio pill buttons: `(•) 1D` `( ) 10D` `( ) 1M`
- `CONFIDENCE`: Radio pill buttons: `( ) 90%` `(•) 95%` `( ) 99%`

### Left Column: Gaussian Distribution Plot
- Normal bell curve representing portfolio returns over the chosen horizon.
- Shaded red left tail representing the loss region.
- Vertical red dashed line at cutoff labeled: `VaR $15,544`, `z = 1.645`.
- X-Axis Label: `portfolio return over the horizon`.

### Right Column: Tail Risk Metrics
- `VaR (95%, 1d)`: `$15,544` (Bold red)
- `Expected Shortfall`: `$19,486`
- `As % of portfolio`: `1.55%`
- `Horizon σ`: `0.94%`

### Footnote
> `VaR answers: how much can I lose. It does not answer: how bad does it get after that. That is what Expected Shortfall is for.`

---

## 05. DCF Valuation · Terminal Value is Doing All the Work

- **Header Bar:** `05  DCF VALUATION · TERMINAL VALUE IS DOING ALL THE WORK`
- **Subtitle:** `five years of forecasts and one very load-bearing perpetuity`

### Inputs (Top Row)
- `FREE CASH FLOW, YEAR 1 ($M)`: Number input, default `100`
- `GROWTH, YEARS 1-5 · 10%`: Interactive slider
- `WACC · 10%`: Interactive slider
- `TERMINAL GROWTH · 3.00%`: Interactive slider

### Left Column: Valuation Output
- **Label:** `enterprise value`
- **Enterprise Value:** `$1.79B` (Large blue serif font)
- **Decomposition:**
  - `PV of explicit FCFs: $455M (25.4% of EV)`
  - `PV of terminal value: $1.34B (74.6% of EV)`

### Right Column: Sensitivity Grid
- **Label:** `sensitivity: wacc rows, terminal growth columns`
- **5x5 Matrix:**
  - Columns (Terminal Growth): `2.0%`, `2.5%`, `3.0%`, `3.5%`, `4.0%`
  - Rows (WACC): `9.0%`, `9.5%`, `10.0%`, `10.5%`, `11.0%`
  - Active cell at (WACC: 10.0%, $g_T$: 3.0%) is framed in a bold blue border: `[$1.79B]`.

### Footnote
> `Terminal value is the present value of everything after year 5. It is also most of your enterprise value. This is fine and completely normal.`

---

## 06. Option Payoff Builder

- **Header Bar:** `07  OPTION PAYOFF BUILDER`
- **Subtitle:** `up to four legs, premiums priced by black-scholes, consequences included`

### Top Controls
- **Preset Strategies:** Radio pills:
  - `(•) LONG CALL`
  - `( ) BULL CALL SPREAD`
  - `( ) STRADDLE`
  - `( ) IRON CONDOR`
  - `( ) CUSTOM`
- **Leg Row:**
  - Toggle: `[ CALL | PUT ]`
  - Toggle: `[ LONG | SHORT ]`
  - Strike Slider: `K=100 · $2.98`
- **Action Button:** `[+ ADD LEG]` (up to 4 legs)

### Main Payoff Chart
- Interactive P&L curve (blue line).
- Horizontal zero axis line (grey).
- Vertical dotted green line at `100 (spot)`.
- Yellow circular marker at breakeven: `b/e $103.0`.
- Status markers at right: `max unlimited` (green), `min $-3.0` (red).
- X-Axis Labels: `70`, `100 (spot)`, `130`.

### Bottom Metrics Bar
- `net premium: $2.98 paid`
- `breakevens: $103.0`
- `max profit: unlimited` (green text)
- `max loss: $-3.0` (red text)

### Footnote
> `unlimited upside. capped downside. this is what long options feel like before the premium decay arrives.`

---

## 07. Binomial Tree Pricer

- **Header Bar:** `08  BINOMIAL TREE PRICER`
- **Subtitle:** `cox-ross-rubinstein, converging toward black-scholes one step at a time`

### Inputs (Top Row)
- `STEPS (N) · 10`: Slider
- `STRIKE (K) · 100`: Slider
- `VOL (Σ) · 20%`: Slider

### Left Column: Lattice Visualizer
- Interactive Cox-Ross-Rubinstein binomial tree lattice drawn with connected nodes.
- Root node labeled `$9.22` in blue with red node dot `9.2`.
- Each node displays its computed price value (e.g. `13.0`, `5.4`, `17.8`, `8.1`, `2.7`...).
- Color-coded node dots: Green for up-branches, Red for down-branches.

### Right Column: Oscillation & Benchmark
- **Convergence Chart:**
  - Horizontal gold benchmark line: `BS $9.41`.
  - Oscillating zigzag line connecting step values from $n=1$ to $n=10$.
  - Highlighted green circle at terminal step $n=10$.
- **Readouts:**
  - `BINOMIAL PRICE`: `$9.2179` (blue)
  - `BLACK-SCHOLES`: `$9.4134` (gold)
  - `DIFFERENCE`: `-0.1955`

### Footnote
> `the odd-even oscillation: consecutive step counts straddle the black-scholes price. averaging two neighbors is called richardson extrapolation, and practitioners actually use it.`
