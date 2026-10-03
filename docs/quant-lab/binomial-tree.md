# Binomial tree

**Location:** `/lab#binomial` · **UI:** `components/lab/binomial.tsx` · **Math:** `lib/math/options.ts`.

Explore Cox–Ross–Rubinstein pricing with 2–60 steps, strike, volatility, call/put and European/American exercise controls. Defaults: 10 steps, strike $100, 20% volatility, European call. Spot $100, maturity one year and rate 4% are fixed; there are no dividends.

The lattice uses risk-neutral up/down probabilities and backward discounted valuation. American exercise compares continuation value with intrinsic value at each node. The illustration shows at most five levels of the selected tree; node labels are option values.

Readouts and a convergence chart compare the lattice with European Black-Scholes. An American put may remain above that benchmark because of early exercise. Pricing, convergence and exercise behavior are covered by `lib/math/math.test.ts`.
