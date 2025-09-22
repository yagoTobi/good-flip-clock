/**
 * Performance utilities for mobile optimization
 */

/**
 * Detects if the device is likely a mobile device
 */
export const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (window.innerWidth <= 768 && "ontouchstart" in window)
  );
};

/**
 * Detects if the device has limited processing power
 */
export const isLowEndDevice = () => {
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 1;

  // Check for device memory (if available)
  const memory = navigator.deviceMemory || 1;

  // Check for connection type (if available)
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const slowConnection =
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g");

  return cores <= 2 || memory <= 2 || slowConnection;
};

/**
 * Monitors battery status and applies performance optimizations
 */
export const initBatteryOptimization = () => {
  if ("getBattery" in navigator) {
    navigator
      .getBattery()
      .then((battery) => {
        const updateBatteryStatus = () => {
          const isLowBattery = battery.level < 0.2 && !battery.charging;
          document.body.classList.toggle("battery-low", isLowBattery);
        };

        // Initial check
        updateBatteryStatus();

        // Listen for battery changes
        battery.addEventListener("levelchange", updateBatteryStatus);
        battery.addEventListener("chargingchange", updateBatteryStatus);
      })
      .catch(() => {
        // Battery API not supported, ignore
      });
  }
};

/**
 * Applies performance optimizations based on device capabilities
 */
export const applyPerformanceOptimizations = () => {
  const body = document.body;

  // Add mobile device class
  if (isMobileDevice()) {
    body.classList.add("mobile-device");
  }

  // Add low-end device class
  if (isLowEndDevice()) {
    body.classList.add("low-end-device");
  }

  // Check for reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    body.classList.add("reduced-motion");
  }

  // Initialize battery optimization
  initBatteryOptimization();
};

/**
 * Optimizes will-change properties for better performance
 */
export const optimizeWillChange = () => {
  // Remove will-change from elements that are not currently animating
  const elementsWithWillChange = document.querySelectorAll(
    '[style*="will-change"]'
  );

  elementsWithWillChange.forEach((element) => {
    // Check if element is currently animating
    const isAnimating =
      element.getAnimations && element.getAnimations().length > 0;

    if (!isAnimating) {
      element.style.willChange = "auto";
    }
  });
};

/**
 * Throttles function calls for better performance
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Debounces function calls for better performance
 */
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
