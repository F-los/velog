export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  image?: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  date: string;
  replies?: Comment[];
}