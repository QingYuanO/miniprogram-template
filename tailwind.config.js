const {
  defaultPreset,
  createPreset,
} = require("tailwindcss-miniprogram-preset");
module.exports = {
  important: false,
  purge: defaultPreset.purge.content,
  presets: [defaultPreset],
  content: ["**/*.wxml"],
  theme: {
    extend: {},
  },
  plugins: [],
};
