# Portfolio Technical Specification & Design Blueprint

This document specifies the technical stack, decoupled data architecture, design philosophy, and integration guidelines for Hassan EL QADI's new personal portfolio website.

---

## 1. Technical Stack

- **Framework:** Next.js (App Router, React 19 / 18, TypeScript)
- **Styling:** Tailwind CSS (with `tailwind-merge` and `clsx`)
- **Icons:** Lucide React (`lucide-react`)
- **Animation (Optional):** Framer Motion / Motion
- **UI Primitives:** shadcn/ui components (Buttons, Dialogs, Cards, Badges, Tabs)
- **Deployment & Hosting:** Vercel (Automatic CI/CD from GitHub)
- **Data Source:** Flat, strongly-typed TypeScript dataset (`data/portfolio-data.ts`)

---

## 2. Decoupled Architecture

To make it trivial to integrate **any predefined GitHub library or template**, the website architecture completely separates content from presentation:

```text
portfolio/
├── app/
│   ├── layout.tsx             # Root metadata, theme provider, fonts
│   ├── page.tsx               # Main portfolio page composing section components
│   ├── articles/
│   │   └── page.tsx           # Article index linking to Substack; see articles-spec.md
│   └── og/                    # Dynamic OpenGraph image generation
├── components/
│   ├── hero-section.tsx       # Hero, badges, quick metrics
│   ├── about-section.tsx      # Bio & background
│   ├── projects-section.tsx   # Tiered project cards & filters
│   ├── skills-section.tsx     # Quant & engineering skills grid/tabs
│   ├── experience-section.tsx # Career timeline (Finamaze, Oracle Capital)
│   ├── quant-widget.tsx       # Optional interactive quant pricing demo
│   ├── article-list.tsx       # Minimal article rows with date and summary
│   └── contact-section.tsx    # Direct contact buttons & social links
├── data/
│   ├── portfolio-data.ts      # Canonical profile content (maps from portfolio-content.md)
│   └── articles-data.ts       # Published Substack article metadata
├── types/
│   └── portfolio.ts           # TypeScript interfaces for projects, skills, etc.
└── public/
    └── cv/                    # Downloadable CV PDFs
```

### TypeScript Data Interface Example (`types/portfolio.ts`):

```typescript
export interface Project {
  id: string;
  title: string;
  category: 'quant' | 'web' | 'ml';
  tag: string;
  description: string;
  highlights: string[];
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level?: string }[];
}

export interface Metric {
  value: string;
  label: string;
  description: string;
}
```

---

## 3. Design Integration Guide (For Your GitHub Library)

When you share your chosen GitHub repository or UI library:

1. **Component Mapping:**
   - Map `portfolio-data.hero` to the template's Hero component.
   - Map `portfolio-data.projects` to the template's Bento Grid, Carousel, or Project Cards.
   - Map `portfolio-data.skills` to the template's Tech Stack Marquee or Tabbed Skill Grid.
   - Map `portfolio-data.experience` to the template's Timeline component.
2. **Visual Theme & Aesthetic:**
   - **Recommended Aesthetic:** Modern "Linear / Bloomberg Quant" style.
   - **Background:** Deep dark slate/charcoal (`#0a0f1d` or `#09090b`).
   - **Cards & Borders:** Subtle translucent card borders (`border-white/10`, `bg-white/[0.02]`, backdrop blur).
   - **Accents:** Emerald/Mint (`#10B981`) or Electric Cyan (`#06B6D4`) denoting precision and finance.
3. **Typography:**
   - Primary Sans: Inter, Geist Sans, or Plus Jakarta Sans.
   - Monospace (for metrics, math, and code tags): JetBrains Mono or Geist Mono.

---

## 4. Interactive Quant Widget Concept (High Impact)

To stand out among standard web developer portfolios, include a small interactive client-side calculator:

- **Interactive Black-Scholes Greeks Visualizer:**
  - Sliders for Spot Price ($S$), Strike ($K$), Volatility ($\sigma$), and Time to Expiry ($T$).
  - Instant client-side calculation of Call/Put prices, $\Delta$ (Delta), and $\Gamma$ (Gamma).
  - Displays real-time LaTeX formula and dynamic output.
  - Demonstrates your combined mastery of mathematical finance and interactive frontend development.

---

## 5. SEO, Metadata & OpenGraph Standards

- **Title:** `Hassan EL QADI | Financial Engineer & Full-Stack Developer`
- **Description:** `Portfolio of Hassan EL QADI — Financial Engineer specializing in quantitative finance, derivatives pricing, risk modeling, and modern web engineering.`
- **OpenGraph Card:** Dynamic 1200x630 card with name, title, and key metric badges for clean previews on LinkedIn, Twitter, and WhatsApp.
- **Performance Target:** 98+ Lighthouse score on Desktop & Mobile (zero bloat, lazy-loaded images).
