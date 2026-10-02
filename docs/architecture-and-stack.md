# Portfolio Platform: Technical Architecture & Stack Specification

This document details the unified software architecture, routing structure, mathematical algorithms, rendering strategy, and deployment configuration for Hassan EL QADI's interactive web platform.

> This is an earlier technical blueprint. For the chosen framework version, build order, and visual precedence, use [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) and [`DESIGN.md`](DESIGN.md).

---

## 1. System Technology Stack

| Layer             | Technology                    | Rationale                                                                                                                              |
| :---------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | **Next.js 15 (App Router)**   | Modern React 19 architecture, fast server-side rendering, and static asset optimization                                                |
| **Language**      | **TypeScript 5.x**            | Strict typing for financial contracts, instrument parameters, and state management                                                     |
| **Styling**       | **Tailwind CSS**              | Utility-first, responsive, dark-mode first aesthetic ("Bloomberg/Linear Quant")                                                        |
| **UI Components** | **shadcn/ui**                 | Accessible, headless primitives (Sliders, Tabs, Dialogs, Cards, Badges)                                                                |
| **Icons**         | **Lucide React**              | Lightweight, modern icon set                                                                                                           |
| **Math Engine**   | **Native Client-Side TS**     | Zero network latency (0ms response to sliders), zero API server costs                                                                  |
| **Rendering**     | **HTML5 Canvas & Inline SVG** | Canvas for heavy physics/path simulations (Galton, Monte Carlo); SVG for clean mathematical curves (Black-Scholes, Efficient Frontier) |
| **Deployment**    | **Vercel**                    | Automated Git CI/CD, global CDN distribution, edge optimization                                                                        |

---

## 2. Directory & Route Hierarchy

```text
portfolio-platform/
├── app/
│   ├── layout.tsx             # Root layout (Navbar, Footer, Font definitions, Theme)
│   ├── page.tsx               # Pillar 1: Core Showcase (Bio, Experience, Skills, Contact)
│   ├── projects/              # Pillar 2: Projects Showcase
│   │   └── page.tsx           # 8 production systems & quant engines in terminal panels
│   ├── lab/                   # Pillar 3: The Quant Lab
│   │   └── page.tsx           # 7 exact mathematical instruments
│   ├── tools/                 # Pillar 4: Financial Freedom Tools
│   │   └── page.tsx           # Exact Moroccan DCA & Compounding Simulator
│   ├── arcade/                # Pillar 5: The Arcade
│   │   └── page.tsx           # 3 educational probabilistic games
│   └── articles/              # Pillar 6: Articles
│       └── page.tsx           # Substack article index; see articles-spec.md
├── components/
│   ├── nav/
│   │   └── header.tsx         # Global navigation bar (Home, Projects, Lab, Tools, Arcade, Articles)
│   ├── showcase/
│   │   ├── hero.tsx           # Bio, headline, quick metrics
│   │   └── skills-matrix.tsx  # Categorized quant & developer skills
│   ├── projects/
│   │   ├── projects-filter.tsx # Category pill filter (All, Quant, AI/ML, Full-Stack)
│   │   ├── project-panel.tsx   # Terminal panel container (macOS dots, shadow, cream body)
│   │   ├── benchmark-bar.tsx   # Speedup comparison widget (Heston 22,000x speedup)
│   │   ├── stress-frontier.tsx # Interactive Entropy Pooling stress-test frontier
│   │   ├── finbert-tester.tsx  # Live NLP sentiment inference demo
│   │   └── kanban-flow.tsx     # Artisan ERP multi-stage state tracker
│   ├── lab/
│   │   ├── black-scholes.tsx  # BS & Greeks studio with reactive SVG payoff curve
│   │   ├── monte-carlo.tsx    # Canvas GBM 1,000 paths & VaR/CVaR blotter
│   │   ├── frontier.tsx       # Markowitz efficient frontier & allocation weights
│   │   ├── var-engine.tsx     # VaR, CVaR & historical distribution blotter
│   │   ├── dcf-valuation.tsx  # DCF cash flow pricer & sensitivity matrix
│   │   ├── payoff-builder.tsx # Multi-leg option payoff visualizer
│   │   └── binomial-tree.tsx  # American options CRR lattice explorer
│   ├── tools/
│   │   └── dca-simulator.tsx  # Exact Moroccan DCA & Compounding Simulator (S&P vs Gold vs Bank)
│   ├── arcade/
│   │   ├── turing-test.tsx    # Real S&P vs Random Walk guesser
│   │   ├── correlation.tsx    # Scatter plot correlation guessing game
│   │   └── kelly-game.tsx     # Biased coin bankroll management game
│   ├── articles/
│   │   └── article-list.tsx   # Responsive title, summary, date, external-link rows
│   └── ui/                    # shadcn UI primitives (button, slider, card, badge, dialog)
├── lib/
│   ├── math/
│   │   ├── normal.ts          # Abramowitz-Stegun CDF, PDF, and Box-Muller RNG
│   │   ├── black-scholes.ts   # Closed-form pricing and analytical Greeks
│   │   ├── monte-carlo.ts     # Multi-path discretized SDE generator
│   │   ├── portfolio.ts       # Mean-variance quadratic solver
│   │   └── finance.ts         # Annuity compounding, loan amortization, NPV
│   └── utils.ts               # cn() classnames helper
├── data/
│   ├── portfolio-data.ts      # Canonical profile copy (from portfolio-content.md)
│   ├── projects-data.ts       # 8 detailed projects specification (from projects-spec.md)
│   ├── articles-data.ts       # Published Substack article metadata (from articles-spec.md)
│   ├── etfs.ts                # Curated ETF comparison dataset
│   └── market-slices.json     # Curated 90-day S&P 500 historical windows for Turing test
└── public/
    ├── cv/                    # Downloadable CV files
    └── favicon.ico
```

---

## 3. Core Mathematical Implementations in TypeScript

All calculations execute client-side with zero external mathematical dependencies:

### A. Standard Normal Distribution ($\Phi(x)$ and $\phi(x)$)
Uses the high-precision rational approximation (Abramowitz & Stegun 26.2.17, error $< 7.5 \times 10^{-8}$):

```typescript
// lib/math/normal.ts

export function stdNormalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export function stdNormalCDF(x: number): number {
  if (x < -8.0) return 0.0;
  if (x > 8.0) return 1.0;

  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p  = 0.2316419;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
  const cdf = 1.0 - stdNormalPDF(absX) * poly;

  return sign === -1 ? 1.0 - cdf : cdf;
}

// Box-Muller transform for standard normal random variates
export function randomGaussian(mean = 0, stdDev = 1): number {
  let u1 = 0, u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}
```

### B. Black-Scholes Analytical Pricing & Greeks

```typescript
// lib/math/black-scholes.ts
import { stdNormalCDF, stdNormalPDF } from './normal';

export interface BSResult {
  price: number;
  delta: number;
  gamma: number;
  vega: number;   // per 1% vol change
  theta: number;  // per calendar day
  rho: number;    // per 1% rate change
}

export function calculateBlackScholes(
  type: 'call' | 'put',
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): BSResult {
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const pdfD1 = stdNormalPDF(d1);
  const cdfD1 = stdNormalCDF(d1);
  const cdfD2 = stdNormalCDF(d2);
  const expRT = Math.exp(-r * T);

  let price: number;
  let delta: number;
  let theta: number;
  let rho: number;

  const gamma = pdfD1 / (S * sigma * sqrtT);
  const vega = (S * sqrtT * pdfD1) * 0.01;

  if (type === 'call') {
    price = S * cdfD1 - K * expRT * cdfD2;
    delta = cdfD1;
    theta = (-(S * pdfD1 * sigma) / (2 * sqrtT) - r * K * expRT * cdfD2) / 365;
    rho = (K * T * expRT * cdfD2) * 0.01;
  } else {
    price = K * expRT * stdNormalCDF(-d2) - S * stdNormalCDF(-d1);
    delta = cdfD1 - 1.0;
    theta = (-(S * pdfD1 * sigma) / (2 * sqrtT) + r * K * expRT * stdNormalCDF(-d2)) / 365;
    rho = (-K * T * expRT * stdNormalCDF(-d2)) * 0.01;
  }

  return { price, delta, gamma, vega, theta, rho };
}
```

---

## 4. Canvas & Rendering Performance Guidelines

- **Use `requestAnimationFrame` for Canvases:**
  - Games and particle engines (Galton Board, Market Survival) decouple physics update ticks from render frames.
  - Set explicit canvas scaling for Retina / high-DPI screens:
    ```typescript
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ```
- **Use SVG for Mathematical Curves:**
  - Payoff curves, Greeks, and Efficient Frontiers render as reactive SVG `<path>` elements with smooth Bézier interpolation.
  - SVG automatically responds to browser resizing without recalculating canvas pixel grids.

---

## 5. Integrating Your Chosen GitHub Template

When you provide your chosen GitHub UI repository or template:

1. **Navigation:** Add `/lab`, `/tools`, `/arcade`, and `/articles` to the header navigation.
2. **Components Drop-in:** The components in `components/lab/`, `components/tools/`, and `components/arcade/` are fully self-contained React modules; they drop directly into any Next.js page layout without conflicts.
3. **Data Binding:** Profile copy reads from `data/portfolio-data.ts`; the article index reads from `data/articles-data.ts`. Both can be restyled without rewriting content.
