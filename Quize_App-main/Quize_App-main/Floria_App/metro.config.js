const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,      // <- dit is nodig voor Tailwind CSS
});

module.exports = config;

