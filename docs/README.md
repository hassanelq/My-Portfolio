# Hassan EL QADI — Quant & Engineering Digital Platform

- **Project:** Personal Portfolio, Projects Showcase, Quant Lab, Financial Freedom Tools, Probabilistic Arcade & Articles
- **Live Version:** [elqadi.vercel.app](https://elqadi.vercel.app/)
- **Architecture Status:** Initial rebuild implemented locally; see [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md)
- **Target Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, SVG/HTML5 Canvas, Vercel

---

## The 6 Platform Pillars

```text
Portfolio Platform
├── 1. Core Showcase (/)          # Profile, Overview, Experience, Skills, Contact
├── 2. Projects Showcase (/projects) # 8 Production Systems & Quant Engines
├── 3. The Quant Lab (/lab)       # 7 Exact Mathematical Instruments in your browser
├── 4. Financial Freedom (/tools) # Historical DCA, FIRE and emergency cash planning
├── 5. The Arcade (/arcade)       # 3 Educational Probabilistic & Quantitative Games
└── 6. Articles (/articles)      # Writing index linking to full posts on Substack
```

---

## Master Documentation Suite

| Document | Pillar / Scope | Key Contents |
| :--- | :--- | :--- |
| **[`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md)** | **Build sequence** | Route map, technical decisions, migration phases, data gates, and release criteria |
| **[`DESIGN.md`](DESIGN.md)** | **Visual reference** | Dark editorial system, typography, colors, spacing, borders, and component rules |
| **[`portfolio-content.md`](portfolio-content.md)** | **Pillar 1: Core Showcase** | Hero pitch, metrics, career overview, skills matrix, experience (Finamaze, Oracle Capital), education, contact |
| **[`projects-spec.md`](projects-spec.md)** | **Pillar 2: Projects Showcase** | **9 Systems & Engines:** Options Pricing, Heston Calibration (22,000x speedup), Entropy Pooling (ENSA 1st Place), Yield Curves, FinBERT, Artisan ERP, STEM Olympiad, Real Estate ML, Ordinals Bot |
| **[`quant-lab-spec.md`](quant-lab-spec.md)** | **Pillar 3: The Quant Lab** | **7 Instruments:** Black-Scholes, Monte Carlo, Efficient Frontier, VaR, DCF, Option Payoff Builder, Binomial Tree Pricer |
| **[`financial-tools-spec.md`](financial-tools-spec.md)** | **Pillar 4: Financial Freedom** | Historical DCA, FIRE retirement and an editable emergency-fund questionnaire |
| **[`arcade-spec.md`](arcade-spec.md)** | **Pillar 5: The Arcade** | **3 Games:** The Chart Turing Test (Real S&P vs Random Walk), Guess the Correlation ($\rho$), Kelly Criterion & Gambler's Ruin |
| **[`articles-spec.md`](articles-spec.md)** | **Pillar 6: Articles** | Minimal article index inspired by the supplied reference image; full posts published on Substack |
| **[`architecture-and-stack.md`](architecture-and-stack.md)** | **Earlier technical blueprint** | Route structure and TypeScript math examples; follow the implementation plan for current stack and design decisions |


---

## Current implementation

See [`../content/README.md`](../content/README.md) to edit the site and [`DATA_SOURCES.md`](DATA_SOURCES.md) for calculation assumptions and dataset provenance. The current version uses historical DCA observations, existing project links, English/French CVs, and an articles empty state. [`DESIGN.md`](DESIGN.md) supplies the current visual direction; older visual descriptions in the feature specs are superseded by it.
