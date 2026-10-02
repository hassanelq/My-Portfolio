import { gaussian, mean, quantile, seededRandom } from "./normal";
export interface SimulationInputs {
  start: number;
  drift: number;
  vol: number;
  years: number;
  seed: number;
  count?: number;
}
export function simulate({
  start,
  drift,
  vol,
  years,
  seed,
  count = 1000,
}: SimulationInputs) {
  const random = seededRandom(seed),
    steps = Math.max(1, Math.round(252 * years)),
    dt = years / steps;
  const paths: number[][] = [],
    meanPath = new Array<number>(steps + 1).fill(0);
  for (let i = 0; i < count; i++) {
    const path = [start];
    meanPath[0] += start / count;
    for (let j = 1; j <= steps; j++) {
      const next =
        path[j - 1] *
        Math.exp(
          (drift - (vol * vol) / 2) * dt +
            vol * Math.sqrt(dt) * gaussian(random),
        );
      path.push(next);
      meanPath[j] += next / count;
    }
    paths.push(path);
  }
  const terminals = paths.map((p) => p.at(-1)!).sort((a, b) => a - b),
    p5 = quantile(terminals, 0.05),
    p95 = quantile(terminals, 0.95);
  return {
    paths,
    meanPath,
    steps,
    p5,
    p95,
    mean: mean(terminals),
    var95: Math.max(0, start - p5),
    es95: Math.max(
      0,
      start - mean(terminals.slice(0, Math.max(1, Math.ceil(count * 0.05)))),
    ),
    profitProbability: terminals.filter((v) => v > start).length / count,
    min: terminals[0],
    max: terminals.at(-1)!,
  };
}
export type SimulationResult = ReturnType<typeof simulate>;
