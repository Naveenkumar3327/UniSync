/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
          light: 'var(--secondary-light)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
        },
        background: {
          DEFAULT: 'var(--background)',
          alt: 'var(--background-alt)',
        },
        card: {
          DEFAULT: 'var(--card-bg)',
          border: 'var(--card-border)',
        },
        text: {
          DEFAULT: 'var(--text-main)',
          muted: 'var(--text-muted)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.16)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
