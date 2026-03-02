export interface BlogPostTranslation {
  title: string;
  excerpt: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date?: string;
  image?: string;
  translations?: Record<string, BlogPostTranslation>;
}
