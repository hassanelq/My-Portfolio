# Arcade

**Route:** `/arcade` · **Page:** `app/arcade/page.tsx`.

Three browser games about visual inference, randomness and bet sizing. Anchor navigation jumps to each game; no account, server roundtrip or real-money transaction is involved.

| Game | Anchor | What it explores |
| --- | --- | --- |
| [Chart Turing test](chart-turing-test.md) | `chart-test` | Recorded market paths versus generated noise |
| [Guess the correlation](guess-the-correlation.md) | `correlation` | Visual intuition for Pearson correlation |
| [Kelly criterion](kelly-criterion.md) | `kelly` | Bankroll growth and the effect of bet sizing |

Games use the shared portfolio typography and chart styles. Components live in `components/arcade/`, mathematics in `lib/math/games.ts` and random helpers in `lib/math/normal.ts`. Only correlation personal records persist in localStorage; play still works when storage is unavailable. Other session state resets on reload.

Shared math checks are in `lib/math/math.test.ts`; browser checks are in `tests/e2e/portfolio.spec.ts`. Keep game claims consistent with finite samples: patterns do not prove predictability, and a growth-optimal fraction does not guarantee a short-session win.
