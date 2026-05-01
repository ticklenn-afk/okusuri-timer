/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rounded: ['"Zen Maru Gothic"', '"M PLUS Rounded 1c"', 'sans-serif'],
        kawaii:  ['"Mochiy Pop One"', 'sans-serif'],
      },
      colors: {
        sakura: {
          100: '#FFE4EE',
          200: '#FFB3D0',
          300: '#FF85B3',
        },
        sky: {
          pastel: '#C8EEFF',
        },
        mint: {
          pastel: '#C8FFE8',
        },
        lavender: {
          pastel: '#E8C8FF',
        },
      },
      boxShadow: {
        puffy: '0 6px 0 rgba(255,160,200,0.5), 0 8px 20px rgba(255,100,180,0.2)',
        'puffy-blue': '0 6px 0 rgba(140,200,255,0.5), 0 8px 20px rgba(100,180,255,0.2)',
        'puffy-mint': '0 6px 0 rgba(140,255,200,0.5), 0 8px 20px rgba(100,220,180,0.2)',
        'puffy-lavender': '0 6px 0 rgba(200,140,255,0.5), 0 8px 20px rgba(180,100,255,0.2)',
        card: '0 4px 24px rgba(200,100,200,0.12), 0 1px 4px rgba(180,100,220,0.08)',
      },
    },
  },
  plugins: [],
}
