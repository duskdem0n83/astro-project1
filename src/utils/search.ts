import type { CollectionEntry } from 'astro:content';

export interface SearchResult {
  post: CollectionEntry<'blog'>;
  score: number;
}

export function searchPosts(
  posts: CollectionEntry<'blog'>[],
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return posts.map((post) => ({ post, score: 1 }));
  }

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const post of posts) {
    let score = 0;
    const title = post.data.title.toLowerCase();
    const description = post.data.description.toLowerCase();
    const tags = post.data.tags.map((t) => t.toLowerCase()).join(' ');
    const slug = post.slug.toLowerCase();

    // Title matches get highest score
    if (title.includes(lowerQuery)) {
      score += 10;
      if (title.startsWith(lowerQuery)) {
        score += 5;
      }
    }

    // Description matches
    if (description.includes(lowerQuery)) {
      score += 5;
    }

    // Tag matches
    if (tags.includes(lowerQuery)) {
      score += 3;
    }

    // Slug matches
    if (slug.includes(lowerQuery)) {
      score += 2;
    }

    // Content matches (basic)
    if (post.body) {
      const body = post.body.toLowerCase();
      const matches = (body.match(new RegExp(lowerQuery, 'g')) || []).length;
      score += Math.min(matches, 5);
    }

    if (score > 0) {
      results.push({ post, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
