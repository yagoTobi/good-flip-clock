import { useTheme } from "../../contexts/ThemeContext";
import SpectrumColorPicker from "../SpectrumColorPicker/SpectrumColorPicker";
import "./ColorSelector.css";

/**
 * ColorSelector - Interface for customizing clock text and background colors
 *
 * This component provides color customization options for the clock display,
 * allowing users to modify both the text color and card background color.
 * It integrates with the theme system to provide real-time color updates
 * and uses ColorPicker components for user-friendly color selection.
 *
 * Features:
 * - Text color customization for clock digits
 * - Card background color customization for flip cards
 * - Real-time preview of color changes
 * - Integration with ThemeContext for state persistence
 *
 * Theme Integration:
 * - clockColor: Controls the color of time digits and text
 * - panelColor: Controls the background color of flip cards
 * - Changes are immediately applied and persisted via theme context
 *
 * @returns {JSX.Element} Color selection interface with color pickers
 */
const ColorSelector = () => {
  const { clockColor, setClockColor, panelColor, setPanelColor } = useTheme();

  return (
    <div className="color-selector">
      <h3>Clock Colors</h3>
      <p className="color-description">
        Customize the colors of your clock display
      </p>

      <SpectrumColorPicker
        value={clockColor}
        onChange={setClockColor}
        label="Text Color"
      />

      <SpectrumColorPicker
        value={panelColor}
        onChange={setPanelColor}
        label="Card Background"
      />
    </div>
  );
};

export default ColorSelector;
