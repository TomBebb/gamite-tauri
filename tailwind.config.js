import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
const config = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    safelist: [{ pattern: /grid-cols-[0-9]+/ }],
    theme: {
        extend: {},
    },
    plugins: [daisyui],
}

export default config
