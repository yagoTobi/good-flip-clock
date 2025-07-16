import { useState, useEffect } from "react";
import "./TimeInput.css";

function TimeInput({ label, value, maxValue, onChange }) {
  const [inputValue, setInputValue] = useState(
    value.toString().padStart(2, "0")
  );

  useEffect(() => {
    setInputValue(value.toString().padStart(2, "0"));
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;

    // Only allow numeric input
    if (!/^\d*$/.test(newValue)) return;

    // Limit to 2 digits
    if (newValue.length > 2) return;

    // Convert to number and validate against max value
    const numValue = parseInt(newValue) || 0;

    // If the value exceeds max, don't update
    if (numValue > maxValue) return;

    // Update both display and actual value
    setInputValue(newValue);
    onChange(numValue);
  };

  const handleBlur = () => {
    // Ensure proper formatting on blur
    setInputValue(value.toString().padStart(2, "0"));
  };

  const handleFocus = (e) => {
    // Select all text on focus for easy editing
    e.target.select();
  };

  return (
    <div className="time-input">
      <label className="time-input-label">{label}</label>
      <input
        type="text"
        className="time-input-field"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        maxLength={2}
        placeholder="00"
      />
    </div>
  );
}

export default TimeInput;
