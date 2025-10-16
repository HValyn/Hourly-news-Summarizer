
export interface NewsArticle {
  title: string;
  summary: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface NewsData {
  articles: NewsArticle[];
  sources: GroundingSource[];
}
