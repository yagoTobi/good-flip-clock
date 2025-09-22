/**
 * Mobile Compatibility Test Suite
 * Comprehensive testing for cross-browser mobile compatibility
 */

import {
  detectBrowser,
  detectDeviceCapabilities,
  checkCompatibilityIssues,
} from "./browserDetection.js";
import {
  runTouchCompatibilityTests,
  testBrowserTouchQuirks,
} from "./touchTestUtils.js";

/**
 * Test responsive layout behavior
 * @returns {Object} Layout test results
 */
function testResponsiveLayout() {
  const results = {
    breakpoints: {},
    layoutElements: {},
    orientationSupport: {},
  };

  // Test breakpoint behavior
  const breakpoints = [
    { name: "mobile", width: 375 },
    { name: "mobile-large", width: 414 },
    { name: "tablet", width: 768 },
    { name: "desktop", width: 1024 },
  ];

  breakpoints.forEach((bp) => {
    // Temporarily resize viewport (simulation)
    const originalWidth = window.innerWidth;

    results.breakpoints[bp.name] = {
      targetWidth: bp.width,
      actualWidth: window.innerWidth,
      mediaQueryMatches: window.matchMedia(`(min-width: ${bp.width}px)`)
        .matches,
    };
  });

  // Test key layout elements
  const elementsToTest = [
    ".app-main",
    ".clock-container",
    ".timer-controls",
    ".mode-selector-container",
    ".customization-panel",
  ];

  elementsToTest.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);

      results.layoutElements[selector] = {
        width: rect.width,
        height: rect.height,
        display: computedStyle.display,
        flexDirection: computedStyle.flexDirection,
        position: computedStyle.position,
        overflow: computedStyle.overflow,
        isVisible: rect.width > 0 && rect.height > 0,
      };
    }
  });

  // Test orientation support
  results.orientationSupport = {
    supportsOrientationAPI: "orientation" in screen,
    currentOrientation: screen.orientation?.type || "unknown",
    supportsOrientationChange: "onorientationchange" in window,
    supportsMatchMedia: "matchMedia" in window,
    portraitQuery: window.matchMedia("(orientation: portrait)").matches,
    landscapeQuery: window.matchMedia("(orientation: landscape)").matches,
  };

  return results;
}

/**
 * Test CSS feature support
 * @returns {Object} CSS feature test results
 */
function testCSSFeatureSupport() {
  const features = {
    flexbox: CSS.supports("display", "flex"),
    grid: CSS.supports("display", "grid"),
    backdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
    customProperties: CSS.supports("--custom", "property"),
    transforms3d: CSS.supports("transform", "translateZ(0px)"),
    animations: CSS.supports("animation", "name 1s ease"),
    transitions: CSS.supports("transition", "all 1s ease"),
    willChange: CSS.supports("will-change", "transform"),
    containment: CSS.supports("contain", "layout"),
    objectFit: CSS.supports("object-fit", "cover"),
    aspectRatio: CSS.supports("aspect-ratio", "1/1"),
    gap: CSS.supports("gap", "1rem"),
    clamp: CSS.supports("width", "clamp(1rem, 50vw, 2rem)"),
    minmax: CSS.supports("width", "minmax(100px, 1fr)"),
    vh: CSS.supports("height", "100vh"),
    dvh: CSS.supports("height", "100dvh"),
    svh: CSS.supports("height", "100svh"),
    lvh: CSS.supports("height", "100lvh"),
    safeArea: CSS.supports("padding", "env(safe-area-inset-top)"),
  };

  return features;
}

/**
 * Test animation performance
 * @returns {Promise<Object>} Animation performance test results
 */
function testAnimationPerformance() {
  return new Promise((resolve) => {
    const results = {
      flipAnimation: {},
      selectorSlider: {},
      buttonHover: {},
      overall: {},
    };

    let testCount = 0;
    const totalTests = 3;

    const completeTest = () => {
      testCount++;
      if (testCount === totalTests) {
        // Calculate overall performance rating
        const avgFrameRate =
          (results.flipAnimation.frameRate +
            results.selectorSlider.frameRate +
            results.buttonHover.frameRate) /
          3;

        results.overall = {
          averageFrameRate: avgFrameRate,
          rating:
            avgFrameRate >= 55
              ? "excellent"
              : avgFrameRate >= 45
              ? "good"
              : avgFrameRate >= 30
              ? "fair"
              : "poor",
        };

        resolve(results);
      }
    };

    // Test flip card animation
    const flipCard = document.querySelector(".flip-card");
    if (flipCard) {
      testElementAnimation(flipCard, "flip-animation").then((result) => {
        results.flipAnimation = result;
        completeTest();
      });
    } else {
      results.flipAnimation = { error: "Flip card not found" };
      completeTest();
    }

    // Test selector slider animation
    const selectorSlider = document.querySelector(".selector-slider");
    if (selectorSlider) {
      testElementAnimation(selectorSlider, "slider-animation").then(
        (result) => {
          results.selectorSlider = result;
          completeTest();
        }
      );
    } else {
      results.selectorSlider = { error: "Selector slider not found" };
      completeTest();
    }

    // Test button hover animation
    const controlButton = document.querySelector(".control-button");
    if (controlButton) {
      testElementAnimation(controlButton, "button-hover").then((result) => {
        results.buttonHover = result;
        completeTest();
      });
    } else {
      results.buttonHover = { error: "Control button not found" };
      completeTest();
    }
  });
}

/**
 * Test animation performance for a specific element
 * @param {HTMLElement} element - Element to test
 * @param {string} animationType - Type of animation being tested
 * @returns {Promise<Object>} Animation test results
 */
function testElementAnimation(element, animationType) {
  return new Promise((resolve) => {
    let frameCount = 0;
    let totalFrameTime = 0;
    let maxFrameTime = 0;
    let droppedFrames = 0;
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
        droppedFrames++;
      }

      lastFrameTime = currentTime;

      if (frameCount < 60) {
        // Test for 1 second
        animationId = requestAnimationFrame(measureFrame);
      } else {
        const avgFrameRate = 1000 / (totalFrameTime / frameCount);

        resolve({
          frameRate: avgFrameRate,
          droppedFrames,
          maxFrameTime,
          averageFrameTime: totalFrameTime / frameCount,
          animationType,
        });
      }
    };

    // Start animation based on type
    switch (animationType) {
      case "flip-animation":
        element.classList.add("flipping");
        setTimeout(() => element.classList.remove("flipping"), 600);
        break;
      case "slider-animation":
        element.style.transform = "translateX(100px)";
        setTimeout(() => (element.style.transform = ""), 300);
        break;
      case "button-hover":
        element.style.transform = "translateY(-2px)";
        setTimeout(() => (element.style.transform = ""), 200);
        break;
    }

    animationId = requestAnimationFrame(measureFrame);

    // Cleanup after test
    setTimeout(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      if (frameCount === 0) {
        resolve({
          error: "No frames measured",
          animationType,
        });
      }
    }, 2000);
  });
}

/**
 * Test viewport and scrolling behavior
 * @returns {Object} Viewport test results
 */
function testViewportBehavior() {
  const results = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    },
    scrolling: {
      supportsOverscrollBehavior: CSS.supports("overscroll-behavior", "none"),
      supportsMomentumScrolling: CSS.supports(
        "-webkit-overflow-scrolling",
        "touch"
      ),
      hasScrollBounce: true, // Will be tested dynamically
    },
    safeArea: {
      supportsEnv: CSS.supports("padding", "env(safe-area-inset-top)"),
      supportsConstant: CSS.supports(
        "padding",
        "constant(safe-area-inset-top)"
      ),
    },
  };

  // Test for scroll bounce (iOS Safari)
  const testElement = document.createElement("div");
  testElement.style.cssText = `
    position: fixed;
    top: -100px;
    left: -100px;
    width: 50px;
    height: 50px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
  `;

  document.body.appendChild(testElement);

  // Check if overscroll-behavior is actually applied
  const computedStyle = window.getComputedStyle(testElement);
  results.scrolling.hasScrollBounce =
    computedStyle.overscrollBehavior !== "none";

  document.body.removeChild(testElement);

  return results;
}

/**
 * Run comprehensive mobile compatibility test suite
 * @returns {Promise<Object>} Complete test results
 */
export async function runMobileCompatibilityTests() {
  console.group("📱 Running Mobile Compatibility Test Suite");

  const startTime = performance.now();

  const results = {
    timestamp: new Date().toISOString(),
    testDuration: 0,
    browser: detectBrowser(),
    deviceCapabilities: detectDeviceCapabilities(),
    compatibilityIssues: checkCompatibilityIssues(),
    tests: {},
  };

  try {
    console.log("🔍 Testing responsive layout...");
    results.tests.responsiveLayout = testResponsiveLayout();

    console.log("🎨 Testing CSS feature support...");
    results.tests.cssFeatures = testCSSFeatureSupport();

    console.log("📱 Testing touch compatibility...");
    results.tests.touchCompatibility = await runTouchCompatibilityTests();

    console.log("🔧 Testing browser-specific quirks...");
    results.tests.browserQuirks = testBrowserTouchQuirks();

    console.log("🎬 Testing animation performance...");
    results.tests.animationPerformance = await testAnimationPerformance();

    console.log("📐 Testing viewport behavior...");
    results.tests.viewportBehavior = testViewportBehavior();

    const endTime = performance.now();
    results.testDuration = endTime - startTime;

    // Generate overall compatibility score
    results.compatibilityScore = calculateCompatibilityScore(results);

    console.log("✅ Mobile compatibility tests completed");
    console.log("📊 Test Results:", results);
  } catch (error) {
    console.error("❌ Mobile compatibility test failed:", error);
    results.error = error.message;
  }

  console.groupEnd();
  return results;
}

/**
 * Calculate overall compatibility score
 * @param {Object} results - Test results
 * @returns {Object} Compatibility score and rating
 */
function calculateCompatibilityScore(results) {
  let score = 0;
  let maxScore = 0;

  // CSS Features (30 points)
  const cssFeatures = results.tests.cssFeatures;
  const supportedFeatures = Object.values(cssFeatures).filter(Boolean).length;
  const totalFeatures = Object.keys(cssFeatures).length;
  score += (supportedFeatures / totalFeatures) * 30;
  maxScore += 30;

  // Touch Compatibility (25 points)
  const touchTests = results.tests.touchCompatibility?.tests;
  if (touchTests) {
    if (touchTests.touchEvents?.touchstart) score += 10;
    if (touchTests.accessibility?.isAccessible) score += 10;
    if (touchTests.performance?.performanceRating === "excellent") score += 5;
    else if (touchTests.performance?.performanceRating === "good") score += 3;
    else if (touchTests.performance?.performanceRating === "fair") score += 1;
  }
  maxScore += 25;

  // Animation Performance (20 points)
  const animPerf = results.tests.animationPerformance?.overall;
  if (animPerf) {
    if (animPerf.rating === "excellent") score += 20;
    else if (animPerf.rating === "good") score += 15;
    else if (animPerf.rating === "fair") score += 10;
    else if (animPerf.rating === "poor") score += 5;
  }
  maxScore += 20;

  // Layout Responsiveness (15 points)
  const layoutElements = results.tests.responsiveLayout?.layoutElements;
  if (layoutElements) {
    const visibleElements = Object.values(layoutElements).filter(
      (el) => el.isVisible
    ).length;
    const totalElements = Object.keys(layoutElements).length;
    score += (visibleElements / totalElements) * 15;
  }
  maxScore += 15;

  // Browser Compatibility (10 points)
  const issues = results.compatibilityIssues;
  const criticalIssues = issues.filter(
    (issue) => issue.type === "error"
  ).length;
  const warningIssues = issues.filter(
    (issue) => issue.type === "warning"
  ).length;

  let compatScore = 10;
  compatScore -= criticalIssues * 5;
  compatScore -= warningIssues * 2;
  score += Math.max(0, compatScore);
  maxScore += 10;

  const percentage = (score / maxScore) * 100;

  let rating;
  if (percentage >= 90) rating = "excellent";
  else if (percentage >= 80) rating = "good";
  else if (percentage >= 70) rating = "fair";
  else if (percentage >= 60) rating = "poor";
  else rating = "critical";

  return {
    score: Math.round(score),
    maxScore,
    percentage: Math.round(percentage),
    rating,
    breakdown: {
      cssFeatures: Math.round((supportedFeatures / totalFeatures) * 30),
      touchCompatibility: score >= 25 ? 25 : Math.round(score * 0.25),
      animationPerformance: animPerf
        ? animPerf.rating === "excellent"
          ? 20
          : 15
        : 0,
      layoutResponsiveness: layoutElements
        ? Math.round(
            (visibleElements / Object.keys(layoutElements).length) * 15
          )
        : 0,
      browserCompatibility: Math.max(0, compatScore),
    },
  };
}

/**
 * Export test results to console in a formatted way
 * @param {Object} results - Test results to format
 */
export function exportTestResults(results) {
  console.group("📋 Mobile Compatibility Test Report");

  console.log("🕒 Test completed at:", results.timestamp);
  console.log("⏱️ Test duration:", `${Math.round(results.testDuration)}ms`);
  console.log(
    "🌐 Browser:",
    `${results.browser.name} ${results.browser.version} (Mobile: ${results.browser.isMobile})`
  );
  console.log(
    "📊 Compatibility Score:",
    `${results.compatibilityScore.percentage}% (${results.compatibilityScore.rating})`
  );

  if (results.compatibilityIssues.length > 0) {
    console.group("⚠️ Compatibility Issues");
    results.compatibilityIssues.forEach((issue) => {
      console.log(`${issue.type.toUpperCase()}: ${issue.issue}`, issue);
    });
    console.groupEnd();
  }

  console.group("📱 Test Details");
  console.log("CSS Features:", results.tests.cssFeatures);
  console.log("Touch Compatibility:", results.tests.touchCompatibility);
  console.log("Animation Performance:", results.tests.animationPerformance);
  console.log("Responsive Layout:", results.tests.responsiveLayout);
  console.log("Viewport Behavior:", results.tests.viewportBehavior);
  console.groupEnd();

  console.groupEnd();

  return results;
}
