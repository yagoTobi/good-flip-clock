import { useReducer, useEffect, useRef, memo } from "react";
import FlipCardGrid from "./FlipCardGrid";
import { FLIP_STATE_CLEAR_DELAY } from "../../../constants";

const fmt = (d, fn) => d[fn]().toString().padStart(2, "0");

function clockReducer(state, action) {
  switch (action.type) {
    case "TICK": {
      const now = action.now;
      return {
        time: now,
        prevTime: state.time,
        flippingUnits: {
          left: fmt(state.time, "getHours") !== fmt(now, "getHours"),
          right: fmt(state.time, "getMinutes") !== fmt(now, "getMinutes"),
          mini: fmt(state.time, "getSeconds") !== fmt(now, "getSeconds"),
        },
      };
    }
    case "CLEAR_FLIP":
      return { ...state, flippingUnits: {} };
    default:
      return state;
  }
}

function ClockDisplayInner() {
  const now = new Date();
  const [state, dispatch] = useReducer(clockReducer, {
    time: now,
    prevTime: now,
    flippingUnits: {},
  });
  const clearTimerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

      dispatch({ type: "TICK", now: new Date() });

      clearTimerRef.current = setTimeout(() => {
        dispatch({ type: "CLEAR_FLIP" });
      }, FLIP_STATE_CLEAR_DELAY);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const { time, prevTime, flippingUnits } = state;

  return (
    <FlipCardGrid
      leftValue={fmt(time, "getHours")}
      rightValue={fmt(time, "getMinutes")}
      prevLeftValue={fmt(prevTime, "getHours")}
      prevRightValue={fmt(prevTime, "getMinutes")}
      flippingUnits={flippingUnits}
      showMiniSeconds={true}
      miniSecondsValue={fmt(time, "getSeconds")}
      prevMiniSecondsValue={fmt(prevTime, "getSeconds")}
    />
  );
}

const ClockDisplay = memo(ClockDisplayInner);
export default ClockDisplay;
