import type { CollectionEntry } from 'astro:content';

/**
 * Find related posts based on shared tags
 */
export function getRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit: number = 3
): CollectionEntry<'blog'>[] {
  const currentTags = new Set(currentPost.data.tags);
  
  // Calculate similarity score based on shared tags
  const scoredPosts = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const postTags = new Set(post.data.tags);
      const sharedTags = [...currentTags].filter((tag) => postTags.has(tag));
      const score = sharedTags.length;
      
      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);

  return scoredPosts;
}
