import { describe, expect, it } from "vitest";
import {
  emergencyQuestions,
  type EmergencyAnswers,
} from "../../content/emergency";
import { calculateEmergencyFund, monthsForScore } from "./emergency";

const low: EmergencyAnswers = {
  pay: "steady",
  support: "covered",
  dependents: "none",
  housing: "low",
  work: "quick",
  crisis: "low",
  loans: "none",
};

describe("emergency cash rules", () => {
  it("uses every specified band boundary and the self-employment floor", () => {
    const boundaries = [
      [0, 3],
      [4, 3],
      [5, 6],
      [7, 6],
      [8, 9],
      [9, 12],
      [15, 12],
    ];
    for (const [score, months] of boundaries) {
      expect(monthsForScore(score, false)).toBe(months);
      expect(monthsForScore(score, true)).toBe(Math.max(months, 6));
    }
    const self = calculateEmergencyFund(
      { ...low, pay: "self-employed" },
      3000,
      0,
    );
    expect(self.score).toBe(3);
    expect(self.selfEmployedFloor).toBe(true);
    expect(self.target).toBe(18000);
  });
  it("uses essential spending once and existing cash only to measure coverage", () => {
    const plan = calculateEmergencyFund(low, 3000, 2000);
    expect(plan.months).toBe(3);
    expect(plan.target).toBe(9000);
    expect(plan.remaining).toBe(7000);
    expect(plan.coveredMonths).toBeCloseTo(2 / 3);
    expect(plan.progress).toBeCloseTo(2 / 9);
    expect(calculateEmergencyFund(low, 6000, 2000).target).toBe(18000);
    const funded = calculateEmergencyFund(low, 3000, 10000);
    expect(funded.months).toBe(3);
    expect(funded.remaining).toBe(0);
    expect(funded.progress).toBe(1);
    expect(funded.surplus).toBe(1000);
  });
  it("explains the largest scored commitments and treats uncertainty explicitly", () => {
    const plan = calculateEmergencyFund(
      {
        ...low,
        pay: "self-employed",
        support: "unsure",
        dependents: "sole",
        housing: "high",
        work: "unsure",
        crisis: "unsure",
        loans: "high",
      },
      4000,
      0,
    );
    expect(plan.score).toBe(14);
    expect(plan.months).toBe(12);
    expect(plan.target).toBe(48000);
    expect(plan.reasons).toEqual([
      "You depend on income from your own work or business.",
      "Unemployment support is not confirmed.",
    ]);
    expect(plan.selfEmployedFloor).toBe(false);
  });
  it("rejects missing or unknown answers and invalid money instead of guessing", () => {
    expect(() =>
      calculateEmergencyFund({ ...low, pay: "" }, 3000, 0),
    ).toThrow();
    expect(() =>
      calculateEmergencyFund({ ...low, work: "invented" }, 3000, 0),
    ).toThrow();
    for (const value of [0, -1, Infinity, NaN])
      expect(() => calculateEmergencyFund(low, value, 0)).toThrow();
    for (const value of [-1, Infinity, NaN])
      expect(() => calculateEmergencyFund(low, 3000, value)).toThrow();
    for (const score of [-1, 1.5, Infinity, NaN])
      expect(() => monthsForScore(score, false)).toThrow();
  });
  it("produces finite consistent targets for every supported combination without mutating answers", () => {
    let combinations: EmergencyAnswers[] = [{ ...low }];
    for (const question of emergencyQuestions)
      combinations = combinations.flatMap((answer) =>
        question.options.map((option) => ({
          ...answer,
          [question.id]: option.value,
        })),
      );
    const counts = new Set<number>();
    expect(combinations).toHaveLength(5184);
    for (const answers of combinations) {
      Object.freeze(answers);
      const result = calculateEmergencyFund(answers, 1234, 500);
      expect([3, 6, 9, 12]).toContain(result.months);
      if (answers.pay === "self-employed")
        expect(result.months).toBeGreaterThanOrEqual(6);
      expect(result.target).toBe(result.months * 1234);
      expect(result.remaining).toBe(result.target - 500);
      expect(result.reasons.every((reason) => typeof reason === "string")).toBe(
        true,
      );
      counts.add(result.months);
    }
    expect([...counts].sort((a, b) => a - b)).toEqual([3, 6, 9, 12]);
  });
});
