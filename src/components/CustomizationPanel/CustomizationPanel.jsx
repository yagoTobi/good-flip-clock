import { useState, useEffect } from "react";
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

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      // Focus the first tab when panel opens
      const firstTab = document.querySelector(".tab-button");
      if (firstTab) {
        firstTab.focus();
      }

      // Trap focus within the modal
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }

        if (e.key === "Tab") {
          const focusableElements = document.querySelectorAll(
            '.customization-panel button, .customization-panel input, .customization-panel select, .customization-panel [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: "background", label: "Background" },
    { id: "fonts", label: "Fonts" },
    { id: "colors", label: "Colors" },
  ];

  return (
    <div
      className="customization-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customization-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="customization-panel">
        <div
          className="panel-tabs"
          role="tablist"
          aria-label="Customization options"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                switch (e.key) {
                  case "ArrowLeft":
                    e.preventDefault();
                    const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
                    setActiveTab(tabs[prevIndex].id);
                    break;
                  case "ArrowRight":
                    e.preventDefault();
                    const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
                    setActiveTab(tabs[nextIndex].id);
                    break;
                  case "Home":
                    e.preventDefault();
                    setActiveTab(tabs[0].id);
                    break;
                  case "End":
                    e.preventDefault();
                    setActiveTab(tabs[tabs.length - 1].id);
                    break;
                }
              }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {tab.label}
            </button>
          ))}
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close customization panel"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div className="panel-content">
          <div className="content-layout">
            <div className="options-section">
              {activeTab === "background" && (
                <div
                  className="tab-content"
                  role="tabpanel"
                  id="background-panel"
                  aria-labelledby="background-tab"
                >
                  <BackgroundSelector />
                </div>
              )}
              {activeTab === "fonts" && (
                <div
                  className="tab-content"
                  role="tabpanel"
                  id="fonts-panel"
                  aria-labelledby="fonts-tab"
                >
                  <FontSelector />
                </div>
              )}
              {activeTab === "colors" && (
                <div
                  className="tab-content"
                  role="tabpanel"
                  id="colors-panel"
                  aria-labelledby="colors-tab"
                >
                  <ColorSelector />
                </div>
              )}
            </div>
            <div
              className="preview-section"
              role="region"
              aria-label="Live preview of customization changes"
            >
              <ClockPreview />
            </div>
          </div>
        </div>

        <div className="panel-actions">
          <div className="panel-signature">Made with care 🇪🇸 - Yago Tobio</div>
          <button
            className="action-button secondary"
            onClick={onClose}
            aria-label="Close customization panel and apply changes"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
