/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                regular: "'Nunito Sans', sans-serif",
                mono: "'Inconsolata', monospace",
                hand: "'Itim', cursive"
            },
            maxWidth: {
                frame: '1280px'
            }
        },
    },
    plugins: [],
    darkMode: ['class', '.dark']
}