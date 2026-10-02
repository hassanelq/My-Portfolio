# The Projects Showcase: Production Systems & Quantitative Engines

> **Current implementation update:** Options Pricing and Heston Model Calibration are separate projects, with their own repository/demo/report links. The catalog now has **9 projects**, including **4 quantitative finance** projects. `content/projects.ts` sorts all entries by `realizedAt`, newest first, and preserves year-only precision where exact dates are unavailable. Older combined-project visual concepts below are historical references; the current portfolio design system and separate entries take precedence.


*Dedicated specification for the `/projects` showcase route.*

> **Production systems, quantitative models, and applied research.**  
> Built with mathematical rigor, tested on real data, and engineered for high performance.

Every project is presented as a vintage-modern macOS terminal-style panel matching **The Quant Lab** and **The Arcade**:
- **Header Bar:** Dark charcoal background (`#1E1E1E`), colored terminal dots (red, yellow, green), uppercase project index & title on the left, witty/technical status subtitle on the right.
- **Body Styling:** Warm cream background (`#F4F1E8`) or sleek dark mode (`#0D0D0D`), dark ink borders (`1.5px solid #1E1E1E`), hard offset drop shadow (`4px 4px 0 #1E1E1E`).
- **Typography:** Serif blue font for flagship readouts and metrics, monospace (`JetBrains Mono` / `Geist Mono`) for inputs, terminal logs, code snippets, and system architecture.
- **Interactive Component:** Every card includes either a live client-side visual simulation, an interactive parameter inspector, or an architecture flow diagram.

---

## Filter & Navigation Bar

At the top of the `/projects` page, an interactive pill filter allows instant client-side switching:

- `[ALL (9)]` — Full catalog of engineering & mathematical systems
- `[QUANTITATIVE FINANCE (4)]` — Derivatives pricing, portfolio stress-testing, yield curves
- `[APPLIED AI & DATA SCIENCE (2)]` — Financial NLP (FinBERT), Bayesian property valuation
- `[FULL-STACK & SYSTEMS (3)]` — Artisan ERP, STEM Olympiad platform, Web3 blockchain bots

---

## 01. Options Valuation & Stochastic Volatility Calibration Suite

- **Header Bar:** `01  OPTIONS PRICING & HESTON CALIBRATION ENGINE`
- **Subtitle:** `closed-form vs. FFT vs. deep learning · 22,000x acceleration`
- **Category:** `Quantitative Finance & HPC`
- **Tags:** `[C++17]` `[Python]` `[PyTorch]` `[Heston Model]` `[Monte Carlo]` `[Black-Scholes]`

### Visual Panel / Interactive Inspector (Left Column)
- **Interactive Calibration Speed Benchmark Comparison:**
  - `Closed-Form (Integration)`: `2,650.00s` (Progress bar: 100% full, deep red)
  - `Fast Fourier Transform (Carr-Madan)`: `45.20s` (Progress bar: 1.7% width, amber)
  - `Deep Neural Pricer (PyTorch)`: `0.12s` (Progress bar: 0.004% width, electric green — **22,000x Speedup**)
- **Mathematical Formulation:**
  $$\begin{aligned}
  dS_t &= \mu S_t dt + \sqrt{V_t} S_t dW_t^S \\
  dV_t &= \kappa (\theta - V_t) dt + \xi \sqrt{V_t} dW_t^V, \quad d\langle W^S, W^V \rangle_t = \rho dt
  \end{aligned}$$
- **Interactive Volatility Smile Explorer:** Mini interactive SVG plot where dragging $\rho$ (correlation) skews the smile, and $\xi$ (vol of vol) adjusts the convexity/kurtosis.

### Engineering & Methodology Blotter (Right Column)
- **Problem Statement:** Calibrating continuous stochastic volatility surfaces on hundreds of SPX index options strikes and maturities using traditional numerical quadrature is too slow for real-time intraday risk management.
- **Architectural Solution:**
  - Engineered an analytical Black-Scholes and numerical Monte Carlo simulator with Euler-Maruyama discretization.
  - Built binomial and trinomial tree lattice algorithms for American options analyzing early-exercise boundaries.
  - Trained an ultra-compact Deep Neural Network on 500,000 synthetic Heston option surfaces to act as a surrogate pricer, reducing inverse calibration time from 44 minutes to 120 milliseconds.
- **Performance Metrics:**
  - **Speedup:** `22,083x` over closed-form optimization
  - **Pricing Error:** Mean Absolute Percentage Error $< 0.18\%$ across moneyness $K/S \in [0.8, 1.2]$
  - **Dataset:** 15,000+ live SPX index option quotes
- **Action Buttons:** `[View GitHub Repo]` · `[Read Research Report]` · `[Test in Quant Lab ->]`

### Footnote
> `When you need to price 10,000 options before lunch, closed-form quadrature is a meditation exercise. Neural surrogates are a weapon.`

---

## 02. Multi-Asset Portfolio Optimization & Entropy Pooling Framework

- **Header Bar:** `02  PORTFOLIO OPTIMIZATION & ENTROPY POOLING`
- **Subtitle:** `winner: 1st place ENSA portfolio challenge · non-normal stress tests`
- **Category:** `Quantitative Finance & Risk Management`
- **Tags:** `[Python]` `[CVXPY]` `[Entropy Pooling]` `[Copulas]` `[Risk Parity]` `[SciPy]`

### Visual Panel / Interactive Inspector (Left Column)
- **Interactive Frontier & Stress-Test Canvas:**
  - Displays the Classical Markowitz Efficient Frontier vs the Entropy-Pooled Stressed Frontier.
  - **Macroeconomic Stress Scenario Injector:** Sliders to inject subjective/macro views:
    - *View 1: Oil spike $+40\%$ & Moroccan Inflation $+2.5\%$*
    - *View 2: Global Tech drawdown $-20\%$ with asymmetric copula tail correlation*
  - Re-computes posterior probability vector $p$ instantly using minimum relative entropy:
    $$\min_p \sum_{i=1}^J p_i \ln\left(\frac{p_i}{q_i}\right) \quad \text{s.t.} \quad A p \le b, \quad \mathbf{1}^T p = 1$$
- **Live Asset Allocation Breakdown:** Dynamic donut / stacked bar showing weights across Equities, Sovereign Bonds, Gold, and Crypto.

### Engineering & Methodology Blotter (Right Column)
- **Problem Statement:** Classical Mean-Variance optimization suffers from error maximization ("Markowitz enigma") and fails catastrophically during fat-tailed market crises because it assumes normal joint return distributions.
- **Architectural Solution:**
  - Implemented Markowitz (Max Sharpe, Min Variance), Hierarchical Risk Parity (HRP), and Black-Litterman models.
  - Integrated Attilio Meucci's **Entropy Pooling** framework to combine historical empirical distributions with non-linear macroeconomic stress scenarios without distorting baseline priors.
  - Implemented Clayton and Gumbel copulas to model extreme lower-tail co-dependence during market liquidation events.
- **Performance Metrics:**
  - **1st Place Winner:** 5th Financial Day ENSA Agadir Portfolio Challenge (Nov 2025)
  - **Max Drawdown:** Reduced from `-28.4%` (classical 60/40) to `-14.2%` under simulated stagflation
  - **Sharpe Ratio:** Out-of-sample Sharpe improved from `0.78` to `1.24`
- **Action Buttons:** `[View GitHub Repo]` · `[View Case Study]` · `[Explore Frontier in Lab ->]`

### Footnote
> `Correlations are like fair-weather friends: 0.20 when markets are calm, exactly 1.00 when the building is on fire.`

---

## 03. Interest Rate Curve Bootstrapping & Short-Rate Calibration

- **Header Bar:** `03  YIELD CURVE BOOTSTRAPPING & SHORT-RATE PRICER`
- **Subtitle:** `discount factors, Vasicek/CIR dynamics, and vanilla swap valuation`
- **Category:** `Quantitative Finance & Fixed Income`
- **Tags:** `[Python]` `[NumPy]` `[SciPy]` `[Vasicek]` `[CIR Model]` `[Interest Rate Swaps]`

### Visual Panel / Interactive Inspector (Left Column)
- **Interactive Yield Curve & Forward Rate Visualizer:**
  - Renders Zero-Coupon Yield Curve $y(0, T)$, Discount Curve $P(0, T)$, and Instantaneous Forward Rate Curve $f(0, T)$ across maturities $T \in [0.25, 30]$ years.
  - **Model Toggle:** `[Market Curve | Vasicek Fit | Cox-Ingersoll-Ross (CIR)]`
  - Sliders for mean reversion speed $\kappa$, long-term rate $\theta$, and rate volatility $\sigma$.
- **Swap Leg Balance Readout:**
  - `FIXED LEG NPV`: `$1,042,350`
  - `FLOATING LEG NPV`: `$1,042,350`
  - `FAIR PAR SWAP RATE`: `3.842%`

### Engineering & Methodology Blotter (Right Column)
- **Problem Statement:** Fixed income pricing requires an arbitrage-free zero-coupon discount curve bootstrapped from sparse, discrete market instruments (Deposits, FRAs, Interest Rate Swaps, and Treasury Bonds).
- **Architectural Solution:**
  - Developed a piecewise cubic Hermite spline bootstrapping engine converting market quotes into exact continuous discount factors $P(0, T) = \exp(-y(T) \cdot T)$.
  - Implemented pricing algorithms for fixed-for-floating Interest Rate Swaps (IRS) calculating par swap rates and DV01 sensitivity.
  - Calibrated one-factor short-rate models (Vasicek and CIR) using Ordinary Least Squares and Maximum Likelihood Estimation (MLE) to enforce non-negative interest rates.
- **Performance Metrics:**
  - **Curve Fitting Residuals:** Root Mean Square Error (RMSE) $< 0.04$ basis points
  - **Tenors Supported:** 1M, 3M, 6M, 1Y, 2Y, 5Y, 10Y, 20Y, 30Y
  - **Computation Time:** Sub-10ms full curve reconstruction
- **Action Buttons:** `[View Source Code]` · `[Interactive Math Sandbox]`

### Footnote
> `In equity markets people obsess over price. In fixed income we obsess over time, curvature, and who is holding the swap spread when rates move 25 bps.`

---

## 04. FinBERT Financial Sentiment & Directional Signal Pipeline

- **Header Bar:** `04  FINBERT MARKET SENTIMENT & ALPHA PIPELINE`
- **Subtitle:** `automated financial NLP · sub-80ms inference · Dockerized FastAPI`
- **Category:** `Applied AI & Financial NLP`
- **Tags:** `[Python]` `[FinBERT]` `[FastAPI]` `[Next.js]` `[Docker]` `[Tailwind CSS]`

### Visual Panel / Interactive Inspector (Left Column)
- **Live Headline Sentiment Classifier (Interactive Demo):**
  - Textarea with sample presets:
    - *"Central bank unexpectedly cuts policy rate by 50 bps amid cooling inflation data."*
    - *"Quarterly revenue beat estimates by 14%, but guidance lowered due to margin compression."*
  - **Live Probabilistic Output:**
    - `POSITIVE`: `84.2%` (Green bar)
    - `NEUTRAL`: `11.5%` (Grey bar)
    - `NEGATIVE`: `4.3%` (Red bar)
  - **Composite Polarity Score:** `+0.799` (Bullish Signal)
- **Pipeline Architecture Diagram:**
  ```text
  [Twitter / Reddit / Finviz] -> [Async Scraper Engine]
                                          ↓
                              [FinBERT Tokenizer & Transformer]
                                          ↓
                               [FastAPI Scoring Microservice]
                                          ↓
                                [Next.js Analytics Dashboard]
  ```

### Engineering & Methodology Blotter (Right Column)
- **Problem Statement:** General-purpose NLP models (like standard BERT or GPT) misinterpret financial vernacular (e.g. "share dilution", "yield compression", "rate cut" are interpreted with misleading sentiment).
- **Architectural Solution:**
  - Built high-concurrency asynchronous collectors scraping financial headlines from Finviz, market Twitter (X), and Reddit trading forums.
  - Employed `ProsusAI/finbert` (specialized transformer fine-tuned on financial phrasebanks) for domain-adapted tokenization and sentiment classification.
  - Aggregated individual headline scores into a rolling volume-weighted market sentiment index with time decay.
  - Containerized with Docker and served via high-throughput FastAPI asynchronous endpoints connected to a Next.js frontend.
- **Performance Metrics:**
  - **Inference Latency:** `74ms` per batch on GPU / `210ms` on CPU
  - **Classification Accuracy:** `89.3%` on benchmark financial text datasets
  - **Throughput:** Capable of processing 1,500+ headlines/minute
- **Action Buttons:** `[Launch Live Web App]` · `[View GitHub Repo]` · `[API Documentation]`

### Footnote
> `To an English teacher, "crushed earnings" sounds violent. To FinBERT, it means buy calls at market open.`

---

## 05. Artisan Production ERP & Workflow Platform (Dar-Dmana Decor)

- **Header Bar:** `05  DAR-DMANA DECOR · ARTISAN WORKSHOP ERP`
- **Subtitle:** `production client work · end-to-end bespoke furniture manufacturing ERP`
- **Category:** `Full-Stack Web Development`
- **Tags:** `[Next.js]` `[TypeScript]` `[Node.js]` `[PostgreSQL]` `[Tailwind CSS]` `[Prisma]`

### Visual Panel / Interactive Inspector (Left Column)
- **Interactive Multi-Stage Production Pipeline Kanban:**
  - Visual stage tracker depicting real-time order lifecycle:
    `[1. Order Intake]` -> `[2. Woodworking & Carpentry]` -> `[3. Foam & Upholstery]` -> `[4. Quality Control Gate]` -> `[5. Delivery Logistics]`
  - Clicking any phase reveals role assignments, QA inspection checklist, and delivery timestamps.
- **System Architecture Snapshot:**
  - Normalized relational schema in PostgreSQL storing order specs (dimensions, fabric SKU, wood type), artisan work logs, stage transitions, and client payment tranches.

### Engineering & Methodology Blotter (Right Column)
- **Problem Statement:** Custom Moroccan salon manufacturing involves dozens of bespoke artisan steps. Without a centralized system, paper records caused scheduling bottlenecks, untracked quality defects, and delayed deliveries.
- **Architectural Solution:**
  - Engineered an internal operational ERP platform tailored for workshop foremen, artisan teams, and management.
  - Structured role-based dispatching where master craftsmen claim and log completed manufacturing milestones.
  - Enforced mandatory multi-point quality control (QC) checklists before an order can advance to final finishing or delivery.
  - Built an administrative analytics dashboard tracking average cycle time per piece, material consumption, and bottleneck stages.
- **Performance Metrics:**
  - **Traceability:** `100%` digital audit trail for every manufactured piece
  - **Order Volume:** Successfully tracked `150+` custom luxury salon orders
  - **Defect Reduction:** Eliminated post-delivery returns caused by specification mismatches
- **Action Buttons:** `[System Architecture]` · `[Database Schema]` · `[Request Client Demo Walkthrough]`

### Footnote
> `Traditional Moroccan craftsmanship meets modern relational integrity. Beautiful salons, zero lost orders.`

---

## 06. STEM Learning & Olympiad Community Platform (Prof. Saad Choukri)

- **Header Bar:** `06  SAAD CHOUKRI EDUCATIONAL HUB & MATH FORUM`
- **Subtitle:** `production client work · 1,200+ active students · LaTeX KaTeX engine`
- **Category:** `Full-Stack Web Development`
- **Tags:** `[Next.js]` `[TypeScript]` `[PostgreSQL]` `[KaTeX]` `[Tailwind CSS]` `[Supabase]`

### Visual Panel / Interactive Inspector (Left Column)
- **Interactive LaTeX Math Rendering Preview:**
  - Live interactive editor showing immediate KaTeX rendering of Olympiad inequalities:
    $$\sum_{cyc} \frac{a}{\sqrt{a^2 + 8bc}} \ge 1, \quad \forall a, b, c > 0$$
- **Searchable PDF Document Repository:**
  - Instant client-side search across categorized university courses, national math Olympiad exercises, and step-by-step corrections.
- **Discussion Thread Preview:**
  - Nested, threaded Q&A interface with verified teacher badges, upvoting, and LaTeX equation quoting.

### Engineering & Methodology Blotter (Right Column)
- **Problem Statement:** University mathematics and Olympiad training require specialized mathematical typesetting and organized problem repositories that standard communication apps (WhatsApp, Facebook Groups) fail to provide.
- **Architectural Solution:**
  - Designed and deployed a complete digital learning platform and interactive community forum for Professor Saad Choukri.
  - Implemented client-side mathematical formula rendering using lightweight KaTeX for instant LaTeX preview without latency.
  - Engineered a relational database schema in PostgreSQL tracking student profiles, categorized PDF materials, discussion threads, and exercise solutions.
  - Built administrative moderation tools, file storage integration, and granular search filters by topic and difficulty.
- **Performance Metrics:**
  - **Active Community:** `1,200+` registered Moroccan university & CPGE preparatory students
  - **Resource Library:** `500+` curated advanced math problem sets and exam solutions
  - **Uptime & Speed:** `99.9%` uptime on Vercel edge network with $< 150\text{ms}$ page loads
- **Action Buttons:** `[Live Platform]` · `[Feature Breakdown]` · `[Repository Architecture]`

### Footnote
> `Because explaining Cauchy-Schwarz inequalities with cell phone photos of handwritten napkins was never acceptable.`

---

## 07. Agadir Residential Real Estate Predictive Engine

- **Header Bar:** `07  AGADIR REAL ESTATE VALUATION ENGINE`
- **Subtitle:** `scraped listings · spatial feature engineering · Bayesian-tuned LightGBM`
- **Category:** `Applied AI & Data Science`
- **Tags:** `[Python]` `[LightGBM]` `[Scikit-Learn]` `[Bayesian Optimization]` `[Flask]` `[Docker]`

### Visual Panel / Interactive Inspector (Left Column)
- **Interactive Property Valuation Calculator:**
  - Sliders & Dropdowns:
    - `NEIGHBORHOOD`: `[Founty | Haut Founty | Charaf | Hay Mohammadi | Sonaba]`
    - `SURFACE AREA`: `120 m²`
    - `BEDROOMS`: `3` · `BATHROOMS`: `2`
    - `ELEVATOR`: `Yes` · `BALCONY`: `Yes` · `DISTANCE TO BEACH`: `850m`
  - **Estimated Market Valuation:**
    `1,420,000 MAD` (Large blue serif font)
  - **90% Confidence Interval:** `1,340,000 MAD — 1,510,000 MAD`
- **Feature Importance Chart:** Horizontal bar chart showing top price drivers: (1) Geographic location, (2) Surface area ($m^2$), (3) Beach proximity, (4) Elevator/Parking.

### Engineering & Methodology Blotter (Right Column)
- **Problem Statement:** The Moroccan real estate market lacks transparent public transaction registries, leading to extreme pricing opacity and speculative listing spreads.
- **Architectural Solution:**
  - Developed custom web scrapers to aggregate thousands of active and historical property listings across Greater Agadir.
  - Built spatial and textural feature engineering pipelines (calculating geodesic distance to the coastline, commercial centers, and tourist zones).
  - Trained and cross-validated a LightGBM gradient boosting model, employing Bayesian Optimization via Optuna to tune regularization, tree depth, and learning rates.
  - Packaged the inference model into a lightweight, containerized Flask REST API ready for web frontend consumption.
- **Performance Metrics:**
  - **Out-of-Sample Accuracy:** $R^2 = 0.891$ on holdout test set
  - **Median Absolute Error:** $\text{MAPE} < 6.2\%$
  - **Dataset:** 4,200+ cleaned and deduplicated residential property listings
- **Action Buttons:** `[View GitHub Repo]` · `[Model Evaluation Notebook]`

### Footnote
> `Location, location, location — mathematically quantified as a non-linear decay function of meters from the Atlantic Ocean.`

---

## 08. Bitcoin Ordinals Real-Time Sales Tracker & AMBcheck

- **Header Bar:** `08  ORDINALS SALES ENGINE & AMBCHECK VERIFICATION`
- **Subtitle:** `high-throughput websocket listener · cryptographic NFT wallet gating`
- **Category:** `Full-Stack & Systems`
- **Tags:** `[Node.js]` `[Discord.js]` `[WebSocket]` `[MongoDB]` `[Next.js]` `[Web3]`

### Visual Panel / Interactive Inspector (Left Column)
- **Live WebSocket Event Stream Terminal:**
  - Terminal-style scrolling transaction feed:
    ```text
    [03:42:19] MINT DETECTED: Inscription #8,421,902 (0.024 BTC)
    [03:42:25] SALE CONFIRMED: Sub 10k Inscription #4,119 -> 1.45 BTC ($94,250)
    [03:42:29] AMBCHECK: User 0x7f2a... verified ownership (Role Granted: Whale)
    [03:42:35] BROADCAST: Discord Rich Embed sent to 3 servers in 28ms
    ```
- **Cryptographic Verification Flow Diagram:**
  `[User Wallet]` -> `[Sign Nonce]` -> `[AMBcheck API]` -> `[Verify ECDSA on-chain]` -> `[Grant Discord Role]`

### Engineering & Methodology Blotter (Right Column)
- **Problem Statement:** Fast-moving NFT and Bitcoin Ordinals ecosystems require sub-second transaction notification feeds and automated cryptographic verification of community ownership without exposing private keys.
- **Architectural Solution:**
  - Built a high-availability event listener daemon in Node.js connected to Bitcoin mempool monitors and marketplace WebSockets.
  - Automated dynamic Discord and Twitter rich alert broadcasts with transaction values, inscription previews, and buyer/seller addresses.
  - Engineered **AMBcheck**, a decoupled web application and bot verifying cryptographic ownership of digital assets via wallet-signed nonces, automatically provisioning private guild access.
- **Performance Metrics:**
  - **Alert Latency:** Sub-`500ms` from blockchain confirmation to Discord rich embed broadcast
  - **Community Scale:** Handled `10,000+` automated wallet ownership verifications
  - **Fault Tolerance:** Auto-reconnecting WebSocket client with exponential backoff and message deduplication
- **Action Buttons:** `[View Source Code]` · `[Bot Demo Showcase]`

### Footnote
> `WebSockets never sleep. Neither do on-chain markets when a sub-10k inscription trades at 3:00 AM.`

---

## 5. Technical Implementation Details for `/projects`

### Component Architecture (`components/projects/`)
```text
components/projects/
├── projects-filter.tsx        # Client-side tab filter (All, Quant, AI/ML, Full-Stack)
├── project-panel.tsx          # Terminal container wrapper with macOS header bar & drop shadow
├── project-benchmark.tsx      # Speedup bar comparison widget (Heston)
├── project-formula.tsx        # KaTeX LaTeX mathematical block rendering
├── project-metrics-grid.tsx   # 3-column performance metrics readout
└── project-stack-pills.tsx    # Monospace technology badge row
```

### Data Schema (`data/projects-data.ts`)
```typescript
export interface ProjectItem {
  id: string;
  number: string;              // '01', '02', etc.
  title: string;
  subtitle: string;
  category: 'quant' | 'ai' | 'fullstack';
  categoryLabel: string;
  tags: string[];
  problem: string;
  solution: string;
  metrics: { label: string; value: string; detail: string }[];
  visualComponent: 'heston-speedup' | 'entropy-frontier' | 'yield-curve' | 'finbert-demo' | 'erp-pipeline' | 'katex-demo' | 'property-calc' | 'ordinals-feed';
  footnote: string;
  githubUrl?: string;
  liveUrl?: string;
  reportUrl?: string;
}
```
