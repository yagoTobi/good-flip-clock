/**
 * Touch Interaction Testing Utilities
 * Validates touch functionality across different mobile browsers
 */

/**
 * Test touch event handling on a specific element
 * @param {HTMLElement} element - Element to test
 * @returns {Promise<Object>} Test results
 */
export function testTouchEvents(element) {
  return new Promise((resolve) => {
    const results = {
      touchstart: false,
      touchmove: false,
      touchend: false,
      touchcancel: false,
      gesturestart: false,
      gesturechange: false,
      gestureend: false,
      pointerEvents: false,
      timing: {},
    };

    let startTime;
    let endTime;

    // Test touch events
    const touchStartHandler = (e) => {
      results.touchstart = true;
      startTime = performance.now();
    };

    const touchMoveHandler = (e) => {
      results.touchmove = true;
    };

    const touchEndHandler = (e) => {
      results.touchend = true;
      endTime = performance.now();
      results.timing.touchDuration = endTime - startTime;
    };

    const touchCancelHandler = (e) => {
      results.touchcancel = true;
    };

    // Test gesture events (iOS Safari)
    const gestureStartHandler = (e) => {
      results.gesturestart = true;
    };

    const gestureChangeHandler = (e) => {
      results.gesturechange = true;
    };

    const gestureEndHandler = (e) => {
      results.gestureend = true;
    };

    // Test pointer events
    const pointerDownHandler = (e) => {
      if (e.pointerType === "touch") {
        results.pointerEvents = true;
      }
    };

    // Add event listeners
    element.addEventListener("touchstart", touchStartHandler, {
      passive: true,
    });
    element.addEventListener("touchmove", touchMoveHandler, { passive: true });
    element.addEventListener("touchend", touchEndHandler, { passive: true });
    element.addEventListener("touchcancel", touchCancelHandler, {
      passive: true,
    });
    element.addEventListener("gesturestart", gestureStartHandler, {
      passive: true,
    });
    element.addEventListener("gesturechange", gestureChangeHandler, {
      passive: true,
    });
    element.addEventListener("gestureend", gestureEndHandler, {
      passive: true,
    });
    element.addEventListener("pointerdown", pointerDownHandler, {
      passive: true,
    });

    // Simulate touch events programmatically
    setTimeout(() => {
      try {
        // Create touch event
        const touchEvent = new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          touches: [
            {
              identifier: 0,
              target: element,
              clientX: 50,
              clientY: 50,
              pageX: 50,
              pageY: 50,
              screenX: 50,
              screenY: 50,
            },
          ],
        });

        element.dispatchEvent(touchEvent);

        // Create touch end event
        setTimeout(() => {
          const touchEndEvent = new TouchEvent("touchend", {
            bubbles: true,
            cancelable: true,
            changedTouches: [
              {
                identifier: 0,
                target: element,
                clientX: 50,
                clientY: 50,
                pageX: 50,
                pageY: 50,
                screenX: 50,
                screenY: 50,
              },
            ],
          });

          element.dispatchEvent(touchEndEvent);

          // Clean up event listeners
          setTimeout(() => {
            element.removeEventListener("touchstart", touchStartHandler);
            element.removeEventListener("touchmove", touchMoveHandler);
            element.removeEventListener("touchend", touchEndHandler);
            element.removeEventListener("touchcancel", touchCancelHandler);
            element.removeEventListener("gesturestart", gestureStartHandler);
            element.removeEventListener("gesturechange", gestureChangeHandler);
            element.removeEventListener("gestureend", gestureEndHandler);
            element.removeEventListener("pointerdown", pointerDownHandler);

            resolve(results);
          }, 100);
        }, 50);
      } catch (error) {
        console.warn("Touch event simulation failed:", error);
        resolve(results);
      }
    }, 100);
  });
}

/**
 * Test touch target accessibility
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Accessibility test results
 */
export function testTouchTargetAccessibility(element) {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);

  const results = {
    width: rect.width,
    height: rect.height,
    minWidth: parseFloat(computedStyle.minWidth) || rect.width,
    minHeight: parseFloat(computedStyle.minHeight) || rect.height,
    meetsMinimumSize: rect.width >= 44 && rect.height >= 44,
    hasAdequateSpacing: true, // Will be calculated based on siblings
    isAccessible: false,
  };

  // Check spacing between touch targets
  const siblings = Array.from(element.parentElement?.children || []).filter(
    (child) => child !== element && child.offsetParent !== null
  );

  let minSpacing = Infinity;
  siblings.forEach((sibling) => {
    const siblingRect = sibling.getBoundingClientRect();
    const horizontalDistance = Math.abs(rect.left - siblingRect.right);
    const verticalDistance = Math.abs(rect.top - siblingRect.bottom);
    const distance = Math.min(horizontalDistance, verticalDistance);

    if (distance < minSpacing) {
      minSpacing = distance;
    }
  });

  results.hasAdequateSpacing = minSpacing >= 8 || minSpacing === Infinity;
  results.minSpacing = minSpacing === Infinity ? "N/A" : minSpacing;
  results.isAccessible = results.meetsMinimumSize && results.hasAdequateSpacing;

  return results;
}

/**
 * Test animation performance during touch interactions
 * @param {HTMLElement} element - Element to test
 * @returns {Promise<Object>} Performance test results
 */
export function testTouchAnimationPerformance(element) {
  return new Promise((resolve) => {
    const results = {
      frameRate: 0,
      droppedFrames: 0,
      averageFrameTime: 0,
      maxFrameTime: 0,
      performanceRating: "unknown",
    };

    let frameCount = 0;
    let totalFrameTime = 0;
    let maxFrameTime = 0;
    let lastFrameTime = performance.now();
    let animationId;

    const measureFrame = () => {
      const currentTime = performance.now();
      const frameTime = currentTime - lastFrameTime;

      frameCount++;
      totalFrameTime += frameTime;

      if (frameTime > maxFrameTime) {
        maxFrameTime = frameTime;
      }

      // Count dropped frames (assuming 60fps target)
      if (frameTime > 16.67 * 2) {
        results.droppedFrames++;
      }

      lastFrameTime = currentTime;

      if (frameCount < 60) {
        // Test for 1 second at 60fps
        animationId = requestAnimationFrame(measureFrame);
      } else {
        // Calculate results
        results.frameRate = 1000 / (totalFrameTime / frameCount);
        results.averageFrameTime = totalFrameTime / frameCount;
        results.maxFrameTime = maxFrameTime;

        // Determine performance rating
        if (results.frameRate >= 55) {
          results.performanceRating = "excellent";
        } else if (results.frameRate >= 45) {
          results.performanceRating = "good";
        } else if (results.frameRate >= 30) {
          results.performanceRating = "fair";
        } else {
          results.performanceRating = "poor";
        }

        resolve(results);
      }
    };

    // Start animation test
    element.style.transform = "translateX(0px)";
    element.style.transition = "transform 1s ease";

    // Trigger animation
    setTimeout(() => {
      element.style.transform = "translateX(100px)";
      animationId = requestAnimationFrame(measureFrame);
    }, 16);

    // Cleanup after test
    setTimeout(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      element.style.transform = "";
      element.style.transition = "";

      if (frameCount === 0) {
        resolve(results);
      }
    }, 2000);
  });
}

/**
 * Comprehensive touch compatibility test suite
 * @returns {Promise<Object>} Complete test results
 */
export async function runTouchCompatibilityTests() {
  console.group("🧪 Running Touch Compatibility Tests");

  const results = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    touchSupport: "ontouchstart" in window,
    maxTouchPoints: navigator.maxTouchPoints,
    tests: {},
  };

  // Create test elements
  const testContainer = document.createElement("div");
  testContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: rgba(0, 0, 255, 0.3);
    border-radius: 8px;
    z-index: 10000;
    pointer-events: auto;
  `;

  document.body.appendChild(testContainer);

  try {
    // Test touch events
    console.log("Testing touch events...");
    results.tests.touchEvents = await testTouchEvents(testContainer);

    // Test touch target accessibility
    console.log("Testing touch target accessibility...");
    results.tests.accessibility = testTouchTargetAccessibility(testContainer);

    // Test animation performance
    console.log("Testing animation performance...");
    results.tests.performance = await testTouchAnimationPerformance(
      testContainer
    );

    console.log("Touch compatibility test results:", results);
  } catch (error) {
    console.error("Touch compatibility test failed:", error);
    results.error = error.message;
  } finally {
    // Clean up test elements
    document.body.removeChild(testContainer);
  }

  console.groupEnd();
  return results;
}

/**
 * Test specific browser touch quirks
 * @returns {Object} Browser-specific test results
 */
export function testBrowserTouchQuirks() {
  const results = {
    iosSafariQuirks: {},
    androidChromeQuirks: {},
    firefoxMobileQuirks: {},
    generalQuirks: {},
  };

  // Test iOS Safari specific issues
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Test for iOS Safari touch delay
    results.iosSafariQuirks.hasTouchDelay = !document.querySelector(
      'meta[name="viewport"][content*="user-scalable=no"]'
    );

    // Test for iOS Safari scroll bounce
    results.iosSafariQuirks.hasScrollBounce = !CSS.supports(
      "overscroll-behavior",
      "none"
    );

    // Test for iOS Safari viewport height issues
    results.iosSafariQuirks.hasViewportIssues =
      window.innerHeight !== window.screen.height;
  }

  // Test Android Chrome specific issues
  if (
    /Android/.test(navigator.userAgent) &&
    /Chrome/.test(navigator.userAgent)
  ) {
    // Test for address bar height changes
    results.androidChromeQuirks.hasAddressBarIssues = true; // Always present on Android Chrome

    // Test for touch event passive listener support
    results.androidChromeQuirks.supportsPassiveListeners = (() => {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, "passive", {
          get: function () {
            supportsPassive = true;
          },
        });
        window.addEventListener("test", null, opts);
        window.removeEventListener("test", null, opts);
      } catch (e) {}
      return supportsPassive;
    })();
  }

  // Test Firefox Mobile specific issues
  if (
    /Firefox/.test(navigator.userAgent) &&
    /Mobile/.test(navigator.userAgent)
  ) {
    // Test for Firefox Mobile flexbox issues
    results.firefoxMobileQuirks.hasFlexboxIssues = !CSS.supports(
      "display",
      "flex"
    );

    // Test for Firefox Mobile animation performance
    results.firefoxMobileQuirks.hasAnimationIssues = !CSS.supports(
      "will-change",
      "transform"
    );
  }

  // Test general mobile browser issues
  results.generalQuirks.supportsTouch = "ontouchstart" in window;
  results.generalQuirks.supportsPointerEvents = "onpointerdown" in window;
  results.generalQuirks.supportsGestures = "ongesturestart" in window;
  results.generalQuirks.devicePixelRatio = window.devicePixelRatio || 1;

  return results;
}
