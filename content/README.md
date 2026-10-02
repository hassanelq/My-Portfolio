# Editing the portfolio

The site's content lives here, independently of page layouts. Save a file and the local preview updates. A Git commit records exactly what changed. No database or CMS is needed for this version.

| File                  | Edit here                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `site.ts`             | Name, description, availability, contact, canonical domain, navigation, CV paths, page introductions           |
| `portfolio.ts`        | Hero, metrics, about paragraphs, skills, experience, education, certifications, honors                         |
| `projects.ts`         | Project descriptions, categories, highlights, technologies, repository/demo/report URLs and homepage selection |
| `articles.ts`         | Substack publication URL and published article metadata                                                        |
| `tools.ts`            | DCA default inputs and editable annual-return assumptions                                                      |
| `market-windows.json` | Sourced S&P 500 observations used by the chart game (see `docs/DATA_SOURCES.md`)                               |

## Add a project

Add a record to `projects` in `projects.ts`. Copy an existing entry to preserve its shape. `id` is the permanent URL anchor; `category` must match `categories`. Set `featured: true` to show the project on the homepage (three recommended). Omit a link when it does not exist. A private client project is labeled accordingly rather than given an invented repository URL. Project filters and counts update automatically.

Claims and metrics currently use the supplied portfolio documents, as requested. Review those before publishing. The Artisan ERP repository URL is still unknown; add its actual URL when available.

## Publish an article

1. Publish on Substack.
2. Set `publicationUrl` in `articles.ts` to your publication's real URL.
3. Add `{ title, summary, publishedAt: "YYYY-MM-DD", substackUrl }` to `articles` using the published article URL.

The list sorts newest first. With an empty array it displays **Articles coming soon.** The initial version uses a curated list, so publishing on Substack alone does not add a row automatically.

## Update the CV

Replace `public/cv/hassan-elqadi-en.pdf` and `public/cv/hassan-elqadi-fr.pdf`, preserving filenames. The EN/FR control selects the download language; it does not translate the website. Current source PDFs remain in `docs/`. The former `/CV_Hassan.pdf` URL redirects to the English replacement.

## Adjust the design or calculations

- `app/globals.css`: shared design tokens, layout, component styles and breakpoints.
- `components/`: reusable UI, lab controls and arcade games.
- `lib/math/`: pure calculation functions and benchmark tests.
- `app/`: route composition and metadata.

Run `npm run typecheck` after content edits. Run `npm test` when changing calculations, and `npm run build` before deployment. Keep real data sources and illustrative assumptions clearly distinguished.
