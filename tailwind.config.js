const pxToRem = (px, base = 16) => `${(px / base).toFixed(4)}rem`

const spacing = Array.from({ length: 1024 }, (_, i) => i + 1).reduce((acc, px) => {
  acc[`${px}px`] = pxToRem(px)
  return acc
}, {})

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: spacing,
      borderWidth: spacing,
      borderRadius: spacing,
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    prefix: 'd-',
  },
}