# Portfolio Content

This document contains the finalized, structured text and data for Hassan EL QADI's personal portfolio website. It is ready to be directly imported into UI templates or structured component props.

---

## 1. Hero Section

- **Name:** Hassan EL QADI
- **Role / Title:** Financial Engineer & Full-Stack Developer
- **Location:** Casablanca, Morocco
- **Status Badge:** Open to Quant Analyst / Developer Roles & Select Freelance Projects
- **Tagline:**  
  *Bridging mathematical rigor and scalable software.*
- **Elevator Pitch:**  
  Financial Engineering graduate from ENSA Agadir specializing in derivatives pricing, stochastic modeling, and quantitative risk, paired with practical experience engineering production-grade web applications and high-performance backends.

### Call to Actions (CTAs)
- **Primary CTA:** Explore Projects (links to `#projects`)
- **Secondary CTA:** Download CV (links to `/cv/CV_Hassan_ELQADI.pdf` or contact)
- **Direct Contact:** [Email Me](mailto:hassanelqadi3@gmail.com)

### Key Metrics Highlight
| Metric | Label | Description |
| :--- | :--- | :--- |
| **0.12s** | Calibration Speed | Deep learning Heston model calibration vs 2,650s closed-form |
| **1st Place** | Portfolio Challenge | Winner of ENSA 5th Financial Day Portfolio Management Competition |
| **5+** | Full-Scale Systems | Built quantitative pricing engines, financial data pipelines, and client web apps |

---

## 2. About Me

I am a Financial Engineer with a dual focus: mathematical modeling and software craftsmanship. 

During my engineering cycle at **ENSA Agadir (Finance & Decision-Making Engineering)** and internships at **Finamaze** and **Oracle Capital**, I focused on stochastic calculus, derivatives valuation (Black-Scholes, Monte Carlo, Heston), and portfolio stress-testing (Entropy Pooling, copulas). Concurrently, I design and ship full-stack web platforms using Next.js, TypeScript, and PostgreSQL for clients and businesses.

Whether calibrating implied volatility surfaces or architecting responsive user interfaces, I believe in writing clean, vectorized, benchmark-tested, and maintainable code.

---

## 3. Skills Matrix

### A. Quantitative Finance & Risk
- **Derivatives & Pricing:** Black-Scholes, Binomial & Trinomial Trees, Monte Carlo Simulation (Euler Schemes), Greeks Sensitivity Analysis.
- **Stochastic Models:** Heston Volatility Surface Calibration, Vasicek & Cox-Ingersoll-Ross (CIR) Term Structure, Yield Curve Bootstrapping.
- **Portfolio & Risk Management:** Markowitz Mean-Variance, Black-Litterman, Risk Parity, Entropy Pooling Stress-Testing, Copula Dependency Modeling, VaR / CVaR.
- **Mathematics:** Stochastic Calculus, Martingales, Numerical Methods, Differential Equations, Optimization.

### B. Programming & Languages
- **Python:** NumPy, SciPy, Pandas, Polars, Numba, Scikit-Learn, PyTorch, CVXPY.
- **C++:** Modern C++ (C++17/20), STL, CMake, Eigen, OpenMP, pybind11.
- **Web & Languages:** TypeScript, JavaScript, SQL, Java, R, Bash.

### C. Full-Stack & Systems
- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui.
- **Backend & APIs:** FastAPI, Node.js, Flask, REST APIs.
- **Databases & Storage:** PostgreSQL, Supabase, MongoDB.
- **DevOps & Cloud:** Docker, Vercel, Git/GitHub, Linux.

---

## 4. Featured Projects

### Project 1: Options Pricing & Volatility Calibration Suite
- **Category:** Quantitative Finance & High-Performance Computing
- **Tag:** Flagship Quant
- **One-Liner:** Multi-model derivatives valuation engine comparing analytical, lattice, Monte Carlo, and deep learning calibration.
- **Key Highlights:**
  - Implemented Black-Scholes analytical pricing and Greeks alongside numerical Monte Carlo simulations with Euler discretization.
  - Built binomial and trinomial tree algorithms for American options analyzing early-exercise boundaries.
  - Calibrated the Heston stochastic volatility model on SPX index options, measuring performance trade-offs: Closed-form (2,650s), FFT (45s), and Deep Learning (0.12s).
- **Stack:** Python, C++, NumPy, SciPy, PyTorch, Matplotlib
- **Links:** `[GitHub Repo]` | `[Interactive Demo / Docs]`

---

### Project 2: Quantitative Portfolio Optimization & Stress-Testing Framework
- **Category:** Quantitative Finance & Risk Analytics
- **Tag:** Risk & Asset Allocation
- **One-Liner:** End-to-end asset allocation engine featuring modern portfolio theory, Black-Litterman, and Entropy Pooling stress tests.
- **Key Highlights:**
  - Implemented Markowitz Mean-Variance, Global Minimum Variance, Maximum Sharpe, and Risk Parity strategies with out-of-sample backtesting.
  - Integrated Entropy Pooling to inject non-normal macroeconomic stress scenarios into return distributions.
  - Applied copula functions to capture non-linear asset tail dependencies and extreme drawdowns.
- **Stack:** Python, Pandas, SciPy.optimize, CVXPY, Plotly
- **Links:** `[GitHub Repo]` | `[Methodology Report]`

---

### Project 3: Financial Market Sentiment & Directional Signal Pipeline
- **Category:** Machine Learning & NLP / Web Application
- **Tag:** AI in Finance
- **One-Liner:** Real-time financial sentiment analysis extracting signals from news and social feeds with FinBERT.
- **Key Highlights:**
  - Automated scraping and text extraction from Finviz, Twitter, and Reddit feeds.
  - Utilized Hugging Face FinBERT for financial sentiment classification.
  - Delivered via a Dockerized FastAPI backend with a responsive Next.js visualization frontend.
- **Stack:** Python, FinBERT, FastAPI, Next.js, Tailwind CSS, Docker
- **Links:** `[Live App]` | `[GitHub Repo]`

---

### Project 4: Workshop Management Platform (Dar-Dmana Decor)
- **Category:** Full-Stack Web Development
- **Tag:** Production Client Work
- **One-Liner:** Operational ERP web application managing artisan salon production pipelines, quality checks, and delivery follow-up.
- **Key Highlights:**
  - Designed role-based production assignment for artisan manufacturing teams.
  - Real-time tracking of orders through multi-stage quality control checks to delivery.
  - Persistent operational data and history tracking using PostgreSQL.
- **Stack:** Next.js, React, Node.js, PostgreSQL, Tailwind CSS
- **Links:** `[Project Summary]`

---

### Project 5: Educational Platform & Community Forum (Prof. Saad Choukri)
- **Category:** Full-Stack Web Development
- **Tag:** Production Client Work
- **One-Liner:** Digital learning platform for sharing university math materials, Olympiad exercises, and community discussion.
- **Key Highlights:**
  - Structured, searchable repository of course PDFs, Olympiad challenges, and solutions.
  - Interactive student forum for question posting, exercise discussions, and math markdown rendering.
- **Stack:** Next.js, React, PostgreSQL, Tailwind CSS
- **Links:** `[Project Summary]`

---

## 5. Professional Experience

### Finamaze — Quantitative Developer (PFE Intern)
*Casablanca, Morocco | Feb 2026 – Jul 2026*
- Developed a quantitative stress-testing framework for multi-asset investment portfolios using **Entropy Pooling** and copula dependency modeling.
- Monitored and validated the backend API of an investment management application deployed for **Saudi Arab Bank**, verifying financial calculator outputs and resolving algorithmic edge cases.
- Ingested, validated, and normalized financial market feeds across multiple asset classes.

### Oracle Capital — Quantitative Finance & Data Science Intern
*Casablanca, Morocco | Feb 2025 – Jun 2025*
- Calibrated the **Heston stochastic volatility model** on SPX index options using implied volatility surfaces.
- Compared computational efficiency and accuracy across closed-form optimization (2,650s), Fast Fourier Transform (45s), and deep learning neural network calibration (0.12s).
- Built automated calibration visualization pipelines for implied volatility smiles.

---

## 6. Education & Certifications

### Education
- **National School of Applied Sciences (ENSA), Agadir**  
  *Engineering Degree in Finance and Decision-Making Engineering (2023–2026)*  
  Graduated June 2026. Focus: Stochastic calculus, financial engineering, numerical methods, data science, and portfolio management.
- **ENSA Agadir — Preparatory Cycle (2021–2023)**  
  Advanced mathematics, algebra, analysis, probability, differential equations.
- **Baccalaureate in Physical Sciences (2021)** — Mention Très Bien.

### Top Certifications
- **Financial Markets** — Yale University (Coursera, 2026)
- **Markets Quantitative Analysis Job Simulation** — Citi / Forage (2025)
- **Quantitative Research Job Simulation** — J.P. Morgan / Forage (2025)
- **Meta Front-End Developer Certificate** — Meta / Coursera (2024)

---

## 7. Honors & Leadership

- **1st Place Winner — Portfolio Management Challenge:** 5th Financial Day, ENSA Agadir (Nov 2025). Managed multi-asset international stock and crypto allocation with live risk constraints.
- **Media & Communications Manager — Financial Day ENSA (Editions 4 & 5):** Built event web platform (`finday5.vercel.app`) and directed digital strategy.
- **Head of IT & Innovation — ADE ENSA Agadir:** Developed dynamic student portal (`ensaa.ma`).

---

## 8. Contact & Socials

- **Email:** [hassanelqadi3@gmail.com](mailto:hassanelqadi3@gmail.com)
- **LinkedIn:** [linkedin.com/in/el-qadi](https://www.linkedin.com/in/el-qadi/)
- **GitHub:** [github.com/hassanelq](https://github.com/hassanelq)
- **Location:** Casablanca, Morocco
