# Financial Freedom Tools: Exact DCA Simulator Specification

> Implementation note: `DESIGN.md` supplies the current dark visual system. The owner requested a simple initial DCA projection; historical replay and percentile outputs below are deferred. See `DATA_SOURCES.md` for the implemented methodology.

*Exact specification of the DCA (Dollar Cost Averaging) Simulator inspired by Zeta Method (`finance.zetamethod.com/tools`).*

This is the **sole financial tool** featured in the portfolio tools section. It calculates historical rolling 35-year compounding returns in Moroccan Dirhams (MAD), adjusted for Moroccan inflation, comparing the S&P 500, Gold, and uninvested Bank Cash.

---

## 1. Tool Overview & Layout

- **Theme & Palette:** Minimalist deep dark mode (`#0D0D0D` / `#0A0A0A` background), white primary text, gold accents for Gold, muted slate for bank decay, and white for the S&P 500.
- **Top Navigation Bar:**
  - Active Pill: `[ DCA simulator ]` (white background, dark text)
  - Inactive "Coming Soon" Pills: `Which broker SOON`, `ETF shortlist SOON`, `How much to invest SOON`, `Which savings account SOON`, `Emergency fund size SOON`, `Rent or buy SOON`, `Other`.

---

## 2. Left Column: Copy & Input Controls

### Copy Header
> "Dollar cost averaging (DCA) just means buying every month, whatever the price. What you earn starts earning too. That, my friend, is the **magic of compound interest**. Try it below."

### Input Group (Framed with Corner Brackets)
- **`Starting ?`**: Text/number input, formatted with currency prefix: `MAD 10 000`
- **`Per month`**: Text/number input: `MAD 500`
- **`Your age`**: Number input: `30`

### Action Row
- **Calculate Button:** Dark rounded pill button: `[ Calculate ]`
- **Target Age Selector:** `until age [ 65 ]` (default 65, duration $= 65 - \text{age} = 35$ years)

### Hero Outcome Callout
- Prefix: *"By **65**, in the S&P 500 you would have"*
- **Primary Hero Metric:**
  # **MAD 565 477**
- Dynamic Context:
  *"in today’s money. The same payments into **gold** would be **MAD 179 102**. Leaving it in the bank instead, **MAD 39 172**."*

### Collapsible Section: "How this works"
Expandable accordion with the exact copy:

> **How this works**  
> These are not made-up growth rates. Each line replays every 35-year stretch of its own history — 360 of them for the S&P 500, between 1960 and 2025 — and shows the middle result. Half of history did better, half did worse.  
>  
> Everything is in today’s money, deflated by Moroccan inflation, which ran at 4.0% a year over that period. That is what the bank line measures: money sitting in an account earning nothing buys a little less every year.  
>  
> S&P dividends are reinvested, which is what an index fund does for you — worth 3.9 points a year, around 38% of everything it has returned. Gold pays nothing while you hold it, so all of its return is the price moving.  
>  
> S&P 500 has returned 10.5% a year since 1960, or 6.2% after inflation. Gold has returned 8.2% a year since 1968, or 3.8% after inflation.  
>  
> Gold starts in 1968 — before that its price was fixed by law, so earlier “returns” would be policy rather than a market. Both assets are run over the same window, so the comparison is like for like.  
>  
> Past performance is not a prediction. Both assets are priced in dollars and nothing is converted, so reading the figures as MAD assumes the exchange rate holds for the whole period, which it will not. Ignores tax and fees. A way to think about scale, not advice.

---

## 3. Right Column: Historical Compounding Chart

Interactive multi-line growth chart comparing wealth trajectories across age:

### Chart Axes
- **Y-Axis:** `MAD 150k`, `MAD 300k`, `MAD 450k` (horizontal subtle grid lines)
- **X-Axis:** Age progression: `30`, `40`, `50`, `65`

### Trajectories (Real Inflation-Adjusted Wealth in Today's MAD)
1. **S&P 500 (Solid White Line):**
   - Exponential compounding trajectory based on median historical 35-year rolling returns ($6.2\%$ real CAGR after inflation, dividends reinvested).
   - Terminal dot at age 65 with label: `• S&P 500`.
2. **Gold (Gold / Amber Line `#F59E0B`):**
   - Moderate real compounding line based on median rolling returns ($3.8\%$ real CAGR after inflation).
   - Terminal dot at age 65 with label: `• Gold`.
3. **Leaving it in the Bank (Muted Slate Grey Line `#64748B`):**
   - Steady downward decay curve showing purchasing power loss under $4.0\%$ annual inflation.
   - Terminal dot at age 65 with label: `• Leaving it in the bank`.

### Legend
- `— S&P 500` &nbsp;&nbsp; `— Gold` &nbsp;&nbsp; `— Leaving it in the bank`

---

## 4. Bottom Breakdown Table: "Over 35 years"

Displays the median outcome alongside the historical worst-case ("If it went badly") and best-case ("If it went well") historical 35-year periods:

| Asset                        | Median Outcome (Today's MAD) | Multiple                             | If it went badly (P10/Min) | If it went well (P90/Max) |
| :--------------------------- | :--------------------------- | :----------------------------------- | :------------------------- | :------------------------ |
| **— S&P 500**                | **MAD 565 477**              | $(\times 14.4)$                      | MAD 251 945                | MAD 1 048 203             |
| **— Gold**                   | **MAD 179 102**              | $(\times 4.6)$                       | MAD 71 749                 | MAD 575 536               |
| **— Leaving it in the bank** | **MAD 39 172**               | *(yep, that's how bad inflation is)* | —                          | —                         |

---

## 5. Mathematical & Simulation Engine

### Rolling Historical Windows Algorithm
- Replays every rolling $(65 - \text{age})$ year window from 1960 to 2025 ($360$ rolling windows for S&P 500, starting from 1968 for Gold).
- For each month $m \in [1, 12 \times \text{years}]$:
  $$\text{Portfolio}_m = \text{Portfolio}_{m-1} \times (1 + r_{\text{real}, m}) + \text{Deposit}$$
- Median result (50th percentile) determines the central chart line and hero number.
- 10th percentile determines *"If it went badly"*; 90th percentile determines *"If it went well"*.
- Uninvested bank deposits are decayed using the Moroccan historical inflation rate ($\pi = 4.0\%$ per annum):
  $$\text{Real Value}_t = \sum_{m=1}^{12t} \frac{\text{Deposit}}{(1 + \pi)^{m/12}} + \frac{\text{Starting Cash}}{(1 + \pi)^t}$$
