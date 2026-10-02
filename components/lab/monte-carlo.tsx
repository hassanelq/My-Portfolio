"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { simulate, type SimulationResult } from "@/lib/math/simulation";
import { money, number } from "@/lib/utils";
import { Instrument, NumberField, Readouts } from "./shared";
function CanvasPaths({ result }: { result: SimulationResult }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => {
      const width = canvas.clientWidth,
        height = 290,
        dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      const allMax = Math.max(...result.paths.map((p) => Math.max(...p))),
        allMin = Math.min(...result.paths.map((p) => Math.min(...p))),
        range = Math.max(1, allMax - allMin),
        top = 15,
        bottom = 28,
        left = 12;
      const X = (i: number) => left + (i / result.steps) * (width - left - 10),
        Y = (v: number) =>
          top + ((allMax - v) / range) * (height - top - bottom);
      ctx.strokeStyle = "#292929";
      ctx.lineWidth = 0.7;
      for (let i = 0; i < 4; i++) {
        const y = top + ((height - top - bottom) * i) / 3;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(width - 10, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(189,176,149,.06)";
      ctx.lineWidth = 0.7;
      for (const path of result.paths) {
        ctx.beginPath();
        path.forEach((v, i) =>
          i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)),
        );
        ctx.stroke();
      }
      ctx.strokeStyle = "#f3f3f3";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      result.meanPath.forEach((v, i) =>
        i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)),
      );
      ctx.stroke();
      ctx.fillStyle = "#8d8d8d";
      ctx.font = "12px monospace";
      ctx.fillText("START", left, height - 6);
      ctx.textAlign = "right";
      ctx.fillText("TERMINAL", width - 10, height - 6);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [result]);
  return (
    <canvas
      ref={ref}
      className="canvas-chart"
      role="img"
      aria-label={`1,000 simulated investment paths; terminal mean ${money(result.mean)}, fifth percentile ${money(result.p5)}, ninety-fifth percentile ${money(result.p95)}.`}
    />
  );
}
export default function MonteCarlo() {
  const [start, setStart] = useState(10000),
    [drift, setDrift] = useState(7),
    [vol, setVol] = useState(18),
    [years, setYears] = useState(1),
    [result, setResult] = useState(() =>
      simulate({ start: 10000, drift: 0.07, vol: 0.18, years: 1, seed: 42 }),
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [runYears, setRunYears] = useState(1);
  const worker = useRef<Worker | null>(null),
    runRef = useRef(1);
  useEffect(() => {
    const instance = new Worker(
      new URL("./monte-carlo.worker.ts", import.meta.url),
    );
    worker.current = instance;
    instance.onmessage = (
      event: MessageEvent<{ result?: SimulationResult; error?: string }>,
    ) => {
      if (event.data.result) {
        setResult(event.data.result);
        setRunYears(runRef.current);
      }
      setError(event.data.error ?? "");
      setBusy(false);
    };
    instance.onerror = () => {
      setError("The simulation could not finish. Please try again.");
      setBusy(false);
    };
    return () => instance.terminate();
  }, []);
  function run() {
    if (!worker.current) return;
    setBusy(true);
    setError("");
    runRef.current = years;
    worker.current.postMessage({
      start,
      drift: drift / 100,
      vol: vol / 100,
      years,
      seed: Date.now(),
    });
  }
  return (
    <Instrument
      id="monte-carlo"
      number="02"
      title="Monte Carlo · 1,000 paths"
      subtitle="A THOUSAND POSSIBLE TOMORROWS"
      footnote="Geometric Brownian motion with constant drift and volatility. Each simulation draws a new sample; the white curve is the cross-sectional mean. Results describe this model, not a forecast."
    >
      <div className="controls">
        <NumberField
          label="START VALUE ($)"
          value={start}
          onChange={setStart}
          min={1}
          max={10000000}
          step={1}
        />
        <NumberField
          label="DRIFT (% / YEAR)"
          value={drift}
          onChange={setDrift}
          min={-30}
          max={50}
          step={0.5}
        />
        <NumberField
          label="VOLATILITY (% / YEAR)"
          value={vol}
          onChange={setVol}
          min={0}
          max={100}
          step={0.5}
        />
        <NumberField
          label="HORIZON (YEARS)"
          value={years}
          onChange={setYears}
          min={0.1}
          max={5}
          step={0.1}
        />
        <button
          className="button button-outline button-small"
          onClick={run}
          disabled={busy}
        >
          <RotateCw size={14} />
          {busy ? "Simulating…" : "Simulate"}
        </button>
      </div>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      <div className="instrument-grid" aria-busy={busy}>
        <div>
          <CanvasPaths result={result} />
          <p className="chart-caption">
            {runYears} years · 1,000 paths · {result.steps} time steps · Change
            inputs, then simulate.
          </p>
        </div>
        <Readouts
          items={[
            { label: "Mean terminal value", value: money(result.mean) },
            {
              label: "P5 / P95",
              value: `${money(result.p5)} / ${money(result.p95)}`,
            },
            { label: "VaR (95%, loss)", value: money(result.var95) },
            { label: "Expected shortfall (loss)", value: money(result.es95) },
            {
              label: "Probability of profit",
              value: `${number(result.profitProbability * 100, 1)}%`,
            },
            {
              label: "Best / worst terminal",
              value: `${money(result.max)} / ${money(result.min)}`,
            },
          ]}
        />
      </div>
    </Instrument>
  );
}
