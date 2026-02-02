import rss from '@astrojs/rss';
import { getPosts } from '../utils/getPosts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  
  return rss({
    title: 'My Bucking Blog',
    description: 'A modern tech blog built with Astro',
    site: context.site?.toString() || 'https://your-domain.vercel.app',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
