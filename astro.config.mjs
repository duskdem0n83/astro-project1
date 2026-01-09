import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypePrettyCode from 'rehype-pretty-code';

// https://astro.build/config
export default defineConfig({
  site: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.PUBLIC_SITE_URL || 'https://astro-project1-n4y83kdau-dans-projects-c61e2af5.vercel.app',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    // Temporarily disabled due to build error - will re-enable after fixing
    // sitemap(),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: false,
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copyable.
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node) {
            if (!node.properties.className) {
              node.properties.className = [];
            }
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
    ],
  },
});
