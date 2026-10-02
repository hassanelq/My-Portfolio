"use client";
import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import market from "@/content/market-windows.json";
import { seededRandom } from "@/lib/math/normal";
import { syntheticMatch } from "@/lib/math/games";
import { LineChart } from "@/components/ui/chart";
import { Instrument } from "@/components/lab/shared";
export default function ChartGame() {
  const [seed, setSeed] = useState(9284),
    [round, setRound] = useState(0),
    [choice, setChoice] = useState<number | null>(null),
    [score, setScore] = useState(0);
  const game = useMemo(() => {
    const rng = seededRandom(seed);
    return market.windows
      .map((window) => ({
        window,
        sort: rng(),
        side: Math.floor(rng() * 2),
        syntheticSeed: Math.floor(rng() * 1e9),
      }))
      .sort((a, b) => a.sort - b.sort);
  }, [seed]);
  const current = game[round],
    real = current.window.prices.map(
      (p) => (p / current.window.prices[0]) * 100,
    ),
    fake = syntheticMatch(current.window.prices, current.syntheticSeed);
  const paths = current.side === 0 ? [real, fake] : [fake, real],
    all = paths.flat(),
    low = Math.min(...all),
    high = Math.max(...all),
    margin = (high - low) * 0.08;
  function choose(index: number) {
    if (choice !== null) return;
    setChoice(index);
    if (index === current.side) setScore((s) => s + 1);
  }
  function next() {
    if (round === 4) {
      setSeed(Math.floor(Math.random() * 1e9));
      setScore(0);
      setRound(0);
    } else setRound(round + 1);
    setChoice(null);
  }
  return (
    <Instrument
      id="chart-test"
      number="01"
      title="The chart Turing test"
      subtitle="MARKET OR MATHEMATICS?"
      footnote="Each pair shows 90 trading observations, normalized to 100, on the same scale. The synthetic path uses geometric Brownian motion fitted to the real window’s daily log-return mean and volatility."
    >
      <div className="game-topbar">
        <span>ROUND {round + 1} / 5</span>
        <span>
          SCORE {score} / {round + (choice === null ? 0 : 1)}
        </span>
      </div>
      <p className="game-description">
        One chart is the S&P 500. One is a random walk. Pick the real market.
      </p>
      <div className="game-choices">
        {paths.map((prices, i) => (
          <button
            key={i}
            aria-label={`Chart ${i === 0 ? "A" : "B"} is the real market`}
            className={`game-chart-choice ${choice !== null ? (i === current.side ? "correct" : i === choice ? "wrong" : "") : ""}`}
            disabled={choice !== null}
            onClick={() => choose(i)}
          >
            <span>
              <span>CHART {i === 0 ? "A" : "B"}</span>
              <span>
                {choice === null
                  ? "SELECT ↗"
                  : i === current.side
                    ? "REAL MARKET"
                    : "SIMULATED"}
              </span>
            </span>
            <LineChart
              label={`Chart ${i === 0 ? "A" : "B"} price path`}
              hideAxes
              yDomain={[low - margin, high + margin]}
              series={[
                {
                  label: "Price",
                  color:
                    choice !== null && i === current.side
                      ? "#a2af89"
                      : "#e8e3d9",
                  points: prices.map((y, x) => ({ x, y })),
                },
              ]}
            />
          </button>
        ))}
      </div>
      {choice !== null && (
        <div className="game-feedback" aria-live="polite">
          <div>
            <p>
              {choice === current.side
                ? "You found the market."
                : "Randomness is a convincing storyteller."}{" "}
              {round === 4 ? `Final score: ${score}/5 (${score * 20}%).` : ""}
            </p>
            <small>
              {current.window.label} · {current.window.start} —{" "}
              {current.window.end}.{" "}
              <a href={market.source} target="_blank" rel="noopener noreferrer">
                Price data ↗
              </a>
            </small>
          </div>
          <button className="button button-small" onClick={next}>
            {round === 4 ? "Play again" : "Next pair"}
            {round === 4 ? <RotateCcw size={14} /> : <ArrowRight size={14} />}
          </button>
        </div>
      )}
    </Instrument>
  );
}
