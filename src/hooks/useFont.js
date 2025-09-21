import { useEffect } from "react";
import { applyFontToDocument } from "../utils/fontUtils";

/**
 * Custom hook for applying font styling to the document
 *
 * Automatically applies the specified font to the document when the fontId changes.
 * Uses the fontUtils helper to handle font loading and CSS application. The font
 * styling is applied globally to the document, affecting all text elements that
 * inherit font properties.
 *
 * @param {string} fontId - The font identifier to apply (e.g., 'default', 'roboto', 'opensans')
 *
 * @example
 * // Apply font in a component
 * const MyComponent = ({ selectedFont }) => {
 *   useFont(selectedFont); // Automatically applies font when selectedFont changes
 *   return <div>Text will use the applied font</div>;
 * };
 *
 * @example
 * // Used within ThemeContext to apply theme font
 * const ThemeProvider = ({ children }) => {
 *   const [font, setFont] = useState('default');
 *   useFont(font); // Apply font whenever theme font changes
 *   // ...
 * };
 */
export const useFont = (fontId) => {
  useEffect(() => {
    // Apply font styling to document whenever fontId changes
    // This effect runs on mount and whenever fontId prop changes
    applyFontToDocument(fontId);
  }, [fontId]); // Dependency array ensures effect runs when fontId changes
};
