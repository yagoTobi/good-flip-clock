import { FaMugHot } from "react-icons/fa";
import "./CoffeeButton.css";

/**
 * CoffeeButton - Buy me a coffee support button
 *
 * A subtle, floating button in the top-right corner that allows users
 * to support the developer. Adapts to light/dark backgrounds for
 * optimal visibility and accessibility.
 *
 * Features:
 * - Adaptive styling based on background theme
 * - Smooth hover animations
 * - Coffee cup icon with subtle animations
 * - Opens in new tab to preserve user's session
 *
 * @returns {JSX.Element} Coffee support button
 */
const CoffeeButton = () => {
  const handleCoffeeClick = () => {
    window.open(
      "https://buymeacoffee.com/yagotobi",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      className="coffee-button"
      onClick={handleCoffeeClick}
      title="Buy me a coffee ☕"
      aria-label="Support the developer - Buy me a coffee"
    >
      <FaMugHot size={20} className="coffee-icon" aria-hidden="true" />
      <span className="coffee-text">Buy me a coffee</span>
    </button>
  );
};

export default CoffeeButton;
