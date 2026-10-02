import { inverseNormal, normalPDF } from "./normal";
export function valueAtRisk(
  value: number,
  vol: number,
  days: number,
  confidence: number,
) {
  const z = inverseNormal(confidence),
    horizonVol = vol * Math.sqrt(days / 252);
  return {
    z,
    horizonVol,
    varValue: value * horizonVol * z,
    expectedShortfall: (value * horizonVol * normalPDF(z)) / (1 - confidence),
  };
}
export function dcf(
  fcf: number,
  growth: number,
  wacc: number,
  terminalGrowth: number,
) {
  if (wacc <= terminalGrowth || wacc <= -1 || growth <= -1) return null;
  const flows = Array.from(
    { length: 5 },
    (_, i) => fcf * Math.pow(1 + growth, i),
  );
  const explicit = flows.reduce(
    (s, v, i) => s + v / Math.pow(1 + wacc, i + 1),
    0,
  );
  const terminal =
    (flows[4] * (1 + terminalGrowth)) /
    (wacc - terminalGrowth) /
    Math.pow(1 + wacc, 5);
  return { explicit, terminal, total: explicit + terminal, flows };
}
export interface DCAInputs {
  starting: number;
  monthly: number;
  age: number;
  targetAge: number;
  inflation: number;
}
export function compound(inputs: DCAInputs, annualRate: number) {
  const { starting, monthly, age, targetAge, inflation } = inputs;
  if (targetAge <= age || inflation <= -100 || annualRate <= -100)
    throw new RangeError(
      "Use a positive horizon and annual rates above −100%.",
    );
  const months = Math.round((targetAge - age) * 12),
    factor = Math.pow(1 + annualRate / 100, 1 / 12);
  let nominal = starting;
  const points = [{ x: age, y: starting }];
  for (let m = 1; m <= months; m++) {
    nominal = nominal * factor + monthly;
    if (m % 12 === 0 || m === months)
      points.push({
        x: age + m / 12,
        y: nominal / Math.pow(1 + inflation / 100, m / 12),
      });
  }
  return {
    points,
    nominal,
    real: points.at(-1)!.y,
    contributed: starting + monthly * months,
  };
}
