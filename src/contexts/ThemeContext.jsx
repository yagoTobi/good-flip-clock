import { createContext, useState, useEffect, useContext } from "react";
import { useFont } from "../hooks/useFont";
import { isLightColor } from "../utils/colorUtils";

/**
 * React Context for managing global theme state
 *
 * Provides theme settings including background, font, and color preferences
 * that persist across browser sessions using localStorage. The context manages
 * both the state and the persistence logic for all theme-related settings.
 */
export const ThemeContext = createContext();

/**
 * Default theme configuration
 * Used as fallback when no saved settings exist or when resetting to defaults
 */
const DEFAULT_THEME = {
  background: "default",
  font: "default",
  clockColor: "#000000",
  panelColor: "#ffffff",
};

/**
 * ThemeProvider component - Context provider for theme state management
 *
 * Manages global theme state including background, font, and color settings.
 * Automatically persists changes to localStorage and applies font styling
 * through the useFont hook. Provides both state values and setter functions
 * to child components through React Context.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to theme context
 *
 * @example
 * // Wrap your app with ThemeProvider
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <MyAppContent />
 *     </ThemeProvider>
 *   );
 * }
 */
export const ThemeProvider = ({ children }) => {
  // Theme state - initialized with default values
  const [background, setBackground] = useState(DEFAULT_THEME.background);
  const [font, setFont] = useState(DEFAULT_THEME.font);
  const [clockColor, setClockColor] = useState(DEFAULT_THEME.clockColor);
  const [panelColor, setPanelColor] = useState(DEFAULT_THEME.panelColor);

  // Apply font styling automatically when font changes
  // This ensures the selected font is applied globally to the document
  useFont(font);

  // Apply background-based styling to document root
  useEffect(() => {
    const isLight = isLightColor(background);
    document.documentElement.classList.toggle("light-bg", isLight);
    document.documentElement.classList.toggle("dark-bg", !isLight);
  }, [background]);

  // Load saved theme settings from localStorage on component mount
  // This effect runs once when the ThemeProvider is first rendered
  // It restores user preferences from previous sessions for a seamless experience
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("clockThemeSettings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        // Use saved values or fall back to defaults if properties are missing
        // This defensive approach handles cases where saved settings are incomplete
        setBackground(settings.background || DEFAULT_THEME.background);
        setFont(settings.font || DEFAULT_THEME.font);
        setClockColor(settings.clockColor || DEFAULT_THEME.clockColor);
        setPanelColor(settings.panelColor || DEFAULT_THEME.panelColor);
      }
      // If no saved settings exist, the component will use the default values
      // that were set during state initialization
    } catch (error) {
      // Handle JSON parsing errors or localStorage access issues gracefully
      // This could happen if localStorage is disabled, corrupted, or quota exceeded
      console.warn("Failed to load theme settings from localStorage:", error);
      // Continue with default values - app remains functional even if persistence fails
    }
  }, []); // Empty dependency array - only run on mount to avoid infinite loops

  // Save theme settings to localStorage whenever any setting changes
  // This ensures user preferences persist across browser sessions automatically
  // The effect runs after every theme change, providing real-time persistence
  useEffect(() => {
    try {
      const settings = {
        background,
        font,
        clockColor,
        panelColor,
      };
      // Store as JSON string for easy serialization/deserialization
      localStorage.setItem("clockThemeSettings", JSON.stringify(settings));
    } catch (error) {
      // Handle localStorage write errors gracefully
      // Common causes: storage quota exceeded, private browsing mode, or disabled localStorage
      console.warn("Failed to save theme settings to localStorage:", error);
      // App continues to function normally, just without persistence
    }
  }, [background, font, clockColor, panelColor]); // Re-run when any setting changes

  /**
   * Reset all theme settings to their default values
   * Useful for providing a "reset to defaults" functionality in the UI
   */
  const resetToDefaults = () => {
    setBackground(DEFAULT_THEME.background);
    setFont(DEFAULT_THEME.font);
    setClockColor(DEFAULT_THEME.clockColor);
    setPanelColor(DEFAULT_THEME.panelColor);
  };

  return (
    <ThemeContext.Provider
      value={{
        background,
        setBackground,
        font,
        setFont,
        clockColor,
        setClockColor,
        panelColor,
        setPanelColor,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook for consuming theme context
 *
 * Provides access to theme state and setter functions from any component
 * within the ThemeProvider tree. Includes error handling to ensure the
 * hook is used correctly within the provider context.
 *
 * @returns {Object} Theme context value
 * @returns {string} returns.background - Current background theme identifier
 * @returns {Function} returns.setBackground - Function to update background theme
 * @returns {string} returns.font - Current font theme identifier
 * @returns {Function} returns.setFont - Function to update font theme
 * @returns {string} returns.clockColor - Current clock color (hex string)
 * @returns {Function} returns.setClockColor - Function to update clock color
 * @returns {string} returns.panelColor - Current panel color (hex string)
 * @returns {Function} returns.setPanelColor - Function to update panel color
 * @returns {Function} returns.resetToDefaults - Function to reset all settings to defaults
 *
 * @throws {Error} Throws error if used outside of ThemeProvider
 *
 * @example
 * // Use theme in a component
 * const MyComponent = () => {
 *   const {
 *     background, setBackground,
 *     clockColor, setClockColor,
 *     resetToDefaults
 *   } = useTheme();
 *
 *   return (
 *     <div>
 *       <button onClick={() => setBackground('dark')}>
 *         Set Dark Background
 *       </button>
 *       <button onClick={resetToDefaults}>
 *         Reset to Defaults
 *       </button>
 *     </div>
 *   );
 * };
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
