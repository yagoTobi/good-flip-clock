import { useState, useEffect } from "react";
import TimeInput from "./TimeInput";
import { TIMER_LIMITS, TIMER_SETTINGS_DEFAULTS } from "../../constants";
import "./TimerSettings.css";

function TimerSettings({ isOpen, onClose, onSave }) {
  const [hours, setHours] = useState(TIMER_SETTINGS_DEFAULTS.hours);
  const [minutes, setMinutes] = useState(TIMER_SETTINGS_DEFAULTS.minutes);
  const [seconds, setSeconds] = useState(TIMER_SETTINGS_DEFAULTS.seconds);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      // Focus the first input when modal opens
      const firstInput = document.querySelector("#time-input-hours");
      if (firstInput) {
        firstInput.focus();
      }

      // Trap focus within the modal
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }

        if (e.key === "Tab") {
          const focusableElements = document.querySelectorAll(
            '.timer-settings-modal button, .timer-settings-modal input, .timer-settings-modal select, .timer-settings-modal [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Reset to defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      setHours(TIMER_SETTINGS_DEFAULTS.hours);
      setMinutes(TIMER_SETTINGS_DEFAULTS.minutes);
      setSeconds(TIMER_SETTINGS_DEFAULTS.seconds);
    }
  }, [isOpen]);

  const handleSave = () => {
    // Ensure at least 1 second is set (prevent 00:00:00)
    if (hours === 0 && minutes === 0 && seconds === 0) {
      setSeconds(1);
      onSave(0, 0, 1);
    } else {
      onSave(hours, minutes, seconds);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOverlayClick = (e) => {
    // Close modal when clicking outside
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="timer-settings-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="timer-settings-title"
    >
      <div className="timer-settings-modal">
        <div className="timer-settings-header">
          <h2 id="timer-settings-title">Set Timer</h2>
        </div>

        <div className="timer-settings-content">
          <div
            className="time-inputs"
            role="group"
            aria-label="Timer duration settings"
          >
            <TimeInput
              label="Hours"
              value={hours}
              maxValue={TIMER_LIMITS.MAX_HOURS}
              onChange={setHours}
            />
            <div className="time-separator" aria-hidden="true">
              :
            </div>
            <TimeInput
              label="Minutes"
              value={minutes}
              maxValue={TIMER_LIMITS.MAX_MINUTES}
              onChange={setMinutes}
            />
            <div className="time-separator" aria-hidden="true">
              :
            </div>
            <TimeInput
              label="Seconds"
              value={seconds}
              maxValue={TIMER_LIMITS.MAX_SECONDS}
              onChange={setSeconds}
            />
          </div>
        </div>

        <div className="timer-settings-actions">
          <button
            className="timer-settings-button cancel-button"
            onClick={handleCancel}
            aria-label="Cancel timer settings without saving"
          >
            Cancel
          </button>
          <button
            className="timer-settings-button save-button"
            onClick={handleSave}
            aria-label="Save timer settings and close dialog"
          >
            Set Timer
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerSettings;
