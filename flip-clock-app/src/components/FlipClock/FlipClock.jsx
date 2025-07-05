import { useState, useEffect } from "react";
import FlipCard from "./FlipCard";
import "./FlipClock.css";

function FlipClock() {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());
  const [flippingUnits, setFlippingUnits] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setPrevTime(time);
      setTime(newTime);

      // Format time units as two-digit strings
      const oldHours = time.getHours().toString().padStart(2, "0");
      const oldMinutes = time.getMinutes().toString().padStart(2, "0");
      const oldSeconds = time.getSeconds().toString().padStart(2, "0");

      const newHours = newTime.getHours().toString().padStart(2, "0");
      const newMinutes = newTime.getMinutes().toString().padStart(2, "0");
      const newSeconds = newTime.getSeconds().toString().padStart(2, "0");

      // Set flipping state for changed time units
      const flipping = {
        hours: oldHours !== newHours,
        minutes: oldMinutes !== newMinutes,
        seconds: oldSeconds !== newSeconds,
      };

      setFlippingUnits(flipping);

      // Reset flipping state after animation completes
      setTimeout(() => {
        setFlippingUnits({});
      }, 650);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // Format time units as strings
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  // Previous time units for animation
  const prevHours = prevTime.getHours().toString().padStart(2, "0");
  const prevMinutes = prevTime.getMinutes().toString().padStart(2, "0");
  const prevSeconds = prevTime.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flip-clock">
      <div className="time-display">
        {/* Hours */}
        <FlipCard
          value={hours}
          prevValue={prevHours}
          isFlipping={flippingUnits.hours}
        />

        {/* Minutes with overlaid seconds */}
        <div className="minutes-group">
          <FlipCard
            value={minutes}
            prevValue={prevMinutes}
            isFlipping={flippingUnits.minutes}
          />

          {/* Mini seconds overlaid on bottom right corner */}
          <div className="seconds-overlay">
            <FlipCard
              value={seconds}
              prevValue={prevSeconds}
              isFlipping={flippingUnits.seconds}
              size="mini"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipClock;
