
/** @type {import('tailwindcss').Config} */
export default {
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
    },
  },
  plugins: [],
}