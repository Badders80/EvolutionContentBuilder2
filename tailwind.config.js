/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
      },
      colors: {
        es: {
          bg: '#ffffff',
          bgSoft: '#f7f7f7',
          text: '#1a1a1a',
          textSoft: '#4a4a4a',
          border: '#d4d4d4',
          borderStrong: '#9a9a9a',
          muted: '#e4e4e4',
        },
      },
    },
  },
  plugins: [],
}
