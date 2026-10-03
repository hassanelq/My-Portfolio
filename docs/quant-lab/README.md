# Quant lab

**Route:** `/lab` · **Page:** `app/lab/page.tsx` · **Shared controls:** `components/lab/shared.tsx`.

Seven educational instruments, displayed as sections with anchor navigation. Controls feed local TypeScript calculations. There is no live market feed, broker connection or server calculation API. Amounts generally use USD; DCF uses millions of USD. Rates entered as percentages are converted to fractions by each interface.

| Instrument | Anchor | Guide |
| --- | --- | --- |
| Black-Scholes | `black-scholes` | [Pricing and Greeks](black-scholes.md) |
| Monte Carlo | `monte-carlo` | [Simulated paths](monte-carlo.md) |
| Efficient frontier | `frontier` | [Portfolio allocation](efficient-frontier.md) |
| Value at risk | `value-at-risk` | [Gaussian loss estimates](value-at-risk.md) |
| DCF valuation | `dcf` | [Discounted cash flow](dcf.md) |
| Option payoffs | `payoff` | [Strategy builder](option-payoffs.md) |
| Binomial tree | `binomial` | [CRR option pricing](binomial-tree.md) |

These are simplified models with explicit assumptions. Parameter defaults live in the corresponding component; math functions live in `lib/math/`. Formula and edge-case checks are in `lib/math/math.test.ts`, and browser interactions in `tests/e2e/portfolio.spec.ts`. Keep these short guides synchronized with the implemented controls and limitations.
