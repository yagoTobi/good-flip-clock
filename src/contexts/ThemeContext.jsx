import { createContext, useState, useEffect, useContext } from "react";
import { useFont } from "../hooks/useFont";
import { applyFontToDocument } from "../utils/fontUtils";
import { isLightColor } from "../utils/colorUtils";

export const ThemeContext = createContext();

const DEFAULT_THEME = {
  background: 'url("/images/backgrounds/image8.webp") center/cover',
  font: "default",
  clockColor: "#ffffff",
  panelColor: "#1a3d2e",
  showQuote: false,
};

/**
 * Validate that a background value loaded from storage is a safe, known format.
 * Prevents a tampered localStorage entry from loading an external resource.
 */
const isValidBackground = (bg) => {
  if (!bg || bg === "default") return true;
  if (bg.startsWith("#")) return true;
  if (bg.startsWith("hsl(")) return true;
  if (bg.startsWith("linear-gradient(")) return true;
  if (/^url\(\"\/images\/[^"]+\"\)( center\/cover)?$/.test(bg)) return true;
  return false;
};

/**
 * Read a single key from the persisted theme settings.
 * Called synchronously inside useState initializers so the very first render
 * already has the correct values — no flash of wrong state.
 */
const readSaved = (key, fallback) => {
  try {
    const raw = localStorage.getItem("clockThemeSettings");
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings[key] === undefined) return fallback;
      if (key === "background" && !isValidBackground(settings[key])) return fallback;
      return settings[key];
    }
  } catch {
    // localStorage unavailable or corrupt — use fallback
  }
  return fallback;
};

export const ThemeProvider = ({ children }) => {
  const [background, setBackground] = useState(() => {
    const bg = readSaved("background", DEFAULT_THEME.background);
    // Apply light/dark class synchronously so the first render already has it
    const isLight = isLightColor(bg);
    document.documentElement.classList.toggle("light-bg", isLight);
    document.documentElement.classList.toggle("dark-bg", !isLight);
    return bg;
  });

  const [font, setFont] = useState(() => {
    const savedFont = readSaved("font", DEFAULT_THEME.font);
    // Apply font synchronously to avoid a flash of the wrong typeface
    applyFontToDocument(savedFont);
    return savedFont;
  });

  const [clockColor, setClockColor] = useState(() =>
    readSaved("clockColor", DEFAULT_THEME.clockColor)
  );

  const [panelColor, setPanelColor] = useState(() =>
    readSaved("panelColor", DEFAULT_THEME.panelColor)
  );

  const [showQuote, setShowQuote] = useState(() =>
    readSaved("showQuote", DEFAULT_THEME.showQuote)
  );

  // Keep font updated whenever it changes after init
  useFont(font);

  // Keep light/dark class updated whenever background changes after init
  useEffect(() => {
    const isLight = isLightColor(background);
    document.documentElement.classList.toggle("light-bg", isLight);
    document.documentElement.classList.toggle("dark-bg", !isLight);
  }, [background]);

  // Persist any change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "clockThemeSettings",
        JSON.stringify({ background, font, clockColor, panelColor, showQuote })
      );
    } catch (error) {
      console.warn("Failed to save theme settings:", error);
    }
  }, [background, font, clockColor, panelColor, showQuote]);

  const resetToDefaults = () => {
    setBackground(DEFAULT_THEME.background);
    setFont(DEFAULT_THEME.font);
    setClockColor(DEFAULT_THEME.clockColor);
    setPanelColor(DEFAULT_THEME.panelColor);
    setShowQuote(DEFAULT_THEME.showQuote);
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
        showQuote,
        setShowQuote,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
