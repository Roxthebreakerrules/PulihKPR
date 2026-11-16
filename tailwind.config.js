/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        btn: {
          navy: {
            DEFAULT: '#0A3871',
            dark: '#06254F',
            light: '#134D96',
            hover: '#083060',
          },
          orange: {
            DEFAULT: '#F37021',
            dark: '#D4570F',
            light: '#FF883E',
            hover: '#E06015',
          },
          slate: '#F8FAFC',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'btn-card': '0 1px 3px 0 rgba(10, 56, 113, 0.05), 0 1px 2px -1px rgba(10, 56, 113, 0.05)',
        'btn-hover': '0 4px 12px 0 rgba(10, 56, 113, 0.08)',
        'btn-elevated': '0 10px 25px -5px rgba(10, 56, 113, 0.1), 0 8px 10px -6px rgba(10, 56, 113, 0.05)',
      }
    },
  },
  plugins: [],
}
