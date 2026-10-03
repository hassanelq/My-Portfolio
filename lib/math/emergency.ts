import {
  emergencyBands,
  emergencyQuestions,
  type EmergencyAnswers,
  type EmergencyQuestion,
} from "../../content/emergency";

export function monthsForScore(score: number, selfEmployed: boolean) {
  if (!Number.isInteger(score) || score < 0)
    throw new RangeError("Score must be a nonnegative integer.");
  const base = emergencyBands.find((band) => score <= band.maxScore)!.months;
  return Math.max(base, selfEmployed ? 6 : 3);
}

export function calculateEmergencyFund(
  answers: EmergencyAnswers,
  monthlySpending: number,
  saved: number,
) {
  if (
    !Number.isFinite(monthlySpending) ||
    monthlySpending <= 0 ||
    !Number.isFinite(saved) ||
    saved < 0
  )
    throw new RangeError(
      "Use positive monthly spending and nonnegative cash savings.",
    );
  const factors = (emergencyQuestions as readonly EmergencyQuestion[]).map(
    (question) => {
      const option = question.options.find(
        (choice) =>
          choice.value === answers[question.id as keyof EmergencyAnswers],
      );
      if (!option)
        throw new RangeError(`Missing or invalid answer: ${question.id}`);
      return { id: question.id, factorLabel: question.label, ...option };
    },
  );
  const score = factors.reduce((total, item) => total + item.points, 0);
  const months = monthsForScore(score, answers.pay === "self-employed");
  const target = months * monthlySpending;
  return {
    score,
    months,
    target,
    remaining: Math.max(0, target - saved),
    surplus: Math.max(0, saved - target),
    coveredMonths: saved / monthlySpending,
    progress: Math.min(1, saved / target),
    selfEmployedFloor: answers.pay === "self-employed" && score <= 4,
    factors,
    reasons: factors
      .filter((item) => item.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 2)
      .map((item) => item.reason!),
  };
}
