# Efficient frontier

**Location:** `/lab#frontier` · **UI:** `components/lab/frontier.tsx` · **Math:** `lib/math/portfolio.ts`.

Explore long-only allocations across equities, bonds, gold and crypto. Expected returns, volatilities and pairwise correlations are fixed illustrative inputs in the math module. They are not live estimates or recommended allocations. The adjustable risk-free rate changes Sharpe ratios and the tangency portfolio.

The chart shows a reproducible cloud of 2,500 portfolios, an efficient frontier, minimum-variance and maximum-Sharpe solutions with allocation readouts. Expected return is `wᵀμ`, risk is `sqrt(wᵀΣw)`, and Sharpe is `(return − riskFree) / risk`.

Optima are solved over feasible asset subsets under nonnegative weights summing to one; they are not merely the best sampled dot. The frontier is evaluated over target returns. Tests check allocation constraints and known optimization properties in `lib/math/math.test.ts`.
