import { useState, useEffect } from "react";
import FlipCardGrid from "./FlipCardGrid";

/**
 * ClockDisplay - Real-time clock display with flip card animations
 *
 * This component displays the current time in HH:MM format with small seconds display.
 * It automatically updates every second and triggers flip animations when time values
 * change. The component manages its own time state and animation timing.
 *
 * Features:
 * - Real-time clock updates every second
 * - Flip animations for hours, minutes, and seconds changes
 * - 24-hour format display with zero-padding
 * - Automatic animation cleanup after flip completion
 *
 * Animation Logic:
 * - Compares previous and current time values to determine which units need flipping
 * - Sets flipping state for 650ms to allow animation completion
 * - Uses FlipCardGrid for consistent layout with other display modes
 *
 * @returns {JSX.Element} Real-time clock display with flip animations
 */
function ClockDisplay() {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());
  const [flippingUnits, setFlippingUnits] = useState({});

  /**
   * Set up real-time clock updates with flip animation detection
   *
   * This effect:
   * 1. Updates time state every second
   * 2. Compares old vs new time values to detect changes
   * 3. Triggers appropriate flip animations for changed units
   * 4. Clears animation state after 650ms to reset for next change
   *
   * The flipping object maps to FlipCardGrid props:
   * - left: hours changed (affects left card)
   * - right: minutes changed (affects right card)
   * - mini: seconds changed (affects mini seconds display)
   */
  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setPrevTime(time);
      setTime(newTime);

      const oldHours = time.getHours().toString().padStart(2, "0");
      const oldMinutes = time.getMinutes().toString().padStart(2, "0");
      const oldSeconds = time.getSeconds().toString().padStart(2, "0");

      const newHours = newTime.getHours().toString().padStart(2, "0");
      const newMinutes = newTime.getMinutes().toString().padStart(2, "0");
      const newSeconds = newTime.getSeconds().toString().padStart(2, "0");

      const flipping = {
        left: oldHours !== newHours,
        right: oldMinutes !== newMinutes,
        mini: oldSeconds !== newSeconds,
      };

      setFlippingUnits(flipping);

      // Clear animation state after flip completes
      setTimeout(() => {
        setFlippingUnits({});
      }, 650);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const prevHours = prevTime.getHours().toString().padStart(2, "0");
  const prevMinutes = prevTime.getMinutes().toString().padStart(2, "0");
  const prevSeconds = prevTime.getSeconds().toString().padStart(2, "0");

  return (
    <FlipCardGrid
      leftValue={hours}
      rightValue={minutes}
      prevLeftValue={prevHours}
      prevRightValue={prevMinutes}
      flippingUnits={flippingUnits}
      showMiniSeconds={true}
      miniSecondsValue={seconds}
      prevMiniSecondsValue={prevSeconds}
    />
  );
}

export default ClockDisplay;
