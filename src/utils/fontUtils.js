// Font utility functions for theme customization

export const FONT_OPTIONS = {
  default: {
    id: "default",
    name: "Impact",
    value: "'Impact', 'Arial Black', Arial, sans-serif",
    sample: "12:34",
  },
  roboto: {
    id: "roboto",
    name: "Roboto",
    value: "'Roboto', sans-serif",
    sample: "12:34",
  },
  orbitron: {
    id: "orbitron",
    name: "Orbitron",
    value: "'Orbitron', monospace",
    sample: "12:34",
  },
  "digital-7": {
    id: "digital-7",
    name: "Digital",
    value: "'Courier New', 'Lucida Console', monospace",
    sample: "88:88",
  },
  oswald: {
    id: "oswald",
    name: "Oswald",
    value: "'Oswald', sans-serif",
    sample: "12:34",
  },
  "bebas-neue": {
    id: "bebas-neue",
    name: "Bebas Neue",
    value: "'Bebas Neue', sans-serif",
    sample: "12:34",
  },
  anton: {
    id: "anton",
    name: "Anton",
    value: "'Anton', sans-serif",
    sample: "12:34",
  },
};

/**
 * Get font CSS value by font ID
 * @param {string} fontId - The font identifier
 * @returns {string} CSS font-family value
 */
export const getFontValue = (fontId) => {
  const fontOption = FONT_OPTIONS[fontId];
  return fontOption ? fontOption.value : FONT_OPTIONS.default.value;
};

/**
 * Apply font styling to the document root
 * @param {string} fontId - The font identifier to apply
 */
export const applyFontToDocument = (fontId) => {
  const fontValue = getFontValue(fontId);
  document.documentElement.style.setProperty("--clock-font-family", fontValue);
};

/**
 * Get all available font options as an array
 * @returns {Array} Array of font option objects
 */
export const getAllFontOptions = () => {
  return Object.values(FONT_OPTIONS);
};
