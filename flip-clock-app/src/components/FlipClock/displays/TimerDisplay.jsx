import { useState, useEffect } from "react";
import FlipCardGrid from "./FlipCardGrid";
import FlipCard from "../FlipCard";
import { FLIP_STATE_CLEAR_DELAY } from "../../../constants";

function TimerDisplay({ timer }) {
  const [flippingUnits, setFlippingUnits] = useState({});

  // Handle flip animations when timer values change
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

  if (hasHours) {
    // HH:MM:SS format
    const displayHours = hours.toString().padStart(2, "0");
    const displayMinutes = minutes.toString().padStart(2, "0");
    const displaySeconds = seconds.toString().padStart(2, "0");
    const prevDisplayHours = prevHours.toString().padStart(2, "0");
    const prevDisplayMinutes = prevMinutes.toString().padStart(2, "0");
    const prevDisplaySeconds = prevSeconds.toString().padStart(2, "0");

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
