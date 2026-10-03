# Option payoff builder

**Location:** `/lab#payoff` · **UI:** `components/lab/payoff.tsx` · **Math:** `optionStrategy` in `lib/math/options.ts`.

Build a strategy from call/put legs with long/short positions and editable strikes. Presets include a long call, bull call spread, long straddle and iron condor. Legs can be added or removed.

One unit is used per leg. Premiums come from European Black-Scholes with fixed spot $100, six months, 20% volatility and 4% rate. Expiry profit/loss combines signed intrinsic values and paid/received premiums. The chart is accompanied by net premium, breakevens and maximum profit/loss.

Maximums and breakevens consider all nonnegative expiry prices, including unbounded tails outside the displayed chart. Fees, dividends and premium financing are excluded. Strategy and edge-case checks are in `lib/math/math.test.ts`.
