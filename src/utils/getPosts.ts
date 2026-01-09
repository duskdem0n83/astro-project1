import { getCollection } from 'astro:content';

export async function getPosts(includeDrafts: boolean = false) {
  const posts = await getCollection('blog', ({ data }) => {
    // Filter out drafts in production unless explicitly requested
    if (import.meta.env.PROD && !includeDrafts) {
      return data.draft !== true;
    }
    return true;
  });
  return posts.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export async function getAllPosts(includeDrafts: boolean = false) {
  return getPosts(includeDrafts);
}

export async function getPostsByTag(tag: string) {
  const posts = await getPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

export function getAllTags(posts: Awaited<ReturnType<typeof getPosts>>) {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
