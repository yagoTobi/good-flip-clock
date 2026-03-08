/**
 * Color utility functions for theme management and color analysis
 */

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string (e.g., "#ff0000")
 * @returns {Object} RGB values {r, g, b}
 */
export const hexToRgb = (hex) => {
  if (!hex || !hex.startsWith("#")) return { r: 0, g: 0, b: 0 };

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Convert HSL color to RGB values
 * @param {string} hsl - HSL color string (e.g., "hsl(120, 100%, 50%)")
 * @returns {Object} RGB values {r, g, b}
 */
export const hslToRgb = (hsl) => {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return { r: 0, g: 0, b: 0 };

  const [, h, s, l] = match.map(Number);
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (sDecimal === 0) {
    r = g = b = lDecimal; // achromatic
  } else {
    const q =
      lDecimal < 0.5
        ? lDecimal * (1 + sDecimal)
        : lDecimal + sDecimal - lDecimal * sDecimal;
    const p = 2 * lDecimal - q;
    r = hue2rgb(p, q, hDecimal + 1 / 3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * Calculate the relative luminance of a color
 * @param {Object} rgb - RGB color object {r, g, b}
 * @returns {number} Relative luminance (0-1)
 */
export const getLuminance = (rgb) => {
  const { r, g, b } = rgb;

  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

/**
 * Determine if a background color is light or dark
 * @param {string} color - Color string (hex, hsl, or css value)
 * @returns {boolean} True if the color is light, false if dark
 */
export const isLightColor = (color) => {
  if (!color) return false;

  let rgb;

  // Handle special "default" background
  if (color === "default") {
    // Default background is #1a1a1a (dark)
    rgb = hexToRgb("#1a1a1a");
  }
  // Handle hex colors
  else if (color.startsWith("#")) {
    rgb = hexToRgb(color);
  }
  // Handle HSL colors
  else if (color.startsWith("hsl(")) {
    rgb = hslToRgb(color);
  }
  // Handle gradients - use the first color
  else if (color.includes("linear-gradient")) {
    const colorMatch = color.match(/#[a-f\d]{6}|hsl\(\d+,\s*\d+%,\s*\d+%\)/i);
    if (colorMatch) {
      return isLightColor(colorMatch[0]);
    }
    return false; // Default to dark for gradients
  }
  // Handle image backgrounds — default dark, except known light images
  else if (color.includes("url(")) {
    const LIGHT_IMAGES = ["image12"];
    return LIGHT_IMAGES.some((name) => color.includes(name));
  }
  // Handle named colors or other formats
  else {
    return false; // Default to dark for unknown formats
  }

  const luminance = getLuminance(rgb);
  return luminance > 0.5; // Threshold for light vs dark
};

/**
 * Get appropriate text color (black or white) for a given background
 * @param {string} backgroundColor - Background color string
 * @returns {string} Either "#000000" or "#ffffff"
 */
export const getContrastTextColor = (backgroundColor) => {
  return isLightColor(backgroundColor) ? "#000000" : "#ffffff";
};
