// Utility functions for color manipulation and analysis

/**
 * Determines if a background color/gradient/image is dark or light
 * @param {string} background - The background value (color, gradient, or image)
 * @returns {boolean} - true if dark, false if light
 */
export const isDarkBackground = (background) => {
  // Default background is dark
  if (background === "default") {
    return true;
  }

  // Handle solid colors
  if (background.startsWith("#")) {
    return isColorDark(background);
  }

  // Handle gradients - check the first color
  if (background.startsWith("linear-gradient")) {
    const colorMatch = background.match(/#[0-9a-fA-F]{6}/);
    if (colorMatch) {
      return isColorDark(colorMatch[0]);
    }
    // If no hex color found, assume dark
    return true;
  }

  // Handle images - assume dark for better contrast
  if (background.startsWith("url(")) {
    return true;
  }

  // Default to dark for unknown values
  return true;
};

/**
 * Determines if a hex color is dark or light
 * @param {string} hexColor - Hex color string (e.g., "#ffffff")
 * @returns {boolean} - true if dark, false if light
 */
const isColorDark = (hexColor) => {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance using the relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if dark (luminance < 0.5)
  return luminance < 0.5;
};

/**
 * Gets the appropriate panel background color based on the main background
 * @param {string} background - The main background value
 * @returns {string} - "#ffffff" for dark backgrounds, "#1a1a1a" for light backgrounds
 */
export const getContrastingPanelColor = (background) => {
  return isDarkBackground(background) ? "#ffffff" : "#1a1a1a";
};
