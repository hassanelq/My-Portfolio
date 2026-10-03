# Guess the correlation

**Location:** `/arcade#correlation` · **UI:** `components/arcade/correlation-game.tsx`.

Estimate Pearson correlation from 80 points using a slider from −1 to +1, then submit to reveal the answer and regression line. The game starts with three lives.

| Absolute error | Result |
| --- | --- |
| ≤0.05 | +100 points and bullseye streak +1 |
| >0.05 through 0.15 | +50 points, keep a life, reset bullseye streak |
| >0.15 | Lose a life and reset the streak |

Best score and best streak are saved in localStorage when available. Three misses end the game; the player can restart.

`correlationCloud` in `lib/math/games.ts` centers, normalizes and orthogonalizes generated samples so sample Pearson correlation matches the chosen target. Targets vary approximately between −0.95 and +0.95. This trains linear-correlation intuition; it does not establish causation or test general nonlinear dependence. Math and browser checks cover generation and scoring behavior.
