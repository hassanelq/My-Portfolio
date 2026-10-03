import type { Metadata } from "next";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { PageHeading } from "@/components/ui/page-heading";
import { pageIntros } from "@/content/site";
import { substack } from "@/content/articles";
import { getSubstackArticles, type Article } from "@/lib/substack";
export const metadata: Metadata = {
  title: "Articles",
  description: pageIntros.articles.description,
  alternates: { canonical: "/articles" },
};
function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="article-list">
      {articles.map((article) => (
        <a
          key={article.substackUrl}
          href={article.substackUrl}
          target="_blank"
          rel="noreferrer"
        >
          <div>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
          </div>
          <time dateTime={article.publishedAt}>
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(article.publishedAt))}
          </time>
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export default async function ArticlesPage() {
  const [mine, zeta] = await Promise.all([
    getSubstackArticles(substack.mine.feedUrl),
    getSubstackArticles(substack.zeta.feedUrl),
  ]);
  return (
    <div className="page-container articles-page">
      <PageHeading {...pageIntros.articles} />
      <section className="article-section" aria-labelledby="my-articles-title">
        <div className="article-section-heading">
          <div>
            <p className="eyebrow">01 / MY WRITING</p>
            <h2 id="my-articles-title">My articles</h2>
          </div>
          <a
            className="text-link"
            href={substack.mine.profileUrl}
            target="_blank"
            rel="noreferrer"
          >
            My Substack <ArrowUpRight size={16} />
          </a>
        </div>
        {mine.length ? (
          <ArticleList articles={mine} />
        ) : (
          <div className="articles-empty">
            <BookOpen size={30} strokeWidth={1} className="gold-icon" />
            <p className="eyebrow">THE FIRST PAGE IS STILL BLANK</p>
            <h3>Articles coming soon.</h3>
            <p>
              I’m making room for longer thoughts.
              <br />
              You’ll find them here when they’re ready.
            </p>
            <span className="mono">FINANCE / TECHNOLOGY / CURIOSITY</span>
          </div>
        )}
      </section>

      <section className="article-section" aria-labelledby="zeta-articles-title">
        <div className="article-section-heading">
          <div>
            <p className="eyebrow">02 / WRITING I FOLLOW</p>
            <h2 id="zeta-articles-title">From Zeta</h2>
            <p className="article-section-description">
              I follow Zeta and find his articles thoughtful and inspiring.
            </p>
          </div>
          <a
            className="text-link"
            href={substack.zeta.profileUrl}
            target="_blank"
            rel="noreferrer"
          >
            Zeta on Substack <ArrowUpRight size={16} />
          </a>
        </div>
        <ArticleList articles={zeta.slice(0, 4)} />
      </section>
    </div>
  );
}
