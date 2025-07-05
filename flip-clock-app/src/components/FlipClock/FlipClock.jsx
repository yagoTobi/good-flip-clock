import { useState, useEffect } from "react";
import FlipCard from "./FlipCard";
import "./FlipClock.css";

function FlipClock({ mode }) {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());
  const [flippingUnits, setFlippingUnits] = useState({});
  const [isFlippingMode, setIsFlippingMode] = useState(false);
  const [flipDirection, setFlipDirection] = useState("");
  const [displayMode, setDisplayMode] = useState(mode);

  useEffect(() => {
    // Only run timer for Clock mode
    if (displayMode !== "Clock") return;
    
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
  }, [time, displayMode]);

  // Separate effect to handle mode changes with flip animation
  useEffect(() => {
    if (mode === displayMode) return; // No change needed
    
    if (mode === "Clock") {
      // Flipping from Timer to Clock (flip left)
      setFlipDirection("left");
      setIsFlippingMode(true);
      
      // Change display mode and update time at halfway point
      setTimeout(() => {
        setDisplayMode("Clock");
        const newTime = new Date();
        setPrevTime(time);
        setTime(newTime);
      }, 150);
    } else {
      // Flipping from Clock to Timer (flip right)
      setFlipDirection("right");
      setIsFlippingMode(true);
      
      // Change display mode at halfway point
      setTimeout(() => {
        setDisplayMode("Timer");
      }, 150);
    }
    
    // Reset flip animation after completion
    const timer = setTimeout(() => {
      setIsFlippingMode(false);
      setFlipDirection("");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [mode, displayMode, time]);

  // Format time units based on display mode
  const hours = displayMode === "Clock" ? time.getHours().toString().padStart(2, "0") : "00";
  const minutes = displayMode === "Clock" ? time.getMinutes().toString().padStart(2, "0") : "00";
  const seconds = displayMode === "Clock" ? time.getSeconds().toString().padStart(2, "0") : "00";

  // Previous time units for animation
  const prevHours = displayMode === "Clock" ? prevTime.getHours().toString().padStart(2, "0") : "00";
  const prevMinutes = displayMode === "Clock" ? prevTime.getMinutes().toString().padStart(2, "0") : "00";
  const prevSeconds = displayMode === "Clock" ? prevTime.getSeconds().toString().padStart(2, "0") : "00";

  return (
    <div className={`flip-clock ${isFlippingMode ? `flipping-${flipDirection}` : ""}`}>
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
