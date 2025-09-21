import "./SpectrumColorPicker.css";

/**
 * Convert HSL color to hex format
 * @param {string} hsl - HSL color string like "hsl(120, 100%, 50%)"
 * @returns {string} Hex color string like "#00ff00"
 */
const hslToHex = (hsl) => {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hsl;

  const [, h, s, l] = match.map(Number);
  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Convert hex color to HSL format for comparison
 * @param {string} hex - Hex color string like "#ff0000"
 * @returns {string} HSL color string like "hsl(0, 100%, 50%)"
 */
const hexToHsl = (hex) => {
  if (!hex || !hex.startsWith("#")) return hex;

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
};

/**
 * Generate a curated spectrum of colors in a proper grid format
 * Creates a balanced 7x6 grid (7 columns, 6 rows) for better organization
 */
const generateColorSpectrum = () => {
  const colors = [];

  // Row 1 - Grayscale (8 columns for rectangular grid)
  const grayscaleRow = [
    "hsl(0, 0%, 0%)", // Black
    "hsl(0, 0%, 14%)", // Very dark gray
    "hsl(0, 0%, 29%)", // Dark gray
    "hsl(0, 0%, 43%)", // Medium dark gray
    "hsl(0, 0%, 57%)", // Medium light gray
    "hsl(0, 0%, 71%)", // Light gray
    "hsl(0, 0%, 86%)", // Very light gray
    "hsl(0, 0%, 100%)", // White
  ];
  colors.push(grayscaleRow);

  // Main color hues - 8 key colors for perfect rectangular grid
  const hues = [0, 30, 60, 90, 150, 210, 270, 330]; // Red, Orange, Yellow, Yellow-Green, Green-Cyan, Blue, Purple, Pink

  // Row 2 - Bright colors
  const brightRow = hues.map((hue) => `hsl(${hue}, 100%, 60%)`);
  colors.push(brightRow);

  // Row 3 - Medium colors
  const mediumRow = hues.map((hue) => `hsl(${hue}, 80%, 45%)`);
  colors.push(mediumRow);

  // Row 4 - Dark colors
  const darkRow = hues.map((hue) => `hsl(${hue}, 70%, 30%)`);
  colors.push(darkRow);

  return colors;
};

/**
 * SpectrumColorPicker - Always-visible grid-based color picker
 *
 * This component provides a visual color picker with a grid of colors
 * arranged by hue (horizontal) and lightness (vertical). The grid is
 * always visible for immediate color selection.
 *
 * Features:
 * - Always visible grid layout with grayscale and color spectrum
 * - Square color swatches with smooth hover effects
 * - HSL-based color generation for smooth transitions
 * - Immediate color application
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current selected color value
 * @param {Function} props.onChange - Callback when color is selected
 * @param {string} props.label - Label for the color picker
 * @returns {JSX.Element} Spectrum color picker grid
 */
const SpectrumColorPicker = ({ value, onChange, label = "Color" }) => {
  const colorSpectrum = generateColorSpectrum();

  /**
   * Handle color selection from the spectrum
   * @param {string} color - HSL color string
   */
  const handleColorSelect = (color) => {
    // Convert HSL to hex for theme context compatibility
    const hexColor = hslToHex(color);
    onChange(hexColor);
  };

  /**
   * Find the closest HSL color to the current hex value for selection highlighting
   */
  const getCurrentHslColor = () => {
    if (!value || !value.startsWith("#")) return null;

    // Convert current hex value to HSL for comparison

    // Find the closest color in our spectrum
    for (const row of colorSpectrum) {
      for (const color of row) {
        if (hslToHex(color) === value) {
          return color;
        }
      }
    }

    return null;
  };

  const selectedHslColor = getCurrentHslColor();

  return (
    <div className="spectrum-color-picker">
      <div className="spectrum-header">
        <h4>{label}</h4>
      </div>

      <div className="spectrum-grid-container">
        <div className="spectrum-grid">
          {colorSpectrum.map((row, rowIndex) => (
            <div key={rowIndex} className="spectrum-row">
              {row.map((color, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`spectrum-color ${
                    selectedHslColor === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpectrumColorPicker;
