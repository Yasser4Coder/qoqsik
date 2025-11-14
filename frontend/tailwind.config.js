/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        alabaster: '#F5F6FB',
        lavender: '#E8EEFF',
        indigo: '#3A3F75',
        slate: '#5C607C',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 20px 60px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}

