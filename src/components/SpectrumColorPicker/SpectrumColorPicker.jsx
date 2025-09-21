import "./SpectrumColorPicker.css";

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
    onChange(color);
  };

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
                    value === color ? "selected" : ""
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
