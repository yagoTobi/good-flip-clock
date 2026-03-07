/**
 * Image Optimization Utilities
 *
 * This module provides utilities for optimizing image loading performance
 * in the flip clock application, particularly for background image selection.
 */

/**
 * Create a low-quality placeholder for faster initial loading
 * @param {string} imagePath - Original image path
 * @returns {string} CSS for low-quality placeholder
 */
export const createImagePlaceholder = (imagePath) => {
  // Create a blurred, low-quality version using CSS filters
  return {
    backgroundImage: `url(${imagePath})`,
    backgroundSize: "20%", // Much smaller initial load
    filter: "blur(5px)",
    opacity: 0.3,
  };
};

/**
 * Preload images in batches to improve performance
 * @param {Array} imagePaths - Array of image paths to preload
 * @param {number} batchSize - Number of images to load simultaneously
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadImages = async (imagePaths, batchSize = 4) => {
  const batches = [];
  for (let i = 0; i < imagePaths.length; i += batchSize) {
    batches.push(imagePaths.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map((path) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Don't fail the whole batch if one image fails
          img.src = path;
        });
      })
    );
  }
};

/**
 * Check if device is likely to have performance constraints
 * @returns {boolean} True if device appears to be low-end
 */
export const isLowEndDevice = () => {
  // Check various indicators of device performance
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const slowConnection =
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g");
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  const lowCores =
    navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

  return slowConnection || lowMemory || lowCores;
};

/**
 * Get optimized image loading strategy based on device capabilities
 * @returns {Object} Loading strategy configuration
 */
export const getImageLoadingStrategy = () => {
  const isLowEnd = isLowEndDevice();

  return {
    batchSize: isLowEnd ? 2 : 4,
    useIntersectionObserver: true,
    usePlaceholders: isLowEnd,
    preloadDelay: isLowEnd ? 500 : 100,
  };
};

/**
 * Create optimized background image CSS
 * @param {string} imagePath - Image path
 * @param {boolean} isLoaded - Whether image is fully loaded
 * @returns {Object} CSS properties for optimized background
 */
export const getOptimizedBackgroundCSS = (imagePath, isLoaded = false) => {
  const baseCSS = {
    backgroundImage: `url(${imagePath})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  if (!isLoaded) {
    return {
      ...baseCSS,
      backgroundSize: "50%", // Smaller initial size
      filter: "blur(2px)",
      opacity: 0.6,
      transition: "all 0.3s ease",
    };
  }

  return {
    ...baseCSS,
    filter: "none",
    opacity: 1,
    transition: "all 0.3s ease",
  };
};
