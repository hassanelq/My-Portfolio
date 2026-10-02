import { seededRandom } from "./normal";
export const assets = [
  { name: "Equities", short: "E", mean: 0.085, vol: 0.18 },
  { name: "Bonds", short: "B", mean: 0.035, vol: 0.06 },
  { name: "Gold", short: "G", mean: 0.055, vol: 0.15 },
  { name: "Crypto", short: "C", mean: 0.16, vol: 0.6 },
];
export const correlations = [
  [1, 0.15, 0.1, 0.45],
  [0.15, 1, 0.05, 0.05],
  [0.1, 0.05, 1, 0.1],
  [0.45, 0.05, 0.1, 1],
];
const covariance = correlations.map((row, i) =>
  row.map((v, j) => v * assets[i].vol * assets[j].vol),
);
export interface Portfolio {
  weights: number[];
  return: number;
  risk: number;
  sharpe: number;
}
export function evaluate(weights: number[], rf: number): Portfolio {
  const ret = weights.reduce((s, w, i) => s + w * assets[i].mean, 0),
    variance = weights.reduce(
      (s, w, i) =>
        s + w * weights.reduce((t, v, j) => t + v * covariance[i][j], 0),
      0,
    );
  const risk = Math.sqrt(Math.max(0, variance));
  return { weights, return: ret, risk, sharpe: (ret - rf) / risk };
}
function solve(matrix: number[][], b: number[]) {
  const a = matrix.map((row, i) => [...row, b[i]]),
    n = b.length;
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let j = i + 1; j < n; j++)
      if (Math.abs(a[j][i]) > Math.abs(a[pivot][i])) pivot = j;
    if (Math.abs(a[pivot][i]) < 1e-12) return null;
    [a[i], a[pivot]] = [a[pivot], a[i]];
    const v = a[i][i];
    for (let k = i; k <= n; k++) a[i][k] /= v;
    for (let j = 0; j < n; j++)
      if (j !== i) {
        const f = a[j][i];
        for (let k = i; k <= n; k++) a[j][k] -= f * a[i][k];
      }
  }
  return a.map((row) => row[n]);
}
function candidates(rf: number, target?: number) {
  const result: Portfolio[] = [];
  for (let mask = 1; mask < 16; mask++) {
    const indices = assets.map((_, i) => i).filter((i) => mask & (1 << i)),
      n = indices.length;
    if (target !== undefined && n === 1) {
      if (Math.abs(assets[indices[0]].mean - target) < 1e-8)
        result.push(
          evaluate(
            assets.map((_, i) => (i === indices[0] ? 1 : 0)),
            rf,
          ),
        );
      continue;
    }
    const cov = indices.map((i) => indices.map((j) => covariance[i][j]));
    if (target !== undefined) {
      const a = cov.map((row, i) => [...row, 1, assets[indices[i]].mean]);
      a.push([...new Array(n).fill(1), 0, 0]);
      a.push([...indices.map((i) => assets[i].mean), 0, 0]);
      const sol = solve(a, [...new Array(n).fill(0), 1, target]);
      if (sol && sol.slice(0, n).every((w) => w >= -1e-9))
        result.push(
          evaluate(
            assets.map((_, i) => Math.max(0, sol[indices.indexOf(i)] ?? 0)),
            rf,
          ),
        );
    } else
      for (const rhs of [
        indices.map(() => 1),
        indices.map((i) => assets[i].mean - rf),
      ]) {
        const sol = solve(cov, rhs);
        if (!sol) continue;
        const sum = sol.reduce((s, w) => s + w, 0);
        if (sum <= 0) continue;
        const normalized = sol.map((w) => w / sum);
        if (normalized.every((w) => w >= -1e-9))
          result.push(
            evaluate(
              assets.map((_, i) =>
                Math.max(0, normalized[indices.indexOf(i)] ?? 0),
              ),
              rf,
            ),
          );
      }
  }
  return result;
}
export function portfolioCloud(seed = 42, count = 2500) {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => {
    const raw = assets.map(() => -Math.log(Math.max(1e-10, rng()))),
      total = raw.reduce((a, b) => a + b, 0);
    return evaluate(
      raw.map((v) => v / total),
      0,
    );
  });
}
export function optimize(rf: number) {
  const choices = candidates(rf),
    minVar = choices.reduce((a, b) => (a.risk < b.risk ? a : b)),
    maxSharpe = choices.reduce((a, b) => (a.sharpe > b.sharpe ? a : b));
  const frontier = Array.from(
    { length: 45 },
    (_, i) => minVar.return + ((0.16 - minVar.return) * i) / 44,
  )
    .map((target) => candidates(rf, target).sort((a, b) => a.risk - b.risk)[0])
    .filter((p): p is Portfolio => Boolean(p));
  return { minVar, maxSharpe, frontier };
}
