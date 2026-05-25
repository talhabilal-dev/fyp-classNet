/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10B981',
          600: '#059669',
        },
        surface: {
          DEFAULT: '#0f1724',
          2: '#111827',
          3: '#0b1220'
        },
        muted: '#94a3b8',
        accent: {
          yellow: '#F59E0B',
          red: '#EF4444'
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          lg: '2rem'
        }
      }
    },
  },
  plugins: [],
}
