"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowRight, Heart, RotateCcw } from "lucide-react";
import { correlationCloud } from "@/lib/math/games";
import { seededRandom } from "@/lib/math/normal";
import { number } from "@/lib/utils";
import { Instrument, RangeField, Metric } from "@/components/lab/shared";
const storageKey = "heq-correlation-records";
function getSnapshot() {
  try {
    return localStorage.getItem(storageKey) ?? "{}";
  } catch {
    return "{}";
  }
}
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("heq-record", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("heq-record", listener);
  };
}
function saveRecord(score: number, streak: number) {
  try {
    const current = JSON.parse(getSnapshot());
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        score: Math.max(Number(current.score) || 0, score),
        streak: Math.max(Number(current.streak) || 0, streak),
      }),
    );
    window.dispatchEvent(new Event("heq-record"));
  } catch {
    /* The game remains playable if browser storage is unavailable. */
  }
}
export default function CorrelationGame() {
  const [seed, setSeed] = useState(233),
    [guess, setGuess] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [score, setScore] = useState(0),
    [lives, setLives] = useState(3),
    [streak, setStreak] = useState(0);
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => "{}");
  let record = { score: 0, streak: 0 };
  try {
    record = { ...record, ...JSON.parse(stored) };
  } catch {}
  const rho = seededRandom(seed)() * 1.9 - 0.95,
    points = useMemo(() => correlationCloud(seed + 1, rho), [seed, rho]);
  const error = answer === null ? null : Math.abs(answer - rho),
    extent =
      Math.max(3.3, ...points.flatMap((p) => [Math.abs(p.x), Math.abs(p.y)])) *
      1.08,
    X = (v: number) => 300 + (v / extent) * 250,
    Y = (v: number) => 160 - (v / extent) * 140;
  function submit() {
    if (answer !== null || lives === 0) return;
    const distance = Math.abs(guess - rho),
      earned = distance <= 0.05 ? 100 : distance <= 0.15 ? 50 : 0,
      newStreak = distance <= 0.05 ? streak + 1 : 0;
    setAnswer(guess);
    setScore(score + earned);
    setStreak(newStreak);
    if (!earned) setLives(lives - 1);
    saveRecord(score + earned, newStreak);
  }
  function next() {
    setSeed(Math.floor(Math.random() * 1e9));
    setGuess(0);
    setAnswer(null);
    if (lives === 0) {
      setScore(0);
      setLives(3);
      setStreak(0);
    }
  }
  return (
    <Instrument
      id="correlation"
      number="02"
      title="Guess the correlation"
      subtitle="HOW STRONG IS THE RELATIONSHIP?"
      footnote="80 points, one Pearson correlation. Within 0.05: +100 and a streak. Within 0.15: +50. Otherwise, lose a life. A close guess resets the bullseye streak. Personal records stay in this browser when storage is available."
    >
      <div className="game-topbar">
        <span>
          SCORE {score} · STREAK {streak}
        </span>
        <span className="game-lives" aria-label={`${lives} lives remaining`}>
          {[0, 1, 2].map((i) => (
            <Heart
              key={i}
              size={15}
              fill={i < lives ? "currentColor" : "none"}
              style={{ opacity: i < lives ? 1 : 0.3 }}
            />
          ))}{" "}
          <span>{lives} / 3</span>
        </span>
      </div>
      <div className="instrument-grid equal">
        <div>
          <svg
            className="chart"
            viewBox="0 0 600 320"
            role="img"
            aria-label="Scatter plot of 80 points. Estimate their linear correlation."
          >
            <line x1={50} x2={550} y1={160} y2={160} stroke="#333" />
            <line x1={300} x2={300} y1={20} y2={300} stroke="#333" />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={X(p.x)}
                cy={Y(p.y)}
                r={3.5}
                fill="#bca577"
                fillOpacity=".8"
              />
            ))}
            {answer !== null && (
              <line
                x1={X(-extent)}
                x2={X(extent)}
                y1={Y(-extent * rho)}
                y2={Y(extent * rho)}
                stroke="#f3f3f3"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </div>
        <div className="game-control-panel">
          <h3>
            Trust your eyes.
            <br />
            Then check the numbers.
          </h3>
          <p>
            From −1 (perfectly opposite) to +1 (moving together). Zero means no
            linear relationship.
          </p>
          <RangeField
            label="YOUR ESTIMATE OF ρ"
            min={-1}
            max={1}
            step={0.01}
            value={guess}
            onChange={(v) => {
              if (answer === null) setGuess(v);
            }}
          />
          <button
            className="button button-small"
            disabled={answer !== null || lives === 0}
            onClick={submit}
          >
            Submit guess <ArrowRight size={14} />
          </button>
          <div className="metric-grid">
            <Metric label="Personal best" value={record.score ?? 0} />
            <Metric label="Best streak" value={record.streak ?? 0} />
          </div>
        </div>
      </div>
      {answer !== null && (
        <div className="game-feedback" aria-live="polite">
          <div>
            <p>
              {error! <= 0.05
                ? "Bullseye. +100 points."
                : error! <= 0.15
                  ? "Close. +50 points."
                  : "Miss. One life lost."}{" "}
              {lives === 0 ? `Game over — ${score} points.` : ""}
            </p>
            <small>
              True ρ: {number(rho, 3)} · Your guess: {number(answer, 2)} ·
              Difference: {number(error!, 3)}. The white line is the fitted
              regression.
            </small>
          </div>
          <button className="button button-small" onClick={next}>
            {lives === 0 ? "Play again" : "Next plot"}
            {lives === 0 ? <RotateCcw size={14} /> : <ArrowRight size={14} />}
          </button>
        </div>
      )}
    </Instrument>
  );
}
