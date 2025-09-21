/**
 * Color utility functions for theme customization and contrast analysis
 *
 * This module provides utilities for determining color brightness, calculating
 * appropriate contrast colors, and analyzing background types (colors, gradients, images).
 * Used primarily by the theme system to ensure proper text contrast and UI visibility.
 */

/**
 * Determines if a background color/gradient/image is dark or light
 *
 * This function analyzes different background types to determine their brightness,
 * which is used to select appropriate text colors and UI elements for contrast.
 *
 * @param {string} background - The background value (color, gradient, or image URL)
 * @returns {boolean} true if the background is dark, false if light
 *
 * @example
 * isDarkBackground("#000000") // returns true
 * isDarkBackground("#ffffff") // returns false
 * isDarkBackground("linear-gradient(45deg, #000000, #333333)") // returns true
 * isDarkBackground("url('/path/to/image.jpg')") // returns true (assumes dark)
 */
export const isDarkBackground = (background) => {
  // Default background is considered dark for better text contrast
  if (background === "default") {
    return true;
  }

  // Handle solid hex colors by analyzing their luminance
  if (background.startsWith("#")) {
    return isColorDark(background);
  }

  // Handle CSS gradients by analyzing the first color found
  if (background.startsWith("linear-gradient")) {
    const colorMatch = background.match(/#[0-9a-fA-F]{6}/);
    if (colorMatch) {
      return isColorDark(colorMatch[0]);
    }
    // If no hex color found in gradient, assume dark for safety
    return true;
  }

  // Handle background images - assume dark for better text contrast
  if (background.startsWith("url(")) {
    return true;
  }

  // Default to dark for unknown background values
  return true;
};

/**
 * Determines if a hex color is dark or light using relative luminance calculation
 *
 * Uses the standard relative luminance formula to determine color brightness.
 * This is more accurate than simple RGB averaging as it accounts for human
 * perception of different color channels.
 *
 * @param {string} hexColor - Hex color string (e.g., "#ffffff", "#000000")
 * @returns {boolean} true if the color is dark (luminance < 0.5), false if light
 *
 * @example
 * isColorDark("#000000") // returns true (black)
 * isColorDark("#ffffff") // returns false (white)
 * isColorDark("#808080") // returns true (medium gray)
 */
const isColorDark = (hexColor) => {
  // Remove # prefix if present
  const hex = hexColor.replace("#", "");

  // Convert hex to RGB values (0-255)
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance using ITU-R BT.709 coefficients
  // These weights account for human eye sensitivity to different colors
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if dark (luminance below 50% threshold)
  return luminance < 0.5;
};

/**
 * Gets the appropriate panel background color based on the main background
 *
 * Provides high contrast panel colors to ensure UI elements remain visible
 * and accessible regardless of the main background. Used for customization
 * panels, modals, and other overlay elements.
 *
 * @param {string} background - The main background value (color, gradient, or image)
 * @returns {string} "#ffffff" for dark backgrounds, "#1a1a1a" for light backgrounds
 *
 * @example
 * getContrastingPanelColor("#000000") // returns "#ffffff" (white panel on dark bg)
 * getContrastingPanelColor("#ffffff") // returns "#1a1a1a" (dark panel on light bg)
 * getContrastingPanelColor("url('/dark-image.jpg')") // returns "#ffffff"
 */
export const getContrastingPanelColor = (background) => {
  return isDarkBackground(background) ? "#ffffff" : "#1a1a1a";
};
