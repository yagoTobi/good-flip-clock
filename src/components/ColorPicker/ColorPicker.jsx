import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./ColorPicker.css";

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

const ColorPicker = ({ value, onChange, label }) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(value || "#2563eb");

  const handlePresetSelect = (color) => {
    onChange(color);
    setCustomColor(color);
  };

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
