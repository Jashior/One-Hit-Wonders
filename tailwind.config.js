module.exports = {
  content: ["./src/**/*.{html,ts}"],
  purge: {
    enabled: process.env.TAILWIND_MODE === "build",
    content: ["./src/**/*.{html,scss,ts}"],
  },
  darkMode: "media", // or 'media' or 'class'
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        bg: "#EDEAEA",
        bgc: "#D4D4D4",
        ctext: "#23272A",
        "bg-dark": "#111313",
        "bgc-dark": "#1D1F20",
        "ctext-dark": "#dde0e2",
        primBlue: "#177DDC",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
