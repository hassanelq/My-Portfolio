export interface Article {
  title: string;
  summary: string;
  publishedAt: string;
  substackUrl: string;
}
// Add your publication URL and published posts here. The page handles the empty state automatically.
export const publicationUrl: string | null = null;
export const articles: Article[] = [];
