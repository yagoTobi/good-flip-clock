/**
 * Browser Detection and Mobile Compatibility Utilities
 * Helps identify browser-specific issues and apply appropriate fixes
 */

/**
 * Detect the current browser and version
 * @returns {Object} Browser information
 */
export function detectBrowser() {
  const userAgent = navigator.userAgent;
  const vendor = navigator.vendor;

  // Safari detection (including iOS Safari)
  if (/Safari/.test(userAgent) && /Apple Computer/.test(vendor)) {
    const isMobile = /iPhone|iPad|iPod/.test(userAgent);
    const version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1];
    return {
      name: "safari",
      isMobile,
      version,
      isIOS: isMobile,
      supportsBackdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
      supportsGrid: CSS.supports("display", "grid"),
    };
  }

  // Chrome detection (including Android Chrome)
  if (/Chrome/.test(userAgent) && /Google Inc/.test(vendor)) {
    const isMobile = /Android|Mobile/.test(userAgent);
    const version = userAgent.match(/Chrome\/(\d+)/)?.[1];
    return {
      name: "chrome",
      isMobile,
      version: parseInt(version),
      isAndroid: /Android/.test(userAgent),
      supportsBackdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
      supportsGrid: CSS.supports("display", "grid"),
    };
  }

  // Firefox detection (including Firefox Mobile)
  if (/Firefox/.test(userAgent)) {
    const isMobile = /Mobile|Tablet/.test(userAgent);
    const version = userAgent.match(/Firefox\/(\d+)/)?.[1];
    return {
      name: "firefox",
      isMobile,
      version: parseInt(version),
      isAndroid: /Android/.test(userAgent),
      supportsBackdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
      supportsGrid: CSS.supports("display", "grid"),
    };
  }

  // Edge detection
  if (/Edg/.test(userAgent)) {
    const isMobile = /Mobile/.test(userAgent);
    const version = userAgent.match(/Edg\/(\d+)/)?.[1];
    return {
      name: "edge",
      isMobile,
      version: parseInt(version),
      supportsBackdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
      supportsGrid: CSS.supports("display", "grid"),
    };
  }

  // Samsung Internet detection
  if (/SamsungBrowser/.test(userAgent)) {
    const version = userAgent.match(/SamsungBrowser\/(\d+)/)?.[1];
    return {
      name: "samsung",
      isMobile: true,
      version: parseInt(version),
      isAndroid: true,
      supportsBackdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
      supportsGrid: CSS.supports("display", "grid"),
    };
  }

  return {
    name: "unknown",
    isMobile: /Mobile|Tablet|Android|iPhone|iPad/.test(userAgent),
    version: null,
    supportsBackdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
    supportsGrid: CSS.supports("display", "grid"),
  };
}

/**
 * Detect device capabilities and limitations
 * @returns {Object} Device capability information
 */
export function detectDeviceCapabilities() {
  const browser = detectBrowser();

  return {
    // Touch capabilities
    hasTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,

    // Screen information
    screenSize: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      pixelRatio: window.devicePixelRatio || 1,
    },

    // Viewport information
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.screen.orientation?.type || "unknown",
    },

    // Performance indicators
    performance: {
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      memory: navigator.deviceMemory || "unknown",
      connection: navigator.connection?.effectiveType || "unknown",
    },

    // Browser capabilities
    browser,

    // Feature support
    features: {
      flexbox: CSS.supports("display", "flex"),
      grid: CSS.supports("display", "grid"),
      backdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
      customProperties: CSS.supports("--custom", "property"),
      transforms3d: CSS.supports("transform", "translateZ(0px)"),
      animations: CSS.supports("animation", "name 1s ease"),
      transitions: CSS.supports("transition", "all 1s ease"),
      willChange: CSS.supports("will-change", "transform"),
      containment: CSS.supports("contain", "layout"),
      intersectionObserver: "IntersectionObserver" in window,
      resizeObserver: "ResizeObserver" in window,
    },
  };
}

/**
 * Apply browser-specific fixes and optimizations
 */
export function applyBrowserFixes() {
  const browser = detectBrowser();
  const capabilities = detectDeviceCapabilities();

  // Add browser-specific classes to document
  document.documentElement.classList.add(`browser-${browser.name}`);

  if (browser.isMobile) {
    document.documentElement.classList.add("mobile-browser");
  }

  if (browser.isIOS) {
    document.documentElement.classList.add("ios-browser");
  }

  if (browser.isAndroid) {
    document.documentElement.classList.add("android-browser");
  }

  // Apply performance optimizations for low-end devices
  if (
    capabilities.performance.hardwareConcurrency <= 2 ||
    capabilities.performance.memory <= 2
  ) {
    document.documentElement.classList.add("low-performance");
  }

  // Apply high DPI optimizations
  if (capabilities.screenSize.pixelRatio >= 2) {
    document.documentElement.classList.add("high-dpi");
  }

  // iOS Safari specific fixes
  if (browser.isIOS) {
    // Fix viewport height issues
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", () => {
      setTimeout(setVH, 100); // Delay to ensure orientation change is complete
    });
  }

  // Chrome mobile specific fixes
  if (browser.name === "chrome" && browser.isMobile) {
    // Handle address bar height changes
    const setDVH = () => {
      if (CSS.supports("height", "100dvh")) {
        document.documentElement.style.setProperty("--app-height", "100dvh");
      } else {
        document.documentElement.style.setProperty("--app-height", "100vh");
      }
    };

    setDVH();
    window.addEventListener("resize", setDVH);
  }

  // Firefox mobile specific fixes
  if (browser.name === "firefox" && browser.isMobile) {
    // Fix flexbox issues
    document.documentElement.classList.add("firefox-mobile-flex-fix");
  }

  return {
    browser,
    capabilities,
    fixesApplied: true,
  };
}

/**
 * Test touch interaction capabilities
 * @returns {Object} Touch test results
 */
export function testTouchCapabilities() {
  const results = {
    touchSupport: "ontouchstart" in window,
    multiTouch: navigator.maxTouchPoints > 1,
    touchEvents: [],
    gestureSupport: false,
  };

  // Test basic touch events
  const testElement = document.createElement("div");
  testElement.style.cssText = `
    position: fixed;
    top: -100px;
    left: -100px;
    width: 50px;
    height: 50px;
    opacity: 0;
    pointer-events: none;
  `;

  document.body.appendChild(testElement);

  const touchEvents = ["touchstart", "touchmove", "touchend", "touchcancel"];
  touchEvents.forEach((eventType) => {
    try {
      testElement.addEventListener(eventType, () => {
        results.touchEvents.push(eventType);
      });
    } catch (e) {
      // Event not supported
    }
  });

  // Test gesture support
  try {
    testElement.addEventListener("gesturestart", () => {
      results.gestureSupport = true;
    });
  } catch (e) {
    // Gesture events not supported
  }

  document.body.removeChild(testElement);

  return results;
}

/**
 * Log browser compatibility information for debugging
 */
export function logCompatibilityInfo() {
  const browser = detectBrowser();
  const capabilities = detectDeviceCapabilities();
  const touchTest = testTouchCapabilities();

  console.group("🔍 Browser Compatibility Information");
  console.log("Browser:", browser);
  console.log("Device Capabilities:", capabilities);
  console.log("Touch Test Results:", touchTest);
  console.groupEnd();

  return {
    browser,
    capabilities,
    touchTest,
  };
}

/**
 * Check for known compatibility issues
 * @returns {Array} Array of detected issues
 */
export function checkCompatibilityIssues() {
  const browser = detectBrowser();
  const capabilities = detectDeviceCapabilities();
  const issues = [];

  // iOS Safari issues
  if (browser.isIOS) {
    if (!capabilities.features.backdropFilter) {
      issues.push({
        type: "warning",
        browser: "iOS Safari",
        issue: "Backdrop filter not supported",
        impact: "Blur effects may not work",
        workaround: "Fallback to solid backgrounds applied",
      });
    }

    if (capabilities.viewport.height < 500) {
      issues.push({
        type: "info",
        browser: "iOS Safari",
        issue: "Small viewport height detected",
        impact: "Layout may be cramped",
        workaround: "Responsive layout adjustments applied",
      });
    }
  }

  // Android Chrome issues
  if (browser.isAndroid && browser.name === "chrome") {
    if (
      capabilities.performance.memory &&
      capabilities.performance.memory <= 2
    ) {
      issues.push({
        type: "warning",
        browser: "Android Chrome",
        issue: "Low device memory detected",
        impact: "Animations may be reduced",
        workaround: "Performance optimizations applied",
      });
    }
  }

  // Firefox mobile issues
  if (browser.name === "firefox" && browser.isMobile) {
    if (!capabilities.features.grid) {
      issues.push({
        type: "warning",
        browser: "Firefox Mobile",
        issue: "CSS Grid not fully supported",
        impact: "Layout may use flexbox fallback",
        workaround: "Flexbox fallback layout applied",
      });
    }
  }

  // General mobile issues
  if (browser.isMobile) {
    if (!capabilities.hasTouch) {
      issues.push({
        type: "warning",
        browser: "Mobile Browser",
        issue: "Touch events not detected",
        impact: "Touch interactions may not work properly",
        workaround: "Mouse event fallbacks available",
      });
    }

    if (capabilities.screenSize.pixelRatio < 2) {
      issues.push({
        type: "info",
        browser: "Mobile Browser",
        issue: "Low pixel density display",
        impact: "Text and graphics may appear less sharp",
        workaround: "Standard resolution assets used",
      });
    }
  }

  return issues;
}
