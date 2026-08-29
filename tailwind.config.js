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
        background: '#fafafa',
        surface: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          border: 'rgba(0, 0, 0, 0.08)',
          'border-hover': 'rgba(0, 0, 0, 0.16)',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          accent: '#ea580c',
          glow: 'rgba(234, 88, 12, 0.15)',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        script: ['"Caveat"', '"Nothing You Could Do"', '"Nanum Pen Script"', '"Covered By Your Grace"', '"Reenie Beanie"', 'cursive'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 4px 20px -4px rgba(234, 88, 12, 0.18)',
        'glow-md': '0 8px 30px -4px rgba(234, 88, 12, 0.22)',
        'glow-lg': '0 16px 40px -8px rgba(234, 88, 12, 0.25)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 35px -10px rgba(0, 0, 0, 0.07), 0 0 20px -4px rgba(234, 88, 12, 0.1)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
