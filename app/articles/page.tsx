import type { Metadata } from "next";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { PageHeading } from "@/components/ui/page-heading";
import { pageIntros } from "@/content/site";
import { articles, publicationUrl } from "@/content/articles";
export const metadata: Metadata = {
  title: "Articles",
  description: pageIntros.articles.description,
  alternates: { canonical: "/articles" },
};
export default function ArticlesPage() {
  const sorted = [...articles].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  return (
    <div className="page-container articles-page">
      <PageHeading {...pageIntros.articles}>
        {publicationUrl && (
          <a
            className="text-link"
            href={publicationUrl}
            target="_blank"
            rel="noreferrer"
          >
            Read on Substack <ArrowUpRight size={16} />
          </a>
        )}
      </PageHeading>
      {sorted.length ? (
        <div className="article-list">
          {sorted.map((article) => (
            <a
              key={article.substackUrl}
              href={article.substackUrl}
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <h2>{article.title}</h2>
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
              <ArrowUpRight size={17} />
            </a>
          ))}
        </div>
      ) : (
        <div className="articles-empty">
          <BookOpen size={30} strokeWidth={1} className="gold-icon" />
          <p className="eyebrow">THE FIRST PAGE IS STILL BLANK</p>
          <h2>Articles coming soon.</h2>
          <p>
            I’m making room for longer thoughts.
            <br />
            You’ll find them here when they’re ready.
          </p>
          <span className="mono">FINANCE / TECHNOLOGY / CURIOSITY</span>
        </div>
      )}
    </div>
  );
}
