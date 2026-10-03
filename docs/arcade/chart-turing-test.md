# Chart Turing test

**Location:** `/arcade#chart-test` · **UI:** `components/arcade/chart-game.tsx`.

Choose which of two charts is the real market. Each session has five rounds; after an answer the game reveals the real dates, context, source and whether the choice was correct. The final result shows score out of five and accuracy. Restart creates a new session.

## Data and comparison

- Source: [Plotly public stockdata.csv](https://github.com/plotly/datasets/blob/master/stockdata.csv).
- Series: `GSPC`, recorded daily S&P 500 index closes. No dividend reinvestment is assumed.
- Local file: `content/market-windows.json`.
- Extraction: parse dates, sort ascending, take 90 recorded observations starting on or after 2007-01-03, 2008-09-02, 2009-03-02, 2011-07-01, and 2013-01-02. Each window records its actual start/end date. These are **90 trading observations**, not 90 calendar days.
- Both charts start at 100. A simulated path draws normal daily log returns with mean and standard deviation estimated from the corresponding real window. The pair shares a vertical scale. The simulated sample need not realize exactly the same drift or volatility.
- The real dates, context label, and source link are shown after an answer. There is no live market feed or network dependency during play.

Synthetic path generation is `syntheticMatch` in `lib/math/games.ts`. The goal is to question visual pattern recognition, not establish a trading signal. When replacing the bundled windows, preserve provenance, actual dates and the 90-observation interpretation.
