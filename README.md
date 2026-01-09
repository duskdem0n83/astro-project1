# Astro Blog

A modern, performant tech blog built with Astro, featuring:

- 📝 Markdown-based blog posts with MDX support
- 🎨 Tailwind CSS with dark mode
- 🔍 Client-side search functionality
- 🏷️ Tag system for organizing posts
- 📡 RSS feed generation
- 🗺️ Automatic sitemap generation
- 🚀 Optimized for Vercel deployment
- ♿ Accessible components
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:4321](http://localhost:4321) in your browser.

## Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── components/ # Reusable Astro components
│   ├── content/    # Blog posts (markdown files)
│   ├── layouts/    # Page layouts
│   ├── pages/      # Routes and pages
│   ├── styles/     # Global styles
│   └── utils/      # Utility functions
└── package.json
```

## Creating Blog Posts

Create a new markdown file in `src/content/blog/` with the following frontmatter:

```markdown
---
title: Your Post Title
description: A brief description of your post
publishDate: 2025-01-15
tags:
  - tag1
  - tag2
author: Your Name
---
```

## Building for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

## Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Astro and configure the build settings
4. Your site will be deployed!

Alternatively, you can use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Features

### Dark Mode

The blog includes a dark mode toggle that persists your preference using localStorage.

### Search

The search bar in the header allows you to search through blog posts by title, description, tags, and content.

### Tags

Posts can be tagged and filtered by visiting `/blog/tag/[tag-name]`.

### RSS Feed

An RSS feed is automatically generated at `/rss.xml`.

### Sitemap

A sitemap is automatically generated at `/sitemap.xml`.

## Customization

### Site Configuration

Update `astro.config.mjs` to change your site URL and other settings.

### Styling

- Global styles: `src/styles/global.css`
- Tailwind config: `tailwind.config.mjs`
- Component styles: Use Tailwind classes directly in components

### Content Schema

Modify `src/content/config.ts` to add or change frontmatter fields.

## License

MIT
