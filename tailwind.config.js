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
        monk: {
          50: '#fdf8f0',
          100: '#fbefd9',
          200: '#f6ddb2',
          300: '#f0c481',
          400: '#e8a44e',
          500: '#e18b2a',
          600: '#d2741f',
          700: '#ae5a1c',
          800: '#8c471e',
          900: '#723c1c',
          950: '#3d1d0c',
        },
        zen: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bbe4bb',
          300: '#8fd08f',
          400: '#5fb35f',
          500: '#3e9a3e',
          600: '#2d7a2d',
          700: '#266226',
          800: '#224f22',
          900: '#1e421e',
          950: '#0c240c',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(225, 139, 42, 0.5)' },
          'to': { boxShadow: '0 0 30px rgba(225, 139, 42, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}