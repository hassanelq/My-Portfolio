import { gaussian, mean, seededRandom } from "./normal";
// Center, normalize and orthogonalize to make sample correlation equal rho.
export function correlationCloud(seed: number, rho: number, count = 80) {
  const rng = seededRandom(seed),
    rawX = Array.from({ length: count }, () => gaussian(rng)),
    rawZ = Array.from({ length: count }, () => gaussian(rng));
  const mx = mean(rawX),
    mz = mean(rawZ),
    x = rawX.map((v) => v - mx),
    z = rawZ.map((v) => v - mz);
  const xnorm = Math.sqrt(x.reduce((s, v) => s + v * v, 0));
  for (let i = 0; i < count; i++) x[i] /= xnorm;
  const projection = z.reduce((s, v, i) => s + v * x[i], 0);
  for (let i = 0; i < count; i++) z[i] -= projection * x[i];
  const znorm = Math.sqrt(z.reduce((s, v) => s + v * v, 0)),
    scale = Math.sqrt(count - 1);
  return x.map((v, i) => ({
    x: v * scale,
    y: (rho * v + (Math.sqrt(1 - rho * rho) * z[i]) / znorm) * scale,
  }));
}
export function syntheticMatch(prices: number[], seed: number) {
  const logReturns = prices.slice(1).map((p, i) => Math.log(p / prices[i]));
  const drift = mean(logReturns),
    sigma = Math.sqrt(mean(logReturns.map((r) => (r - drift) ** 2))),
    rng = seededRandom(seed),
    path = [100];
  for (let i = 1; i < prices.length; i++)
    path.push(path[i - 1] * Math.exp(drift + sigma * gaussian(rng)));
  return path;
}
export function wager(balance: number, fraction: number, win: boolean) {
  return balance * (1 + (win ? fraction : -fraction));
}
