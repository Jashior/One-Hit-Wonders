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
        bg: "#A3A3A3",
        bgc: "#D4D4D4",
        ctext: "23272A",
        "bg-dark": "#171717",
        "bgc-dark": "#262626",
        "ctext-dark": "DEE2E7",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
