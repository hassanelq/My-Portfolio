import { describe, expect, it } from "vitest";
import { parseSubstackFeed } from "./substack";

describe("Substack RSS", () => {
  it("reads published posts, decodes summaries and sorts newest first", () => {
    const xml = `<?xml version="1.0"?><rss><channel>
      <item><title>Older</title><description>One &amp; two</description><pubDate>Wed, 20 May 2026 17:37:30 GMT</pubDate><link>https://zeta233.substack.com/p/older</link></item>
      <item><title>Newer</title><description>Another essay</description><pubDate>Thu, 17 Sep 2026 21:14:12 GMT</pubDate><link>https://zeta233.substack.com/p/newer</link></item>
    </channel></rss>`;

    expect(parseSubstackFeed(xml)).toEqual([
      {
        title: "Newer",
        summary: "Another essay",
        publishedAt: "2026-09-17T21:14:12.000Z",
        substackUrl: "https://zeta233.substack.com/p/newer",
      },
      {
        title: "Older",
        summary: "One & two",
        publishedAt: "2026-05-20T17:37:30.000Z",
        substackUrl: "https://zeta233.substack.com/p/older",
      },
    ]);
  });

  it("handles an empty publication and skips invalid links", () => {
    expect(parseSubstackFeed("<rss><channel></channel></rss>")).toEqual([]);
    expect(parseSubstackFeed(`<rss><channel><item>
      <title>Bad link</title><pubDate>Thu, 17 Sep 2026 21:14:12 GMT</pubDate>
      <link>javascript:alert(1)</link>
    </item></channel></rss>`)).toEqual([]);
  });
});
