"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { wager } from "@/lib/math/games";
import { money } from "@/lib/utils";
import { ChartLegend, LineChart } from "@/components/ui/chart";
import {
  Instrument,
  RangeField,
  Metric,
  Formula,
} from "@/components/lab/shared";
export default function KellyGame() {
  const [bet, setBet] = useState(20),
    [history, setHistory] = useState([{ user: 1000, kelly: 1000 }]),
    [lastWin, setLastWin] = useState<boolean | null>(null),
    [flipping, setFlipping] = useState(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const round = history.length - 1,
    current = history.at(-1)!,
    done = round >= 25;
  function flip() {
    if (done || flipping) return;
    const win = Math.random() < 0.6,
      fraction = bet / 100;
    setFlipping(true);
    timer.current = setTimeout(() => {
      setHistory((h) => {
        const last = h.at(-1)!;
        return [
          ...h,
          {
            user: wager(last.user, fraction, win),
            kelly: wager(last.kelly, 0.2, win),
          },
        ];
      });
      setLastWin(win);
      setFlipping(false);
    }, 360);
  }
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setFlipping(false);
    setHistory([{ user: 1000, kelly: 1000 }]);
    setLastWin(null);
  }
  const series = [
    {
      label: "Your bankroll",
      color: "#f3f3f3",
      points: history.map((p, x) => ({ x, y: p.user })),
    },
    {
      label: "20% Kelly",
      color: "#bca577",
      dashed: true,
      points: history.map((p, x) => ({ x, y: p.kelly })),
    },
  ];
  return (
    <Instrument
      id="kelly"
      number="03"
      title="An edge is not enough"
      subtitle="THE KELLY CRITERION"
      footnote="A simulated coin with independent 60% wins and even-money payouts. Both paths get exactly the same outcomes. Kelly maximizes expected log growth under these assumptions; it does not guarantee a profit over 25 flips. At zero, your bankroll stays at zero."
    >
      <div className="game-topbar">
        <span>FLIP {round} / 25</span>
        <span>60% WIN PROBABILITY · 1:1 PAYOUT</span>
      </div>
      <div className="instrument-grid equal">
        <div>
          <LineChart
            label="Your bankroll compared with a fixed 20% Kelly strategy"
            series={series}
            xDomain={[0, 25]}
            xLabel="coin flip"
            yLabel="bankroll ($)"
            references={[{ y: 1000, label: "starting bankroll" }]}
          />
          <ChartLegend series={series} />
        </div>
        <div className="game-control-panel kelly-controls">
          <h3>
            Pick your bet.
            <br />
            Live with the drawdown.
          </h3>
          <p>
            Start with $1,000. Bet a fraction of what remains. The gold line
            always bets 20%.
          </p>
          <RangeField
            label="BET PER FLIP"
            value={bet}
            onChange={(v) => {
              if (!flipping) setBet(v);
            }}
            min={1}
            max={100}
            suffix="%"
          />
          <div className="game-actions">
            <button
              className="button button-small"
              disabled={done || flipping}
              onClick={flip}
            >
              {flipping
                ? "Flipping…"
                : done
                  ? "25 flips complete"
                  : `Flip · bet ${money((current.user * bet) / 100, "USD", 2)}`}
            </button>
            <button
              className="icon-button"
              aria-label="Restart Kelly game"
              onClick={reset}
            >
              <RotateCcw size={16} />
            </button>
          </div>
          <div
            className={`coin-result ${flipping ? "flipping" : ""}`}
            aria-live="polite"
          >
            {flipping
              ? "◌"
              : done
                ? `Finished. ${current.user >= current.kelly ? "Your path came out ahead." : "Kelly’s path came out ahead."}`
                : lastWin === null
                  ? "Your first flip is waiting."
                  : lastWin
                    ? "Win. Your wager is added."
                    : "Loss. Your wager is deducted."}
          </div>
          <div className="metric-grid">
            <Metric
              label="Your bankroll"
              value={money(current.user, "USD", 2)}
            />
            <Metric
              label="Kelly bankroll"
              value={money(current.kelly, "USD", 2)}
            />
          </div>
          <Formula tex={String.raw`f^* = p - (1-p) = 0.60 - 0.40 = 20\%`} />
        </div>
      </div>
    </Instrument>
  );
}
