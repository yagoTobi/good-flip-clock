import { useState, useEffect } from "react";

export function useMobileChrome({ isAnyModalOpen, isAnyFloatingOpen }) {
  const [visible, setVisible] = useState(true);

  // Auto-hide after 4s of inactivity on mobile
  useEffect(() => {
    if (!visible) return;
    if (isAnyModalOpen || isAnyFloatingOpen) return;

    const mq = window.matchMedia(
      "(max-width: 767px), (max-height: 500px) and (orientation: landscape)"
    );
    if (!mq.matches) return;

    let hideTimer = setTimeout(() => setVisible(false), 4000);

    const resetTimer = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), 4000);
    };

    document.addEventListener("touchstart", resetTimer, { passive: true });

    return () => {
      clearTimeout(hideTimer);
      document.removeEventListener("touchstart", resetTimer);
    };
  }, [visible, isAnyModalOpen, isAnyFloatingOpen]);

  return { mobileChromeVisible: visible, setMobileChromeVisible: setVisible };
}
