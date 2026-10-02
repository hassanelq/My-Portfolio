export type ProjectCategory = "quant" | "ai" | "systems";
export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  label: string;
  // YYYY, YYYY-MM or YYYY-MM-DD, using only the precision supported by the source.
  realizedAt: string;
  description: string;
  highlights: string[];
  stack: string[];
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  reportUrl?: string;
  metric?: { value: string; label: string };
}
export const categories: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All projects" },
  { id: "quant", label: "Quantitative finance" },
  { id: "ai", label: "AI & data science" },
  { id: "systems", label: "Full-stack & systems" },
];
// Repository links come from the supplied CV or prior GitHub verification. Omit unavailable links.
const projectEntries: Project[] = [
  {
    id: "options-pricing",
    title: "Options pricing",
    category: "quant",
    label: "DERIVATIVES / VALUATION",
    realizedAt: "2025",
    description:
      "An interactive option valuation application comparing Black-Scholes analytical prices with Monte Carlo estimates.",
    highlights: [
      "Simulates underlying asset dynamics using a stochastic Euler scheme.",
      "Explores option values and sensitivities across market and contract parameters.",
    ],
    stack: ["Python", "FastAPI", "Next.js", "NumPy"],
    githubUrl: "https://github.com/hassanelq/Options-pricing",
    liveUrl: "https://options-price.vercel.app/",
  },
  {
    // Preserve the original public anchor for the research/calibration project.
    id: "options-calibration",
    title: "Heston model calibration",
    category: "quant",
    label: "DERIVATIVES / HIGH-PERFORMANCE COMPUTING",
    realizedAt: "2025",
    featured: true,
    description:
      "A stochastic-volatility calibration study using SPX option implied volatility surfaces to compare numerical optimization, FFT, and deep learning.",
    highlights: [
      "Calibrates Heston parameters against market implied volatility smiles.",
      "Benchmarks closed-form, FFT, and neural calibration for accuracy and computation time.",
    ],
    stack: ["Python", "PyTorch", "NumPy", "SciPy"],
    metric: { value: "0.12s", label: "neural calibration" },
    githubUrl:
      "https://github.com/hassanelq/heston-model-calibration-deep-learning",
    reportUrl: "/PFA_Calibration_Heston_Hassan_ELQADI.pdf",
  },
  {
    id: "portfolio-optimization",
    title: "Portfolio optimization & stress-testing",
    category: "quant",
    label: "RISK / ASSET ALLOCATION",
    realizedAt: "2026",
    featured: true,
    description:
      "An allocation framework that combines portfolio theory with Entropy Pooling and copulas to explore how portfolios behave under stress.",
    highlights: [
      "Markowitz, Black-Litterman, and risk parity strategies.",
      "Non-normal macro scenarios and nonlinear tail dependencies.",
    ],
    stack: ["Python", "CVXPY", "Pandas", "SciPy"],
    metric: { value: "1st", label: "ENSA portfolio challenge" },
    githubUrl: "https://github.com/hassanelq/portfolio-optimisation",
  },
  {
    id: "yield-curves",
    title: "Yield curves & interest rate swaps",
    category: "quant",
    label: "FIXED INCOME / TERM STRUCTURE",
    realizedAt: "2025",
    description:
      "Bootstrapping discount curves and exploring short-rate dynamics for fixed-income valuation and interest rate sensitivity.",
    highlights: [
      "Zero-coupon, discount, and forward curves.",
      "Vasicek / CIR modeling and fixed-for-floating swap valuation.",
    ],
    stack: ["Python", "NumPy", "SciPy", "Vasicek", "CIR"],
    githubUrl: "https://github.com/hassanelq/Interest-rate-swaps-pricing",
  },
  {
    id: "finbert",
    title: "Financial sentiment with FinBERT",
    category: "ai",
    label: "NLP / MARKET DATA",
    realizedAt: "2025",
    description:
      "A financial text pipeline that turns news and social feeds into structured sentiment signals and an accessible analytics dashboard.",
    highlights: [
      "Collects headlines from Finviz, Reddit, and market social feeds.",
      "Domain-specific FinBERT classification served through FastAPI.",
    ],
    stack: ["FinBERT", "FastAPI", "Next.js", "Docker"],
    githubUrl: "https://github.com/hassanelq/Stocks-sentiment-analysis",
    liveUrl: "https://stocks-sentiment-analysis0.vercel.app/",
  },
  {
    id: "artisan-erp",
    title: "Dar-Dmana Decor workshop ERP",
    category: "systems",
    label: "CLIENT WORK / OPERATIONS",
    realizedAt: "2026",
    featured: true,
    description:
      "A production platform for a Moroccan artisan workshop, following each bespoke order from intake through quality control and delivery.",
    highlights: [
      "Role-based assignments and a traceable production workflow.",
      "Order specifications, stage history, and operational reporting.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Node.js"],
    metric: { value: "End to end", label: "production visibility" },
  },
  {
    id: "math-platform",
    title: "STEM learning & Olympiad community",
    category: "systems",
    label: "CLIENT WORK / EDUCATION",
    realizedAt: "2026",
    description:
      "A learning hub for Professor Saad Choukri, bringing university mathematics, Olympiad problems, and student discussion together.",
    highlights: [
      "Searchable courses, exercises, and solutions.",
      "Community questions with mathematical typesetting.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "KaTeX"],
    githubUrl: "https://github.com/hassanelq/Aleph-Math",
  },
  {
    id: "real-estate",
    title: "Agadir real estate valuation",
    category: "ai",
    label: "MACHINE LEARNING / PROPERTY",
    realizedAt: "2025",
    description:
      "A property valuation pipeline combining scraped listings, feature engineering, and gradient boosting to understand Agadir’s housing market.",
    highlights: [
      "Automated data collection and spatial property features.",
      "Tuned prediction model deployed through a Flask API.",
    ],
    stack: ["Python", "LightGBM", "Scikit-learn", "Flask"],
    githubUrl: "https://github.com/hassanelq/Agadir-House-Prices-Prediction",
    liveUrl: "https://agadir-house-prices.vercel.app/",
  },
  {
    id: "ordinals",
    title: "Ordinals sales tracker & AMBcheck",
    category: "systems",
    label: "AUTOMATION / WEB3",
    realizedAt: "2024",
    description:
      "Event-driven tools for Bitcoin Ordinals communities: market activity alerts, wallet ownership verification, and automated access management.",
    highlights: [
      "Discord and Twitter transaction notifications.",
      "Wallet verification and automated community roles.",
    ],
    stack: ["Node.js", "Discord.js", "WebSocket", "MongoDB"],
    githubUrl: "https://github.com/hassanelq/bitcoin-ordinals-sales-bot",
    liveUrl: "https://bitcheck.vercel.app/",
  },
];

// Both the catalog and homepage consume this list, so ordering stays consistent.
// Same-date entries retain their order; never use repository update dates as completion dates.
export const projects = [...projectEntries].sort((a, b) =>
  b.realizedAt.localeCompare(a.realizedAt),
);

export function projectDateLabel(date: string) {
  if (date.length === 4) return date;
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date.length === 7 ? `${date}-01` : date}T00:00:00Z`));
}
