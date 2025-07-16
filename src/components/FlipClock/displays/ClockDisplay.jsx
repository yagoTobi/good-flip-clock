import { useState, useEffect } from "react";
import FlipCardGrid from "./FlipCardGrid";

function ClockDisplay() {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());
  const [flippingUnits, setFlippingUnits] = useState({});

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