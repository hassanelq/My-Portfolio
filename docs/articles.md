# Articles

**Route:** `/articles` · **Page:** `app/articles/page.tsx` · **Source settings:** `content/articles.ts` · **Feed reader:** `lib/substack.ts`.

The page has two clearly labeled sections across the same 1200px container used by the other routes:

1. **My articles:** Hassan's [Substack profile](https://substack.com/@hassanelqadi/) and publication feed (`https://hassanelqadi.substack.com/feed`). The feed was checked and currently has zero posts, so this section shows **Articles coming soon.** It will populate automatically when posts appear in the publication feed.
2. **From Zeta:** a writer Hassan follows and draws inspiration from. The page shows only the **four newest** entries from `https://zeta233.substack.com/feed` and links to [Zeta's profile](https://substack.com/@zeta233). These posts are attributed to Zeta, never presented as Hassan's writing.

## How it updates

Substack provides a publication feed at `https://YOUR-PUBLICATION.substack.com/feed`. The page fetches both feeds on the server with a one-hour Next.js revalidation interval. `fast-xml-parser` reads each RSS item's title, description, publication date and URL. Entries are sorted newest first. There is no API key or manual post list.

A feed can contain only a limited set of recent posts; this page does not guarantee a complete archive. If Hassan's feed is empty or temporarily unavailable, his section keeps its empty state. Zeta's section shows whatever articles are available from his feed, up to four.

To change either source, edit its `profileUrl` and `feedUrl` in `content/articles.ts`. The feed URL belongs to a **publication**, which may differ from the `substack.com/@username` profile URL. Neither the article body nor third-party HTML is rendered locally. Links open Substack; dates use semantic `<time>` elements.

Source: [Substack's RSS feed documentation](https://support.substack.com/hc/en-us/articles/360038239391-Is-there-an-RSS-feed-for-my-publication).
