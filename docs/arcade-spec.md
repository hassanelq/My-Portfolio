# The Arcade: Probabilistic & Quantitative Games

> Implementation note: `DESIGN.md` supplies the current dark visual system. See `DATA_SOURCES.md` for implemented assumptions. Example values are illustrative; results are calculated from controls. In the Kelly game, overbetting raises risk but does not guarantee ruin within 25 flips.

*Inspired by Sarthak Gupta's Arcade (`sarthakgpt.com/arcade`).*

> **House edge: educational.**  
> Three simple, high-impact games exploring chart psychology, statistical correlation, and optimal bet sizing.

All 3 games run 100% in-browser on HTML5 Canvas / SVG with zero server roundtrips.

---

## 1. The Chart Turing Test

Can you tell real human market history apart from pure mathematical randomness?

### Concept & Educational Goal
Human brains have a natural instinct to spot patterns, support levels, and breakout trends where none exist. This game presents a real historical market chart next to a pure mathematical random walk to test if you can tell them apart.

### Simple Gameplay
- **The Screen:** Shows two clean price charts side-by-side: **Chart A** and **Chart B** (each spanning 90 days).
- **The Catch:**
  - One is an actual 90-day slice of the **S&P 500**.
  - The other is a **Geometric Brownian Motion** simulated random walk generated on the fly with matching drift and volatility.
- **Player Action:** Click which chart you believe is the **Real Market**.
- **The Reveal:**
  - Shows which chart was real and which was synthetic noise.
  - Explains the historical context if real, or shows where your brain hallucinated "support lines" in pure white noise.
- **Score:** 5 rounds per session with an accuracy percentage.

---

## 2. Guess the Correlation ($\rho$ Challenge)

Train your visual intuition to estimate statistical correlation from scatter plots.

### Concept & Educational Goal
Develop an intuitive feel for Pearson correlation ($\rho \in [-1.0, +1.0]$) and learn to distinguish true linear relationships from noisy clusters.

### Simple Gameplay
- **The Screen:** An interactive canvas with 80 scatter plot points generated with an unknown correlation $\rho^* \in [-0.95, +0.95]$.
- **Controls:** A smooth slider from `-1.00` to `+1.00` with a [Submit Guess] button.
- **Lives & Scoring:**
  - Player starts with **3 Lives**.
  - **Bullseye ($|\text{guess} - \rho| \le 0.05$):** $+100$ points, keeps life, streak $+1$.
  - **Close ($|\text{guess} - \rho| \le 0.15$):** $+50$ points, keeps life.
  - **Miss ($|\text{guess} - \rho| > 0.15$):** Lose $1$ life. Draws the true linear regression line and reveals $\rho$.
- **High Scores:** High score and best streak saved in `localStorage`.

---

## 3. The Kelly Criterion & Gambler's Ruin

Learn why having an edge isn't enough if your bet sizing is wrong.

### Concept & Educational Goal
A coin with a 60% win rate guarantees positive expected value, yet players who bet too aggressively (e.g. 50% or 70% of their bankroll) will inevitably go broke due to volatility drag. The Kelly Criterion mathematically proves the exact bet size that maximizes long-term wealth compounding.

### Simple Gameplay
- **The Edge:** You are given a coin with a **60% probability of winning** ($p = 0.60$) and $1:1$ payout.
- **Starting Bankroll:** `$1,000`.
- **Game Length:** 25 consecutive coin flips.
- **Each Round:** You choose what percentage of your bankroll to wager (slider from $1\%$ to $100\%$).
- **The Result & Visuals:**
  - Flips the coin with a quick animation.
  - Plots your live **Equity Curve** comparing your balance against the **Optimal 20% Kelly Path** ($f^* = 20\%$).
  - Over-betting (e.g. 50%) leads to rapid ruin, visually demonstrating geometric compounding decay.
