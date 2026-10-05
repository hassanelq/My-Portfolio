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
    label: "Your pay",
    title: "Is your pay about the same each month?",
    help: "Choose the answer that best describes how you earn money.",
    options: [
      {
        value: "steady",
        label: "About the same each month",
        detail: "A regular salary or other reliable monthly pay",
        points: 0,
      },
      {
        value: "variable",
        label: "My pay changes or sometimes stops",
        detail: "My hours, jobs or payments change from month to month",
        points: 2,
        reason: "Your income can vary or stop between jobs.",
      },
      {
        value: "self-employed",
        label: "I work for myself",
        detail: "Freelance work or running my own business",
        points: 3,
        reason: "You depend on income from your own work or business.",
      },
    ],
  },
  {
    id: "support",
    label: "Job-loss payments",
    title:
      "If you lost your job, would you receive payments to help with bills?",
    help: "Think of unemployment benefits or job-loss insurance. Only count payments you know you could receive. Choose “I’m not sure” if you do not know.",
    options: [
      {
        value: "covered",
        label: "Yes, enough for most basic bills",
        detail: "I know I can receive payments that cover most of what I need",
        points: 0,
      },
      {
        value: "partial",
        label: "Yes, but only part of what I need",
        detail: "The payments would be small or would end quickly",
        points: 1,
        reason: "Job-loss payments would cover only some of your bills.",
      },
      {
        value: "none",
        label: "No payments",
        detail: "You would rely on your own savings",
        points: 2,
        reason: "You would have no unemployment pay to fall back on.",
      },
      {
        value: "unsure",
        label: "I’m not sure",
        detail: "Use the same cushion as no payments for now",
        points: 2,
        reason: "You do not know if you would receive job-loss payments.",
      },
    ],
  },
  {
    id: "dependents",
    label: "People you support",
    title: "Who relies on you to pay their bills?",
    help: "Include children, a partner, parents or anyone whose food, home or other basic bills you pay.",
    options: [
      {
        value: "none",
        label: "Just me",
        detail: "No one else relies on my income",
        points: 0,
      },
      {
        value: "shared",
        label: "I help others, and someone else helps too",
        detail: "Another person also regularly pays some of their bills",
        points: 1,
        reason: "Others depend partly on your income.",
      },
      {
        value: "sole",
        label: "Others rely mostly on me",
        detail: "I pay most of their basic bills",
        points: 2,
        reason: "Others rely mainly on your income.",
      },
    ],
  },
  {
    id: "housing",
    label: "Home and regular bills",
    title: "How much of your pay goes to your home and regular bills?",
    help: "Add rent or home-loan payments and regular home bills. Compare that with the pay you receive after deductions. Use a typical month if your pay changes.",
    options: [
      {
        value: "owned",
        label: "I own my home with no loan and low bills",
        detail: "No home loan, and bills use at most 300 of every 1,000 I earn",
        points: 0,
      },
      {
        value: "low",
        label: "Up to 30% of my pay",
        detail: "Up to 300 of every 1,000 I earn",
        points: 0,
      },
      {
        value: "medium",
        label: "Over 30%, up to 60% of my pay",
        detail: "More than 300, up to 600 of every 1,000 I earn",
        points: 1,
        reason: "Your home and regular bills use a large part of your pay.",
      },
      {
        value: "high",
        label: "Over 60%, or I have no pay right now",
        detail:
          "More than 600 of every 1,000 I earn, or no pay to cover the bills",
        points: 2,
        reason: "Your home and regular bills leave little money to spare.",
      },
    ],
  },
  {
    id: "work",
    label: "Time to find work",
    title: "If your pay stopped, how long might it take to earn again?",
    help: "Think about finding another job or enough paying customers. Your best estimate is fine.",
    options: [
      {
        value: "quick",
        label: "Under 3 months",
        detail: "I could probably find paid work fairly quickly",
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
        detail: "Finding a job or customers could take more than half a year",
        points: 2,
        reason: "Replacing your income could take more than six months.",
      },
      {
        value: "unsure",
        label: "I’m not sure",
        detail: "Use the same cushion as more than 6 months for now",
        points: 2,
        reason: "You are unsure how long finding paid work would take.",
      },
    ],
  },
  {
    id: "crisis",
    label: "Work during hard times",
    title:
      "When businesses struggle, could your work be among the first to stop?",
    help: "For example, would customers quickly cancel orders, or would your employer cut hours or jobs?",
    options: [
      {
        value: "low",
        label: "Probably not",
        detail: "People usually still need my work in hard times",
        points: 0,
      },
      {
        value: "high",
        label: "Yes, likely",
        detail: "Customers or employers tend to cut this work quickly",
        points: 2,
        reason: "Your work could slow down quickly when businesses struggle.",
      },
      {
        value: "unsure",
        label: "I’m not sure",
        detail: "Add a little extra room because I do not know",
        points: 1,
        reason: "You are unsure how your work would hold up in hard times.",
      },
    ],
  },
  {
    id: "loans",
    label: "Loan payments",
    title: "Would you still have loans to pay if your income stopped?",
    help: "Include your home loan, car loan and other payments you could not stop. Compare the total with your usual take-home pay. Include each payment only once in your monthly spending amount.",
    options: [
      {
        value: "none",
        label: "No loan payments",
        detail: "I would not have any loans to keep paying",
        points: 0,
      },
      {
        value: "low",
        label: "Yes, less than 20% of my pay",
        detail: "Less than 200 of every 1,000 I earn",
        points: 1,
        reason: "You would still have loans to pay.",
      },
      {
        value: "high",
        label: "Yes, 20% or more, or no pay right now",
        detail:
          "At least 200 of every 1,000 I earn, or loans to pay with no income",
        points: 2,
        reason: "Your loan payments could make money tight.",
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
