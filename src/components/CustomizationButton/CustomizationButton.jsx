import { FaPaintBrush } from "react-icons/fa";
import "./CustomizationButton.css";

const CustomizationButton = ({ onClick }) => {
  return (
    <button
      className="icon-button customization-button"
      onClick={onClick}
      aria-label="Customize appearance"
      title="Customize appearance"
    >
      <FaPaintBrush />
    </button>
  );
};

export default CustomizationButton;
