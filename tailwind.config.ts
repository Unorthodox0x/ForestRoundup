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
        'mobileCameraHeight': '100vh',
      },
      width: {
        'accountWidth': '650px',
        'cameraWidth': '1000px',
        'mobileCameraWidth': '100vw',
      },
      fontFamily: {
        Milonga: ['Milonga', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}

export default config;