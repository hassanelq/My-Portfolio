export interface EmergencyOption {
  value: string;
  label: string;
  detail: string;
  points: number;
  reason?: string;
}
export interface EmergencyQuestion {
  id: string;
  label: string;
  title: string;
  help: string;
  options: readonly EmergencyOption[];
}

// Editorial planning weights, not an empirically fitted risk model.
// Keep explanations, editable choices and scoring in one place.
export const emergencyQuestions = [
  {
    id: "pay",
    label: "Income stability",
    title: "How steady is your income?",
    help: "Choose the description closest to your main source of income.",
    options: [
      {
        value: "steady",
        label: "Steady pay",
        detail: "About the same amount each month",
        points: 0,
      },
      {
        value: "variable",
        label: "Variable or interrupted",
        detail: "Hours, contracts or income change",
        points: 2,
        reason: "Your income can vary or stop between jobs.",
      },
      {
        value: "self-employed",
        label: "Self-employed",
        detail: "Freelance, independent work or your own business",
        points: 3,
        reason: "You depend on income from your own work or business.",
      },
    ],
  },
  {
    id: "support",
    label: "Unemployment support",
    title: "Would unemployment pay cover your essentials?",
    help: "Use the benefits you know you qualify for where you live. We do not infer eligibility from your job or country.",
    options: [
      {
        value: "covered",
        label: "Most essentials covered",
        detail: "Confirmed eligibility and meaningful support",
        points: 0,
      },
      {
        value: "partial",
        label: "Some support",
        detail: "Limited payments or a short benefit period",
        points: 1,
        reason: "Unemployment support would cover only part of your needs.",
      },
      {
        value: "none",
        label: "No support",
        detail: "You would rely on your own savings",
        points: 2,
        reason: "You would have no unemployment pay to fall back on.",
      },
      {
        value: "unsure",
        label: "I’m not sure",
        detail: "Plan without confirmed support for now",
        points: 2,
        reason: "Unemployment support is not confirmed.",
      },
    ],
  },
  {
    id: "dependents",
    label: "People depending on you",
    title: "Who depends on your income?",
    help: "Think about children, a partner, parents or anyone whose essential costs you cover.",
    options: [
      {
        value: "none",
        label: "Just me",
        detail: "No one else relies on my income",
        points: 0,
      },
      {
        value: "shared",
        label: "Others, with shared support",
        detail: "Another reliable income also supports them",
        points: 1,
        reason: "Others depend partly on your income.",
      },
      {
        value: "sole",
        label: "Others, mainly relying on me",
        detail: "You are their main financial support",
        points: 2,
        reason: "Others rely mainly on your income.",
      },
    ],
  },
  {
    id: "housing",
    label: "Home and fixed bills",
    title: "How much does your home commit you to?",
    help: "For the percentage options, include rent or mortgage and fixed household bills as a share of take-home pay. If income varies, use a typical month.",
    options: [
      {
        value: "owned",
        label: "Mortgage-free, manageable bills",
        detail:
          "You own your home outright and bills take no more than 30% of pay",
        points: 0,
      },
      {
        value: "low",
        label: "Up to 30% of pay",
        detail: "Rent, mortgage and fixed bills combined",
        points: 0,
      },
      {
        value: "medium",
        label: "More than 30%, up to 60%",
        detail: "A substantial share of income is committed",
        points: 1,
        reason:
          "Housing and fixed bills commit a substantial share of your pay.",
      },
      {
        value: "high",
        label: "More than 60%, or no income",
        detail: "High fixed costs or no current pay to cover them",
        points: 2,
        reason: "Housing and fixed bills leave little room in your income.",
      },
    ],
  },
  {
    id: "work",
    label: "Time to replace income",
    title: "How long might replacing your income take?",
    help: "Estimate time to find suitable paid work or rebuild a reliable stream of clients.",
    options: [
      {
        value: "quick",
        label: "Under 3 months",
        detail: "You expect a relatively quick return to earnings",
        points: 0,
      },
      {
        value: "medium",
        label: "3 to 6 months",
        detail: "Finding the right work could take time",
        points: 1,
        reason: "Replacing your income could take several months.",
      },
      {
        value: "long",
        label: "More than 6 months",
        detail: "A longer search or business recovery",
        points: 2,
        reason: "Replacing your income could take more than six months.",
      },
      {
        value: "unsure",
        label: "Hard to estimate",
        detail: "Use the longer-search allowance for now",
        points: 2,
        reason: "The time needed to replace your income is uncertain.",
      },
    ],
  },
  {
    id: "crisis",
    label: "Exposure to a downturn",
    title: "Would a downturn hit your work early?",
    help: "Consider how quickly customers or employers cut spending on your kind of work.",
    options: [
      {
        value: "low",
        label: "Probably not",
        detail: "Demand usually remains fairly steady",
        points: 0,
      },
      {
        value: "high",
        label: "Yes, likely",
        detail: "Work or demand tends to fall early",
        points: 2,
        reason: "Your work could be affected early in a downturn.",
      },
      {
        value: "unsure",
        label: "I’m not sure",
        detail: "Allow a little extra for uncertainty",
        points: 1,
        reason: "Your exposure to a downturn is uncertain.",
      },
    ],
  },
  {
    id: "loans",
    label: "Required loan payments",
    title: "What loan payments would still be due?",
    help: "Include mortgage and other minimum repayments you cannot pause. Their effect on flexibility is scored here; count the actual payment only once in monthly spending.",
    options: [
      {
        value: "none",
        label: "No required repayments",
        detail: "No debt payments you would need to maintain",
        points: 0,
      },
      {
        value: "low",
        label: "Under 20% of pay",
        detail: "Required repayments are a smaller share of income",
        points: 1,
        reason: "Loan repayments would still need to be maintained.",
      },
      {
        value: "high",
        label: "20% or more, or no income",
        detail: "Substantial repayments relative to current pay",
        points: 2,
        reason: "Required loan payments would put pressure on your cash.",
      },
    ],
  },
] as const satisfies readonly EmergencyQuestion[];

export type EmergencyFactor = (typeof emergencyQuestions)[number]["id"];
export type EmergencyAnswers = Record<EmergencyFactor, string>;
export const emergencyBands = [
  { maxScore: 4, months: 3 },
  { maxScore: 7, months: 6 },
  { maxScore: 8, months: 9 },
  { maxScore: Infinity, months: 12 },
] as const;
export const emergencyGuide = {
  title: "CFPB · An essential guide to building an emergency fund",
  url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
};
