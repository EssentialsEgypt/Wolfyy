/**
 * Tailwind CSS configuration.
 *
 * We enable future-proofing and purge unused styles in production. Feel free
 * to extend the theme or add plugins as your application grows.
 */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};