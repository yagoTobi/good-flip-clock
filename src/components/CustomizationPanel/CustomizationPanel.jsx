import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import BackgroundSelector from "../BackgroundSelector/BackgroundSelector";
import FontSelector from "../FontSelector/FontSelector";
import ColorSelector from "../ColorSelector/ColorSelector";
import ClockPreview from "../ClockPreview/ClockPreview";
import "./CustomizationPanel.css";

/**
 * CustomizationPanel - Modal panel for customizing clock appearance and themes
 *
 * This component provides a comprehensive interface for users to customize their clock
 * appearance including backgrounds, fonts, and colors. It features a tabbed interface
 * with live preview functionality and integrates with the theme system to persist
 * user preferences.
 *
 * Features:
 * - Tabbed interface for organizing customization options
 * - Live preview of changes before applying
 * - Integration with ThemeContext for state management
 * - Modal overlay with proper accessibility
 * - Responsive layout with options and preview sections
 *
 * Theme System Integration:
 * - All changes are immediately reflected in the theme context
 * - Changes persist across sessions via localStorage
 * - Preview component shows real-time updates
 *
 * Tabs:
 * - Background: Background colors, gradients, and images
 * - Fonts: Font family selection with live samples
 * - Colors: Clock text and card background colors
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the customization panel is visible
 * @param {Function} props.onClose - Callback function to close the panel
 * @returns {JSX.Element|null} Customization panel modal, or null if not open
 */
const CustomizationPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("background");

  if (!isOpen) return null;

  return (
    <div className="customization-overlay">
      <div className="customization-panel">
        <div className="panel-header">
          <h2>Customize Your Clock</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close customization panel"
          >
            <FaTimes />
          </button>
        </div>

        <div className="panel-tabs">
          <button
            className={`tab-button ${
              activeTab === "background" ? "active" : ""
            }`}
            onClick={() => setActiveTab("background")}
          >
            Background
          </button>
          <button
            className={`tab-button ${activeTab === "fonts" ? "active" : ""}`}
            onClick={() => setActiveTab("fonts")}
          >
            Fonts
          </button>
          <button
            className={`tab-button ${activeTab === "colors" ? "active" : ""}`}
            onClick={() => setActiveTab("colors")}
          >
            Colors
          </button>
        </div>

        <div className="panel-content">
          <div className="content-layout">
            <div className="options-section">
              {activeTab === "background" && (
                <div className="tab-content">
                  <BackgroundSelector />
                </div>
              )}
              {activeTab === "fonts" && (
                <div className="tab-content">
                  <FontSelector />
                </div>
              )}
              {activeTab === "colors" && (
                <div className="tab-content">
                  <ColorSelector />
                </div>
              )}
            </div>
            <div className="preview-section">
              <ClockPreview />
            </div>
          </div>
        </div>

        <div className="panel-actions">
          <div className="panel-signature">Made with care 🇪🇸 - Yago Tobio</div>
          <button className="action-button secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
