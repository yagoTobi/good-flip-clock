import { useState, useEffect } from "react";
import "./TimeInput.css";

function TimeInput({ label, value, maxValue, onChange }) {
  const [inputValue, setInputValue] = useState(
    value.toString().padStart(2, "0")
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isProgressiveTyping, setIsProgressiveTyping] = useState(false);

  useEffect(() => {
    if (!isTyping) {
      setInputValue(value.toString().padStart(2, "0"));
    }
  }, [value, isTyping]);

  const handleKeyDown = (e) => {
    // Handle numeric input with progressive typing
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      setIsTyping(true);

      const digit = e.key;

      if (inputValue === "00" || inputValue.length === 0) {
        // First digit: show as "0X"
        setIsProgressiveTyping(true);
        const newValue = "0" + digit;
        setInputValue(newValue);
        const numValue = parseInt(newValue);
        if (numValue <= maxValue) {
          onChange(numValue);
        }
      } else if (
        inputValue.length === 2 &&
        inputValue.startsWith("0") &&
        isProgressiveTyping
      ) {
        // Second digit in progressive typing: replace "0X" with "XY"
        const newValue = inputValue[1] + digit;
        const numValue = parseInt(newValue);
        if (numValue <= maxValue) {
          setInputValue(newValue.padStart(2, "0"));
          onChange(numValue);
        }
        setIsProgressiveTyping(false); // Done with progressive typing
      } else if (inputValue.length === 2 && isProgressiveTyping) {
        // Third digit in progressive typing - ignore it
        return;
      } else if (inputValue.length === 2 && !isProgressiveTyping) {
        // Clicking on existing non-zero value - start fresh
        setIsProgressiveTyping(true);
        const newValue = "0" + digit;
        setInputValue(newValue);
        const numValue = parseInt(newValue);
        if (numValue <= maxValue) {
          onChange(numValue);
        }
      } else {
        // Start fresh with new digit
        setIsProgressiveTyping(true);
        const newValue = "0" + digit;
        setInputValue(newValue);
        const numValue = parseInt(newValue);
        if (numValue <= maxValue) {
          onChange(numValue);
        }
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setIsTyping(true);

      if (inputValue.length === 2) {
        // Remove last digit, go back to "0X" format
        const newValue = "0" + inputValue[0];
        setInputValue(newValue);
        onChange(parseInt(newValue));
      } else {
        // Reset to 00
        setInputValue("00");
        onChange(0);
      }
    } else if (e.key === "Enter" || e.key === "Tab") {
      // Finish typing
      setIsTyping(false);
    }
  };

  const handleFocus = (e) => {
    // Select all text on focus for easy editing
    e.target.select();
    setIsTyping(false);
    setIsProgressiveTyping(false); // Reset progressive typing state
  };

  const handleBlur = () => {
    // Ensure proper formatting on blur and stop typing mode
    setIsTyping(false);
    setIsProgressiveTyping(false); // Reset progressive typing state
    setInputValue(value.toString().padStart(2, "0"));
  };

  const handleClick = () => {
    // Reset to typing mode when clicked
    setIsTyping(true);
    setIsProgressiveTyping(false); // Reset progressive typing state
  };

  const inputId = `time-input-${label.toLowerCase()}`;

  return (
    <div className="time-input">
      <label className="time-input-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        className="time-input-field"
        value={inputValue}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        readOnly
        placeholder="00"
        aria-label={`${label} (0 to ${maxValue})`}
        aria-describedby={`${inputId}-help`}
        role="spinbutton"
        aria-valuemin="0"
        aria-valuemax={maxValue}
        aria-valuenow={value}
      />
      <div id={`${inputId}-help`} className="sr-only">
        Use number keys to set {label.toLowerCase()}. Range: 0 to {maxValue}.
      </div>
    </div>
  );
}

export default TimeInput;
