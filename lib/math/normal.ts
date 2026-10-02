export const normalPDF = (x: number) =>
  Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
export function normalCDF(x: number): number {
  if (x === 0) return 0.5;
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const poly =
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const cdf = 1 - normalPDF(x) * poly;
  return x < 0 ? 1 - cdf : cdf;
}
export function inverseNormal(p: number) {
  if (!(p > 0 && p < 1))
    throw new RangeError("Probability must be between zero and one.");
  let low = -10,
    high = 10;
  for (let i = 0; i < 70; i++) {
    const middle = (low + high) / 2;
    if (normalCDF(middle) < p) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}
export function seededRandom(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function gaussian(random: () => number) {
  return (
    Math.sqrt(-2 * Math.log(Math.max(1e-12, random()))) *
    Math.cos(2 * Math.PI * random())
  );
}
export function quantile(sorted: number[], p: number) {
  const i = (sorted.length - 1) * p,
    low = Math.floor(i);
  return (
    sorted[low] +
    (sorted[Math.min(low + 1, sorted.length - 1)] - sorted[low]) * (i - low)
  );
}
export function mean(values: number[]) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}
export function correlation(points: { x: number; y: number }[]) {
  const mx = mean(points.map((p) => p.x)),
    my = mean(points.map((p) => p.y));
  let xx = 0,
    yy = 0,
    xy = 0;
  for (const p of points) {
    const x = p.x - mx,
      y = p.y - my;
    xx += x * x;
    yy += y * y;
    xy += x * y;
  }
  return xx * yy > 0 ? xy / Math.sqrt(xx * yy) : 0;
}
