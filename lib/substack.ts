import { XMLParser } from "fast-xml-parser";

export interface Article {
  title: string;
  summary: string;
  publishedAt: string;
  substackUrl: string;
}

type FeedItem = {
  title?: unknown;
  description?: unknown;
  pubDate?: unknown;
  link?: unknown;
};

const parser = new XMLParser({
  ignoreAttributes: true,
  processEntities: true,
  trimValues: true,
});

export function parseSubstackFeed(xml: string): Article[] {
  const parsed = parser.parse(xml) as { rss?: { channel?: { item?: FeedItem | FeedItem[] } } };
  const items = parsed.rss?.channel?.item;
  const entries = Array.isArray(items) ? items : items ? [items] : [];

  return entries.flatMap((item) => {
    if (
      typeof item.title !== "string" ||
      typeof item.link !== "string" ||
      typeof item.pubDate !== "string"
    ) return [];

    const date = new Date(item.pubDate);
    if (!Number.isFinite(date.valueOf())) return [];

    let url: URL;
    try {
      url = new URL(item.link);
    } catch {
      return [];
    }
    if (url.protocol !== "https:") return [];

    return [{
      title: item.title.trim(),
      summary: typeof item.description === "string" ? item.description.trim() : "",
      publishedAt: date.toISOString(),
      substackUrl: url.toString(),
    }];
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getSubstackArticles(feedUrl: string): Promise<Article[]> {
  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    return parseSubstackFeed(await response.text());
  } catch {
    return [];
  }
}
