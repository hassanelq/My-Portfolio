# Kelly criterion

**Location:** `/arcade#kelly` · **UI:** `components/arcade/kelly-game.tsx`.

Start with a simulated $1,000 bankroll and choose 1–100% to wager per flip. A session contains up to 25 independent flips with 60% win probability and even-money payouts. The bet fraction can change during play. Compare the user's balance with a fixed 20% Kelly path on the same outcomes.

Each path updates as `balance × (1 + fraction)` on a win or `balance × (1 − fraction)` on a loss. For these assumptions the Kelly fraction is `2p−1 = 20%`. The chart, balances and latest outcome update after each flip; restart resets the session. At zero, the bankroll remains zero.

Kelly maximizes expected logarithmic growth under the stated model. It does not guarantee profit over 25 flips, and overbetting does not guarantee finite-session ruin. There is no real money or market-return dataset. The balance update is `wager` in `lib/math/games.ts`; simulation controls live in the component.
