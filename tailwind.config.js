/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#2A5C45', light: '#3D7A5E', dark: '#1A3C2C', 50: '#EEF6F1', 100: '#D4EBD9' },
        terra: { DEFAULT: '#C4622D', light: '#D97748', dark: '#9B4A1E', 50: '#FDF0E8' },
        andean: { DEFAULT: '#5BA3C9', light: '#7BBDDC', dark: '#3D82A8', 50: '#EEF7FC' },
        sand: { DEFAULT: '#E8D5B0', dark: '#C9B48A' },
        stone: '#6B7280',
        ruka: {
          bg: '#F8F4EE',
          dark: '#1A2E1E',
          card: '#FFFFFF',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      backgroundImage: {
        'hero-chile': "linear-gradient(135deg, rgba(26,46,30,0.85) 0%, rgba(42,92,69,0.7) 50%, rgba(91,163,201,0.5) 100%)",
      },
    },
  },
  plugins: [],
}
