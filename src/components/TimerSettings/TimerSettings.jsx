import { useState, useEffect } from "react";
import TimeInput from "./TimeInput";
import { TIMER_LIMITS, TIMER_SETTINGS_DEFAULTS } from "../../constants";
import "./TimerSettings.css";

function calculateTargetTime(hour12, minute, period) {
  const now = new Date();
  let targetHour24 = hour12 % 12;
  if (period === "PM") targetHour24 += 12;

  const target = new Date(now);
  target.setHours(targetHour24, minute, 0, 0);

  // If target is in the past, assume tomorrow
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}

function getEndAtDefaults() {
  const target = new Date(Date.now() + 60 * 60 * 1000);
  return {
    hour: target.getHours() % 12 || 12,
    minute: target.getMinutes(),
    period: target.getHours() >= 12 ? "PM" : "AM",
  };
}

function TimerSettings({ isOpen, onClose, onSave, onSaveEndAt }) {
  const [hours, setHours] = useState(TIMER_SETTINGS_DEFAULTS.hours);
  const [minutes, setMinutes] = useState(TIMER_SETTINGS_DEFAULTS.minutes);
  const [seconds, setSeconds] = useState(TIMER_SETTINGS_DEFAULTS.seconds);

  const [settingsMode, setSettingsMode] = useState("duration");
  const [endAtHour, setEndAtHour] = useState(12);
  const [endAtMinute, setEndAtMinute] = useState(0);
  const [endAtPeriod, setEndAtPeriod] = useState("AM");

  // Auto-focus first input only when modal opens (not on every re-render)
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => {
        const firstInput =
          document.querySelector("#time-input-hours") ||
          document.querySelector("#time-input-hour");
        if (firstInput) firstInput.focus();
      }, 50);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // Keyboard handler (Escape + focus trap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Tab") {
        const focusableElements = document.querySelectorAll(
          '.timer-settings-modal button, .timer-settings-modal input, .timer-settings-modal select, .timer-settings-modal [tabindex]:not([tabindex="-1"])',
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
  }, [isOpen, onClose]);

  // Reset to defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      setHours(TIMER_SETTINGS_DEFAULTS.hours);
      setMinutes(TIMER_SETTINGS_DEFAULTS.minutes);
      setSeconds(TIMER_SETTINGS_DEFAULTS.seconds);
      setSettingsMode("duration");
      const defaults = getEndAtDefaults();
      setEndAtHour(defaults.hour);
      setEndAtMinute(defaults.minute);
      setEndAtPeriod(defaults.period);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (settingsMode === "endAt") {
      const h12 = endAtHour || 12;
      const target = calculateTargetTime(h12, endAtMinute, endAtPeriod);
      onSaveEndAt(target);
      onClose();
      return;
    }

    // Duration mode
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
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getDurationHint = () => {
    const h12 = endAtHour || 12;
    const target = calculateTargetTime(h12, endAtMinute, endAtPeriod);
    const diffMs = target - Date.now();
    const totalMinutes = Math.round(diffMs / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0 && m > 0) return `~${h}h ${m}m from now`;
    if (h > 0) return `~${h}h from now`;
    if (m > 0) return `~${m}m from now`;
    return "~24h from now";
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
          <h2 id="timer-settings-title">Start Timer</h2>
          <div
            className={`timer-mode-toggle${settingsMode === "endAt" ? " end-at" : ""}`}
            role="tablist"
            aria-label="Timer mode"
          >
            <button
              role="tab"
              className={`timer-mode-option${settingsMode === "duration" ? " active" : ""}`}
              onClick={() => setSettingsMode("duration")}
              aria-selected={settingsMode === "duration"}
            >
              Duration
            </button>
            <button
              role="tab"
              className={`timer-mode-option${settingsMode === "endAt" ? " active" : ""}`}
              onClick={() => setSettingsMode("endAt")}
              aria-selected={settingsMode === "endAt"}
            >
              End At
            </button>
          </div>
        </div>

        <div className="timer-settings-content">
          {settingsMode === "duration" ? (
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
          ) : (
            <div
              className="time-inputs end-at-inputs"
              role="group"
              aria-label="End at time settings"
            >
              <TimeInput
                label="Hour"
                value={endAtHour}
                maxValue={12}
                onChange={setEndAtHour}
              />
              <div className="time-separator" aria-hidden="true">
                :
              </div>
              <TimeInput
                label="Minute"
                value={endAtMinute}
                maxValue={59}
                onChange={setEndAtMinute}
              />
              <div
                className={`ampm-toggle${endAtPeriod === "PM" ? " pm" : ""}`}
                role="group"
                aria-label="AM or PM"
              >
                <button
                  className={`ampm-option${endAtPeriod === "AM" ? " active" : ""}`}
                  onClick={() => setEndAtPeriod("AM")}
                  aria-pressed={endAtPeriod === "AM"}
                >
                  AM
                </button>
                <button
                  className={`ampm-option${endAtPeriod === "PM" ? " active" : ""}`}
                  onClick={() => setEndAtPeriod("PM")}
                  aria-pressed={endAtPeriod === "PM"}
                >
                  PM
                </button>
              </div>
            </div>
          )}
          <div
            className={`end-at-hint${settingsMode === "duration" ? " hidden" : ""}`}
            aria-live="polite"
          >
            {settingsMode === "endAt" ? getDurationHint() : "\u00A0"}
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
            aria-label={
              settingsMode === "endAt"
                ? "Start countdown to target time"
                : "Save timer settings and close dialog"
            }
          >
            {settingsMode === "endAt" ? "Start Timer" : "Start Timer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerSettings;
