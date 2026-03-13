import { useState, useEffect, useRef } from "react";

export function useIdleMode(closeAll) {
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    const isLandscapeMobile = window.matchMedia("(max-height: 500px) and (orientation: landscape)").matches;
    if (!window.matchMedia("(min-width: 768px)").matches || isLandscapeMobile) return;

    const enterFocusMode = () => {
      setIsIdle(true);
      closeAll();
    };

    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setIsIdle(false);
      idleTimerRef.current = setTimeout(enterFocusMode, 10000);
    };

    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("mousedown", resetIdle);
    window.addEventListener("keydown", resetIdle);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("mousedown", resetIdle);
      window.removeEventListener("keydown", resetIdle);
    };
  }, [closeAll]);

  return isIdle;
}
