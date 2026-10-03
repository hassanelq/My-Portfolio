# Value at risk

**Location:** `/lab#value-at-risk` · **UI:** `components/lab/var.tsx` · **Math:** `valueAtRisk` in `lib/math/finance.ts`.

Estimate Gaussian portfolio loss from portfolio value, annual volatility, horizon (1, 10 or 21 trading days) and confidence (90%, 95% or 99%). Defaults: $1,000,000, 15% volatility, one day and 95% confidence.

The chart shades the loss tail and displays VaR, expected shortfall, relative loss, horizon volatility and the normal quantile. The model assumes zero mean and 252 trading days per year: `horizonVol = annualVol × sqrt(days/252)`, `VaR = value × horizonVol × z`, and `ES = value × horizonVol × φ(z)/(1−confidence)`.

VaR is a threshold, not a maximum possible loss. Gaussian tails and square-root-of-time scaling omit jumps, changing volatility and serial dependence. Formula benchmarks are covered in `lib/math/math.test.ts`.
