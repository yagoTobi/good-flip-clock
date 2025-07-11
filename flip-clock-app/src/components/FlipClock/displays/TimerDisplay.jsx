import { useState, useEffect } from "react";
import FlipCardGrid from "./FlipCardGrid";
import FlipCard from "../FlipCard";

function TimerDisplay({ timerState, timerHours, timerMinutes, timerSeconds, onTimerComplete, onTimerUpdate }) {
  const [prevHours, setPrevHours] = useState(timerHours);
  const [prevMinutes, setPrevMinutes] = useState(timerMinutes);
  const [prevSeconds, setPrevSeconds] = useState(timerSeconds);
  const [flippingUnits, setFlippingUnits] = useState({});

  // Update previous values and flip animations when timer values change
  useEffect(() => {
    if (timerHours !== prevHours || timerMinutes !== prevMinutes || timerSeconds !== prevSeconds) {
      setPrevHours(timerHours);
      setPrevMinutes(timerMinutes);
      setPrevSeconds(timerSeconds);
      
      // Determine which units are flipping
      const flipping = {
        left: timerHours !== prevHours || timerMinutes !== prevMinutes,
        right: timerSeconds !== prevSeconds
      };
      
      setFlippingUnits(flipping);
      
      setTimeout(() => {
        setFlippingUnits({});
      }, 650);
    }
  }, [timerHours, timerMinutes, timerSeconds, prevHours, prevMinutes, prevSeconds]);

  const hasHours = timerHours > 0;
  
  if (hasHours) {
    // HH:MM:SS format
    const displayHours = timerHours.toString().padStart(2, "0");
    const displayMinutes = timerMinutes.toString().padStart(2, "0");
    const displaySeconds = timerSeconds.toString().padStart(2, "0");
    const prevDisplayHours = prevHours.toString().padStart(2, "0");
    const prevDisplayMinutes = prevMinutes.toString().padStart(2, "0");
    const prevDisplaySeconds = prevSeconds.toString().padStart(2, "0");

    return (
      <div className="time-display">
        <FlipCard value={displayHours} prevValue={prevDisplayHours} isFlipping={flippingUnits.left} />
        <FlipCard value={displayMinutes} prevValue={prevDisplayMinutes} isFlipping={flippingUnits.left || flippingUnits.right} />
        <FlipCard value={displaySeconds} prevValue={prevDisplaySeconds} isFlipping={flippingUnits.right} />
      </div>
    );
  } else {
    // MM:SS format
    const displayMinutes = timerMinutes.toString().padStart(2, "0");
    const displaySeconds = timerSeconds.toString().padStart(2, "0");
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