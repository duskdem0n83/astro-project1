# Blog Files Index

This document lists all blog-related files in the Astro project.

## Blog Content Files

### Blog Posts (Markdown)
Location: `src/content/blog/`

1. `mwcc-notes.md` - MWCC Notes blog post
2. `osint-exercises-walkthrough.md` - OSINT Exercises Walkthrough
3. `programming-languages-comparison.md` - Programming Languages Comparison (42 languages)
4. `reverse-engineer-anti-debug2.md` - Reverse Engineer Anti-Debug 2
5. `reverse-engineering-101.md` - Reverse Engineering 101

### Content Configuration
- `src/content/config.ts` - Content collection schema definition for blog posts

## Blog Layouts

Location: `src/layouts/`

1. `BlogLayout.astro` - Main blog post layout with reading progress, TOC, related posts
2. `BaseLayout.astro` - Base layout used by BlogLayout

## Blog Pages

Location: `src/pages/blog/`

1. `[slug].astro` - Dynamic blog post page (individual post view)
2. `tag/[tag].astro` - Tag-based blog post listing page
3. `../rss.xml.ts` - RSS feed generator for blog posts
4. `../index.astro` - Home page (may display blog posts)

## Blog Components

Location: `src/components/`

1. `BlogPost.astro` - Blog post component
2. `RelatedPosts.astro` - Related posts component
3. `TableOfContents.astro` - Table of contents component for blog posts
4. `TagList.astro` - Tag list component for blog posts
5. `ReadingProgress.astro` - Reading progress indicator for blog posts
6. `SearchBar.astro` - Search functionality for blog posts

## Blog Utilities

Location: `src/utils/`

1. `getPosts.ts` - Function to retrieve and filter blog posts
2. `relatedPosts.ts` - Function to find related posts based on tags
3. `readingTime.ts` - Function to calculate reading time for blog posts
4. `search.ts` - Search functionality for blog posts

## Blog Scripts

Location: `src/scripts/`

1. `copyCode.ts` - Code block copy functionality (used in blog posts)

## Blog Styles

Location: `src/styles/`

1. `global.css` - Global styles including blog post styling (prose-custom)

## File Structure Summary

```
astro-project1/
├── src/
│   ├── content/
│   │   ├── blog/                    # Blog post markdown files
│   │   │   ├── mwcc-notes.md
│   │   │   ├── osint-exercises-walkthrough.md
│   │   │   ├── programming-languages-comparison.md
│   │   │   ├── reverse-engineer-anti-debug2.md
│   │   │   └── reverse-engineering-101.md
│   │   └── config.ts                # Content collection schema
│   ├── layouts/
│   │   ├── BlogLayout.astro         # Blog post layout
│   │   └── BaseLayout.astro        # Base layout
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── [slug].astro        # Individual post page
│   │   │   └── tag/
│   │   │       └── [tag].astro     # Tag listing page
│   │   ├── index.astro              # Home page
│   │   └── rss.xml.ts               # RSS feed
│   ├── components/
│   │   ├── BlogPost.astro          # Blog post component
│   │   ├── RelatedPosts.astro       # Related posts
│   │   ├── TableOfContents.astro   # TOC component
│   │   ├── TagList.astro           # Tag list component
│   │   ├── ReadingProgress.astro   # Reading progress
│   │   └── SearchBar.astro          # Search bar
│   ├── utils/
│   │   ├── getPosts.ts              # Get blog posts
│   │   ├── relatedPosts.ts          # Find related posts
│   │   ├── readingTime.ts           # Calculate reading time
│   │   └── search.ts                # Search functionality
│   ├── scripts/
│   │   └── copyCode.ts              # Code copy functionality
│   └── styles/
│       └── global.css               # Global styles
└── BLOG_FILES_INDEX.md              # This file
```

## Total Blog-Related Files

- **Blog Posts**: 5 markdown files
- **Layouts**: 2 files
- **Pages**: 3 files (including RSS)
- **Components**: 6 files
- **Utilities**: 4 files
- **Scripts**: 1 file
- **Styles**: 1 file (shared)
- **Config**: 1 file

**Total: 23 blog-related files**

## Notes

- All blog-related files are located within the `astro-project1` directory
- Blog posts use Astro's content collections system
- The blog supports features like:
  - Table of contents
  - Reading progress indicator
  - Related posts
  - Tag-based filtering
  - Search functionality
  - RSS feed
  - Reading time calculation
  - Code block copying

