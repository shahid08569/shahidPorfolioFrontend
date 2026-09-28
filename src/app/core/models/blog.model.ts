export interface BlogPostCard {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl?: string;
  tagsJson: string;
  tags?: string[];
  readTimeMinutes: number;
  publishedAtUtc?: string;
}

export interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  coverImageUrl?: string;
  tagsJson: string;
  tags?: string[];
  readTimeMinutes: number;
  publishedAtUtc?: string;
}
