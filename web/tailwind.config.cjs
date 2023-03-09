/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      display: ['"Archivo Black"', 'sans-serif']
    },
    extend: {
      colors: {
        'white-t-60': 'rgba(255, 255, 255, 0.6)'
      }
    }
  },
  plugins: []
}
