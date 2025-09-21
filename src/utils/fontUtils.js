/**
 * Font utility functions for theme customization and typography management
 *
 * This module provides font management utilities including font option definitions,
 * font application to the document, and font selection helpers. Used by the theme
 * system to allow users to customize the clock display typography.
 */

/**
 * Available font options for clock display customization
 *
 * Each font option includes:
 * - id: Unique identifier for the font
 * - name: Display name shown in the UI
 * - value: CSS font-family value with fallbacks
 * - sample: Sample text to preview the font
 *
 * Fonts are ordered from bold/impactful to more refined styles.
 * All fonts include appropriate fallbacks for cross-platform compatibility.
 */
export const FONT_OPTIONS = {
  /** Default bold font with strong visual impact */
  default: {
    id: "default",
    name: "Impact",
    value: "'Impact', 'Arial Black', Arial, sans-serif",
    sample: "12:34",
  },
  /** Modern, clean sans-serif font */
  roboto: {
    id: "roboto",
    name: "Roboto",
    value: "'Roboto', sans-serif",
    sample: "12:34",
  },
  /** Futuristic, sci-fi style monospace font */
  orbitron: {
    id: "orbitron",
    name: "Orbitron",
    value: "'Orbitron', monospace",
    sample: "12:34",
  },
  /** Digital/LCD display style font */
  "digital-7": {
    id: "digital-7",
    name: "Digital",
    value: "'Courier New', 'Lucida Console', monospace",
    sample: "88:88",
  },
  /** Condensed, tall sans-serif font */
  oswald: {
    id: "oswald",
    name: "Oswald",
    value: "'Oswald', sans-serif",
    sample: "12:34",
  },
  /** Ultra-condensed, bold display font */
  "bebas-neue": {
    id: "bebas-neue",
    name: "Bebas Neue",
    value: "'Bebas Neue', sans-serif",
    sample: "12:34",
  },
  /** Condensed, bold sans-serif font */
  anton: {
    id: "anton",
    name: "Anton",
    value: "'Anton', sans-serif",
    sample: "12:34",
  },
};

/**
 * Get CSS font-family value by font identifier
 *
 * Retrieves the CSS font-family string for a given font ID. Falls back to
 * the default font if the requested font ID is not found.
 *
 * @param {string} fontId - The font identifier (must match a key in FONT_OPTIONS)
 * @returns {string} CSS font-family value with fallbacks
 *
 * @example
 * getFontValue("roboto") // returns "'Roboto', sans-serif"
 * getFontValue("invalid") // returns "'Impact', 'Arial Black', Arial, sans-serif"
 */
export const getFontValue = (fontId) => {
  const fontOption = FONT_OPTIONS[fontId];
  return fontOption ? fontOption.value : FONT_OPTIONS.default.value;
};

/**
 * Apply font styling to the document root via CSS custom property
 *
 * Sets the --clock-font-family CSS custom property on the document root,
 * which is used by clock components to apply the selected font. This approach
 * allows for dynamic font changes without component re-renders.
 *
 * @param {string} fontId - The font identifier to apply (from FONT_OPTIONS)
 *
 * @example
 * applyFontToDocument("roboto") // Sets --clock-font-family to Roboto
 * applyFontToDocument("digital-7") // Sets --clock-font-family to digital style
 */
export const applyFontToDocument = (fontId) => {
  const fontValue = getFontValue(fontId);
  document.documentElement.style.setProperty("--clock-font-family", fontValue);
};

/**
 * Get all available font options as an array
 *
 * Returns all font options from FONT_OPTIONS as an array, useful for
 * rendering font selection UI components like dropdowns or lists.
 *
 * @returns {Array<Object>} Array of font option objects, each containing
 *   id, name, value, and sample properties
 *
 * @example
 * const fonts = getAllFontOptions();
 * fonts.forEach(font => console.log(font.name)); // "Impact", "Roboto", etc.
 */
export const getAllFontOptions = () => {
  return Object.values(FONT_OPTIONS);
};
