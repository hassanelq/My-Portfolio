# Black-Scholes

**Location:** `/lab#black-scholes` · **UI:** `components/lab/black-scholes.tsx` · **Math:** `lib/math/options.ts`.

Price a European call or put and see how sensitivities respond to spot, strike, time, volatility and interest rate. Defaults: spot $100, strike $105, 0.5 years, 22% volatility, 4.5% rate, call.

The interface updates the fair value, delta, gamma, vega, theta and rho, plus an expiry profit/loss chart including the option premium. There are no dividends. Vega and rho are per one percentage point; theta is per calendar day. Expiry and zero-volatility cases use explicit limiting conventions rather than the ordinary formula at a singularity.

Shared normal-distribution helpers live in `lib/math/normal.ts`. Benchmark prices, put-call parity and edge cases are checked in `lib/math/math.test.ts`. This is a model price, not an executable market quote.
