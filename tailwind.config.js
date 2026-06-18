/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08080A',
        pit: '#0E0D10',
        panel: '#121116',
        'panel-2': '#16151B',
        line: '#26242C',
        bone: '#ECE8E0',
        ash: '#8B8893',
        faint: '#56535D',
        blood: '#E10600',
        'blood-2': '#FF1A0E',
        'blood-deep': '#7A0400',
      },
      fontFamily: {
        display: ['"Grenze Gotisch"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        util: ['Oswald', 'sans-serif'],
      },
      maxWidth: {
        wrap: '1180px',
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      boxShadow: {
        glow: '0 14px 40px -10px rgba(225,6,0,.7)',
        'glow-sm': '0 0 16px -2px #E10600',
        featured: '0 0 0 1px #E10600, 0 34px 80px -40px rgba(225,6,0,.55)',
      },
    },
  },
  plugins: [],
}
