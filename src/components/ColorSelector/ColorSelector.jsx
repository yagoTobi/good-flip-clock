import { useTheme } from "../../contexts/ThemeContext";
import ColorPicker from "../ColorPicker/ColorPicker";
import "./ColorSelector.css";

const ColorSelector = () => {
  const { clockColor, setClockColor, panelColor, setPanelColor } = useTheme();

  return (
    <div className="color-selector">
      <h3>Clock Colors</h3>
      <p className="color-description">
        Customize the colors of your clock display
      </p>

      <ColorPicker
        value={clockColor}
        onChange={setClockColor}
        label="Text Color"
      />

      <ColorPicker
        value={panelColor}
        onChange={setPanelColor}
        label="Card Background"
      />
    </div>
  );
};

export default ColorSelector;
