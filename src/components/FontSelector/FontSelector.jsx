import { useTheme } from "../../contexts/ThemeContext";
import { getAllFontOptions } from "../../utils/fontUtils";
import "./FontSelector.css";

const FontSelector = () => {
  const { font, setFont } = useTheme();
  const fontOptions = getAllFontOptions();

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
