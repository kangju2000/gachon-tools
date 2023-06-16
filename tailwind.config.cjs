module.exports = {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      boxShadow: {
        'modal-lg': '0px 54px 90px -40px rgba(251, 132, 132, 0.25)',
        'modal-sm': '0px 14px 44px rgba(199, 190, 226, 0.5)',
      },
      gridTemplateColumns: {
        'auto-1fr': 'auto 1fr',
      },
    },
  },
  plugins: [],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
