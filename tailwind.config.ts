import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          white: '#FFFFFF',
          black: '#000000',
          'black-soft': '#1a1a1a',
          'gray-light': '#F5F5F5',
          'gray-medium': '#E5E5E5',
          'gray-text': '#666666',
          'green-light': '#90EE90',
          'green-lighter': '#F0FFF0',
          'green-accent': '#98FB98',
        },
      },
      fontFamily: {
        'onyx-regular': ['var(--font-onyx-regular)', 'monospace'],
        'onyx-black': ['var(--font-onyx-black)', 'monospace'],
        mono: ['var(--font-onyx-regular)', 'monospace'],
      },
      fontWeight: {
        'onyx-regular': '400',
        'onyx-black': '900',
      },
    },
  },
  plugins: [],
}
export default config
