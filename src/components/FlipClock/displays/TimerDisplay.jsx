import { useState, useEffect } from "react";
import FlipCardGrid from "./FlipCardGrid";
import FlipCard from "../FlipCard";
import { FLIP_STATE_CLEAR_DELAY } from "../../../constants";

/**
 * TimerDisplay - Countdown timer display with flip card animations
 *
 * This component displays countdown timer values with flip animations when the timer
 * is running or reverting to original time. It supports both MM:SS and HH:MM:SS formats
 * depending on whether the timer includes hours.
 *
 * Features:
 * - Dynamic format switching (MM:SS vs HH:MM:SS) based on timer duration
 * - Flip animations triggered by timer state changes
 * - Animation only occurs when timer is actively running or reverting
 * - Proper zero-padding for consistent display formatting
 *
 * Animation Logic:
 * - Monitors timer values for changes during active states
 * - Groups related time units for synchronized flip animations
 * - Uses different layouts based on whether hours are present
 *
 * @param {Object} props - Component props
 * @param {Object} props.timer - Timer hook instance containing time values and state
 * @param {number} props.timer.hours - Current hours value
 * @param {number} props.timer.minutes - Current minutes value
 * @param {number} props.timer.seconds - Current seconds value
 * @param {number} props.timer.prevHours - Previous hours value for animation
 * @param {number} props.timer.prevMinutes - Previous minutes value for animation
 * @param {number} props.timer.prevSeconds - Previous seconds value for animation
 * @param {boolean} props.timer.hasHours - Whether timer includes hours
 * @param {boolean} props.timer.isRunning - Whether timer is currently running
 * @param {boolean} props.timer.isReverting - Whether timer is reverting to original time
 * @returns {JSX.Element|null} Timer display with flip animations, or null if no timer
 */
function TimerDisplay({ timer }) {
  const [flippingUnits, setFlippingUnits] = useState({});

  /**
   * Handle flip animations when timer values change
   *
   * This effect monitors timer state and triggers flip animations only when:
   * - Timer is actively running (counting down)
   * - Timer is reverting to original time (reset operation)
   *
   * Animation grouping logic:
   * - left: hours OR minutes changed (affects left side cards)
   * - right: seconds changed (affects right side card)
   *
   * This grouping ensures related time units flip together for visual coherence.
   */
  useEffect(() => {
    if (!timer) return;

    const {
      hours,
      minutes,
      seconds,
      prevHours,
      prevMinutes,
      prevSeconds,
      isRunning,
      isReverting,
    } = timer;

    // Trigger flip animations when timer is running OR when reverting to original time
    if (!isRunning && !isReverting) return;

    if (
      hours !== prevHours ||
      minutes !== prevMinutes ||
      seconds !== prevSeconds
    ) {
      const flipping = {
        left: hours !== prevHours || minutes !== prevMinutes,
        right: seconds !== prevSeconds,
      };

      setFlippingUnits(flipping);

      // Clear animation state after flip completes
      setTimeout(() => {
        setFlippingUnits({});
      }, FLIP_STATE_CLEAR_DELAY);
    }
  }, [timer]);

  if (!timer) return null;

  const {
    hours,
    minutes,
    seconds,
    prevHours,
    prevMinutes,
    prevSeconds,
    hasHours,
  } = timer;

  /**
   * Helper function to format time values with zero-padding
   * @param {number} value - Time value to format
   * @returns {string} Zero-padded time string (e.g., "05" for 5)
   */
  const formatTime = (value) => value.toString().padStart(2, "0");

  if (hasHours) {
    // HH:MM:SS format
    const displayHours = formatTime(hours);
    const displayMinutes = formatTime(minutes);
    const displaySeconds = formatTime(seconds);
    const prevDisplayHours = formatTime(prevHours);
    const prevDisplayMinutes = formatTime(prevMinutes);
    const prevDisplaySeconds = formatTime(prevSeconds);

    return (
      <div className="time-display">
        <FlipCard
          value={displayHours}
          prevValue={prevDisplayHours}
          isFlipping={flippingUnits.left}
        />
        <FlipCard
          value={displayMinutes}
          prevValue={prevDisplayMinutes}
          isFlipping={flippingUnits.left}
        />
        <FlipCard
          value={displaySeconds}
          prevValue={prevDisplaySeconds}
          isFlipping={flippingUnits.right}
        />
      </div>
    );
  } else {
    // MM:SS format
    const displayMinutes = minutes.toString().padStart(2, "0");
    const displaySeconds = seconds.toString().padStart(2, "0");
    const prevDisplayMinutes = prevMinutes.toString().padStart(2, "0");
    const prevDisplaySeconds = prevSeconds.toString().padStart(2, "0");

    return (
      <FlipCardGrid
        leftValue={displayMinutes}
        rightValue={displaySeconds}
        prevLeftValue={prevDisplayMinutes}
        prevRightValue={prevDisplaySeconds}
        flippingUnits={flippingUnits}
        showMiniSeconds={false}
      />
    );
  }
}

export default TimerDisplay;
