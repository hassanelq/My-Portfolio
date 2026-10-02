# Hassan EL QADI — Finance × Software

A six-page portfolio built with Next.js 16 App Router, React 19, TypeScript and Tailwind CSS 4. Local Aeonik and Input fonts, custom SVG/Canvas charts, KaTeX equations, and a worker for Monte Carlo simulations. Prepared for Vercel deployment.

## Development

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Use Node.js 22 or later.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests start a production server on port 3100 after a build. Local development uses port 3000.

## Pages

- `/`: profile, selected work, background, experience and contact
- `/projects`: eight projects, filters, source and existing demo links
- `/lab`: seven interactive quantitative instruments
- `/tools`: editable DCA projection in today's MAD
- `/arcade`: three probability and market games
- `/articles`: Substack article index; starts with “Articles coming soon.”

## Make it yours

Edit the typed files in [`content/`](content/README.md). CV PDFs are in `public/cv/` with an EN/FR selector. Visual rules are in `app/globals.css`; calculation functions and their tests are in `lib/math/`.

See [`docs/README.md`](docs/README.md) for design/specifications and [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) for model assumptions and dataset provenance. This initial DCA calculator uses fixed assumptions, not historical replay.

## Vercel

Import the repository, select Next.js, use `npm ci` and `npm run build`, and select Node.js 22. No database, secrets, or API keys are required. Set the final canonical domain in `content/site.ts`. Vercel Analytics and Speed Insights load in production; their dashboards can be enabled in the Vercel project.

Production publishing and account/domain setup are separate from the local implementation.

If a restricted development environment blocks Turbopack’s internal CSS-worker port, `npm run build -- --webpack` uses Next.js’s supported alternate compiler. The final local verification used that production build.
