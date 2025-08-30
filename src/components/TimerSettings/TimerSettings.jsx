import { useState, useEffect } from "react";
import TimeInput from "./TimeInput";
import { TIMER_LIMITS, TIMER_SETTINGS_DEFAULTS } from "../../constants";
import "./TimerSettings.css";

function TimerSettings({ isOpen, onClose, onSave, currentTimer }) {
  const [hours, setHours] = useState(TIMER_SETTINGS_DEFAULTS.hours);
  const [minutes, setMinutes] = useState(TIMER_SETTINGS_DEFAULTS.minutes);
  const [seconds, setSeconds] = useState(TIMER_SETTINGS_DEFAULTS.seconds);

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
    <div className="timer-settings-overlay" onClick={handleOverlayClick}>
      <div className="timer-settings-modal">
        <div className="timer-settings-header">
          <h2>Set Timer</h2>
        </div>

        <div className="timer-settings-content">
          <div className="time-inputs">
            <TimeInput
              label="Hours"
              value={hours}
              maxValue={TIMER_LIMITS.MAX_HOURS}
              onChange={setHours}
            />
            <div className="time-separator">:</div>
            <TimeInput
              label="Minutes"
              value={minutes}
              maxValue={TIMER_LIMITS.MAX_MINUTES}
              onChange={setMinutes}
            />
            <div className="time-separator">:</div>
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
            className="settings-button cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button className="settings-button save-button" onClick={handleSave}>
            Set Timer
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerSettings;
