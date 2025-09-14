import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BlogPost, BlogCategory } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const { data, content } = matter(fileContents);
      const readingTimeResult = readingTime(content);

      return {
        slug,
        title: data.title || '',
        excerpt: data.excerpt || '',
        content,
        date: data.date || '',
        author: data.author || '김태회',
        category: data.category || 'Development',
        tags: data.tags || [],
        readingTime: readingTimeResult.text,
        image: data.image || null,
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) {
      // Try .mdx extension
      const mdxPath = path.join(postsDirectory, `${realSlug}.mdx`);
      if (!fs.existsSync(mdxPath)) {
        return null;
      }
      const fileContents = fs.readFileSync(mdxPath, 'utf8');
      const { data, content } = matter(fileContents);
      const readingTimeResult = readingTime(content);

      return {
        slug: realSlug,
        title: data.title || '',
        excerpt: data.excerpt || '',
        content,
        date: data.date || '',
        author: data.author || '김태회',
        category: data.category || 'Development',
        tags: data.tags || [],
        readingTime: readingTimeResult.text,
        image: data.image || null,
      };
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const readingTimeResult = readingTime(content);

    return {
      slug: realSlug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content,
      date: data.date || '',
      author: data.author || '김태회',
      category: data.category || 'Development',
      tags: data.tags || [],
      readingTime: readingTimeResult.text,
      image: data.image || null,
    };
  } catch (error) {
    return null;
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(post =>
    post.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(post =>
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllCategories(): BlogCategory[] {
  const posts = getAllPosts();
  const categoryMap = new Map<string, { count: number; posts: BlogPost[] }>();

  posts.forEach(post => {
    const category = post.category;
    if (categoryMap.has(category)) {
      categoryMap.get(category)!.count++;
      categoryMap.get(category)!.posts.push(post);
    } else {
      categoryMap.set(category, { count: 1, posts: [post] });
    }
  });

  return Array.from(categoryMap.entries()).map(([name, { count }]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    description: `${count}개의 포스트`,
    postCount: count,
  }));
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();

  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}