import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'cameraHeight': '520px',
        'canvasHeight': '520px',
      },
      width: {
        'cameraWidth': '1000px',
        'canvasWidth': '580px',
      },
      fontFamily: {
        Milonga: ['Milonga', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}

export default config;