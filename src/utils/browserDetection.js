/**
 * Browser Detection and Mobile Compatibility Utilities
 */

/**
 * Apply essential browser fixes
 */
export function applyBrowserFixes() {
  // iOS Safari viewport height fix
  const isIOS =
    /iPhone|iPad|iPod/.test(navigator.userAgent) &&
    /Safari/.test(navigator.userAgent) &&
    /Apple Computer/.test(navigator.vendor);

  if (isIOS) {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", () => {
      setTimeout(setVH, 100);
    });
  }
}

/**
 * Log browser compatibility information (dev only)
 */
export function logCompatibilityInfo() {
  if (process.env.NODE_ENV !== "development") return;
  console.log("Browser:", navigator.userAgent);
}

/**
 * Check for known compatibility issues (dev only)
 */
export function checkCompatibilityIssues() {
  return [];
}
