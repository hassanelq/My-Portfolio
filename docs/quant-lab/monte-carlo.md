# Monte Carlo

**Location:** `/lab#monte-carlo` · **UI:** `components/lab/monte-carlo.tsx` · **Math:** `lib/math/simulation.ts`.

Generate 1,000 geometric Brownian motion paths from a starting value, annual drift, annual volatility and horizon. Defaults: $10,000, 7% drift, 18% volatility and one year. Change inputs, then press **Simulate** to draw a new sample.

The engine uses `steps = round(252 × years)` and the lognormal update `S_next = S × exp((drift − vol²/2)dt + vol × sqrt(dt) × Z)`. Canvas draws the paths and their cross-sectional mean. Readouts include terminal mean, P5/P95, best/worst, probability of profit and 95% VaR/expected shortfall expressed as nonnegative losses.

Reruns use `components/lab/monte-carlo.worker.ts`; the initial sample is seeded. These outcomes describe the selected constant-parameter model, not historical observations or future market probabilities. Repeatability and limiting cases are tested in `lib/math/math.test.ts`.
