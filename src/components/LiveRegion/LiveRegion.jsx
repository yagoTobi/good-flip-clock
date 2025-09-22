import { useEffect, useState } from "react";

/**
 * LiveRegion - Accessibility component for screen reader announcements
 *
 * This component provides a way to announce dynamic content changes to screen readers
 * using ARIA live regions. It's particularly useful for timer state changes and
 * other dynamic updates that need to be communicated to users with screen readers.
 */
const LiveRegion = ({ message, politeness = "polite", clearDelay = 3000 }) => {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (message) {
      setAnnouncement(message);

      // Clear the announcement after a delay to prevent repetition
      if (clearDelay > 0) {
        const timer = setTimeout(() => {
          setAnnouncement("");
        }, clearDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [message, clearDelay]);

  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcement}
    </div>
  );
};

export default LiveRegion;
