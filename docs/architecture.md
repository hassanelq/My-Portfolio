# Architecture

## Stack in the repository

| Layer | Implementation |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript 6 |
| Styling | Tailwind CSS 4 plus shared CSS in `app/globals.css` |
| Fonts | Local Aeonik Regular TTF and Input Regular WOFF2 through `next/font/local` |
| UI | Custom components, native HTML controls and dialogs, Lucide icons |
| Charts | Custom SVG; Canvas for dense Monte Carlo paths |
| Mathematics | Pure TypeScript modules; KaTeX for displayed equations |
| Background computation | Browser Web Worker for Monte Carlo reruns |
| Testing | Vitest, Playwright, TypeScript, ESLint |
| Hosting | Vercel; production-only Analytics and Speed Insights components |
| Content | Versioned TypeScript records and JSON snapshots; no database or CMS |

Use `package.json` and `package-lock.json` for exact dependency versions. The current UI uses custom primitives; shadcn/ui, Motion and Zod are not installed dependencies.

## Routes

| Route | Entry point | Contents |
| --- | --- | --- |
| `/` | `app/page.tsx` | Profile, featured work, about/skills, experience, education, extracurricular roles and contact |
| `/projects` | `app/projects/page.tsx` | Filterable project catalog |
| `/lab` | `app/lab/page.tsx` | Seven instruments with anchor navigation |
| `/tools` | `app/tools/page.tsx` | Four calculators in a selectable workspace |
| `/arcade` | `app/arcade/page.tsx` | Three games with anchor navigation |
| `/articles` | `app/articles/page.tsx` | Hassan's publication feed and Zeta's four newest posts |

`next.config.mjs` owns permanent legacy redirects, including `/about` → `/#about`, `/contact` → `/#contact`, `/blogs` → `/articles`, `/CV_Hassan.pdf` → the English CV, and named old project URLs. Preserve these mappings when renaming public anchors.

## Directory responsibilities

```text
app/                 Route composition, metadata, fonts and global styles
components/layout/   Header and footer
components/ui/       Shared fields, dialogs, charts, headings and CV selector
components/projects/ Project filtering and illustrations
components/lab/      Quant instruments, shared controls and simulation worker
components/tools/    Financial calculators and workspace navigation
components/arcade/   Game interfaces
content/             Editable records, defaults and normalized data snapshots
lib/math/            Pure calculations and unit tests
scripts/             Historical-data importers
data/               Raw source downloads and provenance manifests
public/              Downloadable CVs, research report and other static assets
tests/e2e/           Browser checks
docs/                Current documentation
```

## Rendering and state

Page shells, static copy and metadata use Server Components. Interactive filters, instruments, calculators and games use Client Components. Content modules provide typed inputs to both. Pure engines return results to the UI; they do not fetch data or manipulate the DOM.

Historical datasets are bundled JSON snapshots. Python importers fetch and normalize data only when a maintainer explicitly runs them. Visitors do not call a financial data API. The articles page fetches Hassan's and Zeta's public Substack RSS feeds on the server and revalidates them hourly.

The tools workspace keeps all five panels mounted and hides inactive panels. Inputs and unfinished questionnaire progress survive tab changes, then reset on reload. The tab selection is local state, not a shareable query parameter. Correlation-game personal records use browser localStorage with a fallback when storage is unavailable. There is no account system or saved financial profile.

Monte Carlo renders a seeded initial sample and sends subsequent simulations to `components/lab/monte-carlo.worker.ts`. Most other calculations run synchronously in the browser.

## Shared design and accessibility

Keep [DESIGN.md](DESIGN.md) as the visual reference. Its example brand, tiny source measurements and sample accent suggestions do not override the portfolio's current implementation:

- Aeonik headlines/body, Input metadata and numbers; actual font files live in `app/fonts/`.
- Obsidian surfaces, chalk text, graphite dividers and compass-gold icons. Financial tools use neutral chart colors plus distinct line patterns.
- Readable typography, including the owner's larger text adjustment; CSS is the source of implemented sizes.
- Native `Dialog` with focus handling, Escape, close action, backdrop dismissal and scrollable long content.
- Shared `AgeChart` for DCA, retirement and rent/buy: pointer, touch and keyboard exploration, age/year labels and negative-value support.
- Responsive navigation, skip link, visible focus, labeled inputs and chart summaries.

## Metadata and public assets

`content/site.ts` owns the canonical domain (`https://elqadi.me` in the current content), identity and navigation. `app/layout.tsx` defines shared metadata and social defaults. Route files supply page titles and canonical paths. `app/sitemap.ts`, `app/robots.ts` and `app/opengraph-image.tsx` generate discovery and sharing assets.

The EN/FR control selects a CV PDF; the website itself is currently English. Both public CVs remain under `public/cv/`. Project report links resolve under `public/`.

See [development](development.md) for commands and [content guide](content-guide.md) for editing workflows.
