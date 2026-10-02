# Articles: Substack Writing Index

The `/articles` route will be the portfolio's index of Hassan EL QADI's writing. Hassan plans to publish full articles on Substack. The portfolio will show a concise, readable list and link each entry to its original Substack post.

The supplied Zeta Method screenshot is a **visual reference** for page hierarchy and list layout, not source copy or article content.

---

## Page Structure

1. **Global navigation:** Include `Articles` alongside Home, Projects, Lab, Tools, and Arcade. Mark it active on `/articles`.
2. **Heading:** `Articles` in a large, clear type size.
3. **Introduction:** One short sentence about the writing, with a visible link to Hassan's Substack publication once its URL is available.
4. **Article list:** Newest first. Each row contains a linked title, a one- or two-sentence summary, the publication date, and a small external-link arrow (`↗`). The entire row may be clickable, with a visible keyboard focus state.
5. **Empty state:** Before the first post is published, show a simple “Articles coming soon” message. Do not display sample posts as if they were Hassan's work.

Each article goes to its canonical Substack URL. The portfolio index does not duplicate article bodies or create local article detail pages.

---

## Visual Direction

- Use the reference image's restrained editorial layout: a nearly black page, one centered content column, ample space above the heading, and thin separators between rows.
- Keep content left aligned within a readable width of roughly `800–850px`. Avoid image thumbnails and large cards in the default list.
- Make the title the strongest element in each row; set summaries and dates in muted text. Place dates and the external-link arrow at the right on wider screens.
- On narrow screens, let titles wrap and place the date below the summary or in a compact row. Preserve comfortable tap targets and clear separators.
- Use the platform's own typography, colors, and navigation treatment so the page belongs to Hassan's portfolio. The screenshot guides composition, not branding.

---

## Content Data

Keep the index content separate from presentation in `content/articles.ts`:

```typescript
export interface Article {
  title: string;
  summary: string;
  publishedAt: string; // ISO date, e.g. YYYY-MM-DD
  substackUrl: string;  // Full URL of the published post
}

export const articles: Article[] = [];
```

Add an entry only after the post is published. Sort by `publishedAt` descending and render the date with a semantic `<time dateTime={article.publishedAt}>` element. The Substack publication URL and article URLs are still to be supplied; keep them out of the specification until known.

For the initial version, maintain this small list manually. If the publication later has a suitable feed and automatic updates become useful, feed synchronization can be considered separately.

---

## Metadata and Links

- Page title: `Articles | Hassan EL QADI`.
- Description: a concise introduction to Hassan's writing, updated when the publication's focus is settled.
- External article links should clearly lead to Substack and have descriptive accessible names. Keep the arrow decorative for screen readers.
- The publication link in the introduction should point to Hassan's actual Substack homepage once available.
