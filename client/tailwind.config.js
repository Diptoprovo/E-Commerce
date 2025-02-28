/** @type {import('tailwindcss').Config} */

// import { Flowbite } from 'flowbite-react'
const flowbite = require("flowbite-react/tailwind")
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
  ],
}