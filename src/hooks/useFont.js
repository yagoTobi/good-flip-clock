import { useEffect } from "react";
import { applyFontToDocument } from "../utils/fontUtils";

/**
 * Custom hook to apply font styling to the document
 * @param {string} fontId - The font identifier to apply
 */
export const useFont = (fontId) => {
  useEffect(() => {
    applyFontToDocument(fontId);
  }, [fontId]);
};
