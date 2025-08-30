import { createContext, useState, useEffect, useContext } from "react";
import { useFont } from "../hooks/useFont";

export const ThemeContext = createContext();

const DEFAULT_THEME = {
  background: "default",
  font: "default",
  clockColor: "#000000",
  panelColor: "#ffffff",
};

export const ThemeProvider = ({ children }) => {
  const [background, setBackground] = useState(DEFAULT_THEME.background);
  const [font, setFont] = useState(DEFAULT_THEME.font);
  const [clockColor, setClockColor] = useState(DEFAULT_THEME.clockColor);
  const [panelColor, setPanelColor] = useState(DEFAULT_THEME.panelColor);

  // Apply font styling when font changes
  useFont(font);

  // Load saved settings on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("clockThemeSettings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setBackground(settings.background || DEFAULT_THEME.background);
        setFont(settings.font || DEFAULT_THEME.font);
        setClockColor(settings.clockColor || DEFAULT_THEME.clockColor);
        setPanelColor(settings.panelColor || DEFAULT_THEME.panelColor);
      }
    } catch (error) {
      console.warn("Failed to load theme settings from localStorage:", error);
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    try {
      const settings = {
        background,
        font,
        clockColor,
        panelColor,
      };
      localStorage.setItem("clockThemeSettings", JSON.stringify(settings));
    } catch (error) {
      console.warn("Failed to save theme settings to localStorage:", error);
    }
  }, [background, font, clockColor, panelColor]);

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

// Custom hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
