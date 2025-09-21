import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./ColorPicker.css";

/**
 * Preset color palette for quick color selection
 *
 * This array contains carefully selected colors that work well for clock displays,
 * including vibrant colors, neutral tones, and high-contrast options for accessibility.
 */
const PRESET_COLORS = [
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
  "#4f46e5",
  "#9333ea",
  "#ec4899",
  "#0d9488",
  "#0891b2",
  "#1e3a8a",
  "#166534",
  "#7c2d12",
  "#6b21a8",
  "#0a0a0a",
  "#f5f5f5",
];

/**
 * ColorPicker - Color selection component with presets and custom color input
 *
 * This component provides a user-friendly color selection interface with both
 * preset color swatches and a custom color picker. It's designed for selecting
 * colors for clock text and card backgrounds with visual feedback.
 *
 * Features:
 * - Preset color swatches for quick selection
 * - Custom color picker with hex input
 * - Visual selection indicators
 * - Real-time color preview
 * - Accessible color value display
 *
 * Interaction Flow:
 * 1. User can click preset color swatches for immediate selection
 * 2. Plus button reveals custom color picker
 * 3. Custom color picker allows precise color selection
 * 4. Selected color is immediately applied via onChange callback
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current selected color value (hex format)
 * @param {Function} props.onChange - Callback function when color changes
 * @param {string} props.label - Label text for the color picker section
 * @returns {JSX.Element} Color picker interface with presets and custom input
 */
const ColorPicker = ({ value, onChange, label }) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(value || "#2563eb");

  /**
   * Handle preset color selection
   * @param {string} color - Hex color value from preset
   */
  const handlePresetSelect = (color) => {
    onChange(color);
    setCustomColor(color);
  };

  /**
   * Handle custom color input changes
   * @param {Event} e - Input change event from color picker
   */
  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="color-picker">
      <h4>{label}</h4>

      <div className="preset-colors">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            className={`color-swatch ${value === color ? "selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handlePresetSelect(color)}
            title={color}
          />
        ))}

        <button
          className={`color-swatch custom-trigger ${
            showCustom ? "active" : ""
          }`}
          onClick={() => setShowCustom(!showCustom)}
          title="Custom color"
        >
          <FaPlus />
        </button>
      </div>

      {showCustom && (
        <div className="custom-color-section">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="color-input"
          />
          <span className="color-value">{customColor}</span>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
