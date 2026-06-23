/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A2540',
          50: '#E8EEF2',
          100: '#D1DEE5',
          200: '#A3BDCB',
          300: '#759DB1',
          400: '#477C97',
          500: '#0A2540',
          600: '#091E35',
          700: '#07172A',
          800: '#05111F',
          900: '#040B15',
        },
        secondary: {
          DEFAULT: '#00C2CB',
          50: '#E6FCFC',
          100: '#CDF9F9',
          200: '#9BF3F3',
          300: '#69EDED',
          400: '#37E7E7',
          500: '#00C2CB',
          600: '#009BA0',
          700: '#007475',
          800: '#004D4F',
          900: '#00262A',
        },
        eco: {
          DEFAULT: '#2ECC71',
          light: '#58D68D',
          dark: '#239B56',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}