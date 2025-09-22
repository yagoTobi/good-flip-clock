/**
 * Mobile Accessibility Testing Utilities
 *
 * This module provides comprehensive testing functions to verify that the flip clock
 * application meets WCAG accessibility guidelines for mobile devices.
 */

/**
 * Test keyboard navigation functionality
 */
export const testKeyboardNavigation = () => {
  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: All interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="tab"]'
  );

  let keyboardAccessible = 0;
  interactiveElements.forEach((element) => {
    const tabIndex = element.getAttribute("tabindex");
    if (tabIndex !== "-1" && !element.disabled) {
      keyboardAccessible++;
    }
  });

  if (keyboardAccessible === interactiveElements.length) {
    results.passed++;
    results.tests.push({
      name: "Keyboard Navigation - All interactive elements accessible",
      status: "PASS",
      details: `${keyboardAccessible}/${interactiveElements.length} elements are keyboard accessible`,
    });
  } else {
    results.failed++;
    results.tests.push({
      name: "Keyboard Navigation - All interactive elements accessible",
      status: "FAIL",
      details: `Only ${keyboardAccessible}/${interactiveElements.length} elements are keyboard accessible`,
    });
  }

  // Test 2: Focus indicators are visible
  const focusableElements = document.querySelectorAll(
    'button:focus-visible, input:focus-visible, [role="tab"]:focus-visible'
  );
  const hasVisibleFocus =
    window.getComputedStyle(document.body).getPropertyValue("outline") !==
    "none";

  results.tests.push({
    name: "Focus Indicators - Visible focus styles",
    status: "INFO",
    details: "Focus indicators should be visible when navigating with keyboard",
  });

  return results;
};

/**
 * Test ARIA labels and roles
 */
export const testAriaLabels = () => {
  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: All buttons have accessible names
  const buttons = document.querySelectorAll("button");
  let buttonsWithLabels = 0;

  buttons.forEach((button) => {
    const hasAriaLabel = button.getAttribute("aria-label");
    const hasAriaLabelledBy = button.getAttribute("aria-labelledby");
    const hasTextContent = button.textContent.trim();
    const hasTitle = button.getAttribute("title");

    if (hasAriaLabel || hasAriaLabelledBy || hasTextContent || hasTitle) {
      buttonsWithLabels++;
    }
  });

  if (buttonsWithLabels === buttons.length) {
    results.passed++;
    results.tests.push({
      name: "ARIA Labels - All buttons have accessible names",
      status: "PASS",
      details: `${buttonsWithLabels}/${buttons.length} buttons have accessible names`,
    });
  } else {
    results.failed++;
    results.tests.push({
      name: "ARIA Labels - All buttons have accessible names",
      status: "FAIL",
      details: `Only ${buttonsWithLabels}/${buttons.length} buttons have accessible names`,
    });
  }

  // Test 2: Modal dialogs have proper ARIA attributes
  const dialogs = document.querySelectorAll('[role="dialog"]');
  let properDialogs = 0;

  dialogs.forEach((dialog) => {
    const hasAriaModal = dialog.getAttribute("aria-modal") === "true";
    const hasAriaLabelledBy = dialog.getAttribute("aria-labelledby");
    const hasAriaLabel = dialog.getAttribute("aria-label");

    if (hasAriaModal && (hasAriaLabelledBy || hasAriaLabel)) {
      properDialogs++;
    }
  });

  if (dialogs.length === 0 || properDialogs === dialogs.length) {
    results.passed++;
    results.tests.push({
      name: "ARIA Labels - Modal dialogs properly labeled",
      status: "PASS",
      details: `${properDialogs}/${dialogs.length} dialogs have proper ARIA attributes`,
    });
  } else {
    results.failed++;
    results.tests.push({
      name: "ARIA Labels - Modal dialogs properly labeled",
      status: "FAIL",
      details: `Only ${properDialogs}/${dialogs.length} dialogs have proper ARIA attributes`,
    });
  }

  // Test 3: Tab navigation has proper ARIA attributes
  const tabLists = document.querySelectorAll('[role="tablist"]');
  let properTabLists = 0;

  tabLists.forEach((tabList) => {
    const tabs = tabList.querySelectorAll('[role="tab"]');
    let properTabs = 0;

    tabs.forEach((tab) => {
      const hasAriaSelected = tab.hasAttribute("aria-selected");
      const hasAriaControls = tab.hasAttribute("aria-controls");

      if (hasAriaSelected && hasAriaControls) {
        properTabs++;
      }
    });

    if (properTabs === tabs.length) {
      properTabLists++;
    }
  });

  if (tabLists.length === 0 || properTabLists === tabLists.length) {
    results.passed++;
    results.tests.push({
      name: "ARIA Labels - Tab navigation properly implemented",
      status: "PASS",
      details: `${properTabLists}/${tabLists.length} tab lists have proper ARIA attributes`,
    });
  } else {
    results.failed++;
    results.tests.push({
      name: "ARIA Labels - Tab navigation properly implemented",
      status: "FAIL",
      details: `Only ${properTabLists}/${tabLists.length} tab lists have proper ARIA attributes`,
    });
  }

  return results;
};

/**
 * Test touch target sizes for mobile accessibility
 */
export const testTouchTargets = () => {
  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  const MIN_TOUCH_TARGET = 44; // WCAG minimum touch target size

  // Test all interactive elements
  const interactiveElements = document.querySelectorAll(
    'button, input, select, textarea, [role="button"], [role="tab"]'
  );

  let adequateTouchTargets = 0;
  const inadequateTargets = [];

  interactiveElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width >= MIN_TOUCH_TARGET && height >= MIN_TOUCH_TARGET) {
      adequateTouchTargets++;
    } else {
      inadequateTargets.push({
        element: element.tagName.toLowerCase(),
        size: `${Math.round(width)}x${Math.round(height)}px`,
        index,
      });
    }
  });

  if (adequateTouchTargets === interactiveElements.length) {
    results.passed++;
    results.tests.push({
      name: "Touch Targets - Minimum size compliance",
      status: "PASS",
      details: `${adequateTouchTargets}/${interactiveElements.length} elements meet minimum touch target size (44px)`,
    });
  } else {
    results.failed++;
    results.tests.push({
      name: "Touch Targets - Minimum size compliance",
      status: "FAIL",
      details: `Only ${adequateTouchTargets}/${
        interactiveElements.length
      } elements meet minimum size. Inadequate: ${inadequateTargets
        .map((t) => `${t.element}(${t.size})`)
        .join(", ")}`,
    });
  }

  return results;
};

/**
 * Test screen reader support
 */
export const testScreenReaderSupport = () => {
  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: Live regions for dynamic content
  const liveRegions = document.querySelectorAll(
    '[aria-live], [role="status"], [role="alert"]'
  );

  if (liveRegions.length > 0) {
    results.passed++;
    results.tests.push({
      name: "Screen Reader - Live regions present",
      status: "PASS",
      details: `${liveRegions.length} live regions found for dynamic content announcements`,
    });
  } else {
    results.failed++;
    results.tests.push({
      name: "Screen Reader - Live regions present",
      status: "FAIL",
      details: "No live regions found for dynamic content announcements",
    });
  }

  // Test 2: Hidden decorative elements
  const decorativeElements = document.querySelectorAll(
    'svg, img[alt=""], [aria-hidden="true"]'
  );
  let properlyHidden = 0;

  decorativeElements.forEach((element) => {
    const ariaHidden = element.getAttribute("aria-hidden") === "true";
    const emptyAlt = element.getAttribute("alt") === "";

    if (ariaHidden || emptyAlt) {
      properlyHidden++;
    }
  });

  results.tests.push({
    name: "Screen Reader - Decorative elements hidden",
    status: "INFO",
    details: `${properlyHidden} decorative elements are properly hidden from screen readers`,
  });

  // Test 3: Form labels
  const inputs = document.querySelectorAll("input, select, textarea");
  let labeledInputs = 0;

  inputs.forEach((input) => {
    const hasLabel = document.querySelector(`label[for="${input.id}"]`);
    const hasAriaLabel = input.getAttribute("aria-label");
    const hasAriaLabelledBy = input.getAttribute("aria-labelledby");

    if (hasLabel || hasAriaLabel || hasAriaLabelledBy) {
      labeledInputs++;
    }
  });

  if (inputs.length === 0 || labeledInputs === inputs.length) {
    results.passed++;
    results.tests.push({
      name: "Screen Reader - Form inputs properly labeled",
      status: "PASS",
      details: `${labeledInputs}/${inputs.length} form inputs have proper labels`,
    });
  } else {
    results.failed++;
    results.tests.push({
      name: "Screen Reader - Form inputs properly labeled",
      status: "FAIL",
      details: `Only ${labeledInputs}/${inputs.length} form inputs have proper labels`,
    });
  }

  return results;
};

/**
 * Test mobile-specific accessibility features
 */
export const testMobileAccessibility = () => {
  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: Viewport meta tag for mobile
  const viewportMeta = document.querySelector('meta[name="viewport"]');

  if (viewportMeta) {
    const content = viewportMeta.getAttribute("content");
    const hasUserScalable =
      content.includes("user-scalable=no") ||
      content.includes("maximum-scale=1");

    if (!hasUserScalable) {
      results.passed++;
      results.tests.push({
        name: "Mobile Accessibility - Zoom not disabled",
        status: "PASS",
        details: "Users can zoom for better accessibility",
      });
    } else {
      results.failed++;
      results.tests.push({
        name: "Mobile Accessibility - Zoom not disabled",
        status: "FAIL",
        details: "Zoom is disabled, preventing users from scaling content",
      });
    }
  } else {
    results.failed++;
    results.tests.push({
      name: "Mobile Accessibility - Viewport meta tag",
      status: "FAIL",
      details: "No viewport meta tag found",
    });
  }

  // Test 2: Orientation support
  const supportsOrientation = window.screen && window.screen.orientation;

  results.tests.push({
    name: "Mobile Accessibility - Orientation support",
    status: "INFO",
    details: supportsOrientation
      ? "Device orientation API available"
      : "Device orientation API not available",
  });

  // Test 3: Touch action properties
  const elementsWithTouchAction = document.querySelectorAll(
    '[style*="touch-action"]'
  );

  results.tests.push({
    name: "Mobile Accessibility - Touch action optimization",
    status: "INFO",
    details: `${elementsWithTouchAction.length} elements have touch-action properties for better touch handling`,
  });

  return results;
};

/**
 * Run comprehensive accessibility test suite
 */
export const runAccessibilityTests = () => {
  console.group("🔍 Mobile Accessibility Test Results");

  const testSuites = [
    { name: "Keyboard Navigation", test: testKeyboardNavigation },
    { name: "ARIA Labels & Roles", test: testAriaLabels },
    { name: "Touch Targets", test: testTouchTargets },
    { name: "Screen Reader Support", test: testScreenReaderSupport },
    { name: "Mobile Accessibility", test: testMobileAccessibility },
  ];

  const overallResults = {
    totalPassed: 0,
    totalFailed: 0,
    totalTests: 0,
    suiteResults: [],
  };

  testSuites.forEach((suite) => {
    console.group(`📋 ${suite.name}`);
    const results = suite.test();

    overallResults.totalPassed += results.passed;
    overallResults.totalFailed += results.failed;
    overallResults.totalTests += results.tests.length;
    overallResults.suiteResults.push({
      name: suite.name,
      ...results,
    });

    results.tests.forEach((test) => {
      const icon =
        test.status === "PASS" ? "✅" : test.status === "FAIL" ? "❌" : "ℹ️";
      console.log(`${icon} ${test.name}: ${test.details}`);
    });

    console.groupEnd();
  });

  console.group("📊 Overall Results");
  console.log(`Total Tests: ${overallResults.totalTests}`);
  console.log(`Passed: ${overallResults.totalPassed}`);
  console.log(`Failed: ${overallResults.totalFailed}`);
  console.log(
    `Success Rate: ${Math.round(
      (overallResults.totalPassed /
        (overallResults.totalPassed + overallResults.totalFailed)) *
        100
    )}%`
  );
  console.groupEnd();

  console.groupEnd();

  return overallResults;
};

/**
 * Export test results for external analysis
 */
export const exportAccessibilityResults = (results) => {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    results,
  };

  // Create downloadable report
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `accessibility-report-${timestamp.split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return report;
};
