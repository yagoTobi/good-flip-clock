import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import BackgroundSelector from "../BackgroundSelector/BackgroundSelector";
import FontSelector from "../FontSelector/FontSelector";
import ColorSelector from "../ColorSelector/ColorSelector";
import ClockPreview from "../ClockPreview/ClockPreview";
import "./CustomizationPanel.css";

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
          <button className="action-button secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
