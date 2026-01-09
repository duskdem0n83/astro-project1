/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            '[class~="lead"]': {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
            },
            'ol > li::before': {
              color: 'inherit',
            },
            'ul > li::before': {
              backgroundColor: 'inherit',
            },
            hr: {
              borderColor: 'inherit',
            },
            blockquote: {
              color: 'inherit',
              borderLeftColor: 'inherit',
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            'figure figcaption': {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
            },
            'a code': {
              color: 'inherit',
            },
            pre: {
              color: 'inherit',
              backgroundColor: 'transparent',
            },
            thead: {
              color: 'inherit',
              borderBottomColor: 'inherit',
            },
            'tbody tr': {
              borderBottomColor: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
