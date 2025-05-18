module.exports = {
  content: [
    "./templates/*.liquid",
    "./layout/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./src/**/*.{liquid,js,ts,jsx,tsx}"
  ],
  // prefix: "tw-",
  theme: {
    extend: {
      colors: {
        black: '#1A1A1A',
        white: '#fff'
      },
      fontWeight: {},
      fontSize: {
        14: "0.875rem",
        16: "1rem",
        18: "1.125rem",
        20: "1.25rem",
        24: "1.5rem",
        32: "2rem"
      },
      fontFamily: {
        main: ['Roboto', 'sans-serif'],
        heading: ['Segoe UI', 'sans-serif'],
      },
      screens: {
        mt: "768px",
        ml: "1024px",
        md: "1440px",
        mdh: "1600px"
      },
      maxWidth: {
        'container': '1512px'
      }
    },
  }
}
