import { useTheme } from "../../contexts/ThemeContext";
import { getAllFontOptions } from "../../utils/fontUtils";
import "./FontSelector.css";

/**
 * FontSelector - Interface for selecting clock display fonts
 *
 * This component provides a visual font selection interface where users can
 * choose from available font options. Each font option displays both the
 * font name and a sample of the font rendering, allowing users to preview
 * how the font will look before selection.
 *
 * Features:
 * - Visual font preview with font name and sample text
 * - Integration with font utility functions for available options
 * - Real-time font application through theme system
 * - Selected state indication for current font
 *
 * Font System Integration:
 * - Uses getAllFontOptions() to retrieve available fonts
 * - Integrates with ThemeContext for font state management
 * - Supports both web fonts and system fonts
 * - Font changes are immediately applied and persisted
 *
 * @returns {JSX.Element} Font selection interface with preview options
 */
const FontSelector = () => {
  const { font, setFont } = useTheme();
  const fontOptions = getAllFontOptions();

  /**
   * Handle font selection and update theme context
   * @param {Object} fontOption - Selected font option object
   * @param {string} fontOption.id - Font identifier for theme system
   */
  const handleFontSelect = (fontOption) => {
    setFont(fontOption.id);
  };

  return (
    <div className="font-selector">
      <h3>Font</h3>
      <div className="font-options">
        {fontOptions.map((fontOption) => (
          <button
            key={fontOption.id}
            className={`font-option ${
              font === fontOption.id ? "selected" : ""
            }`}
            onClick={() => handleFontSelect(fontOption)}
            style={{ fontFamily: fontOption.value }}
          >
            <span className="font-name">{fontOption.name}</span>
            <span className="font-sample">{fontOption.sample}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;
