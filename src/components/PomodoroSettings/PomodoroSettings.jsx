import { useState, useEffect } from "react";
import {
  POMODORO_PRESETS,
  POMODORO_SETTINGS_DEFAULTS,
  POMODORO_DEFAULTS,
} from "../../constants";
import "./PomodoroSettings.css";

function PomodoroSettings({ isOpen, onClose, onSave, currentSettings }) {
  const [preset, setPreset] = useState(POMODORO_SETTINGS_DEFAULTS.preset);
  const [focusDuration, setFocusDuration] = useState(
    POMODORO_SETTINGS_DEFAULTS.focusDuration
  );
  const [shortBreakDuration, setShortBreakDuration] = useState(
    POMODORO_SETTINGS_DEFAULTS.shortBreakDuration
  );
  const [longBreakDuration, setLongBreakDuration] = useState(
    POMODORO_SETTINGS_DEFAULTS.longBreakDuration
  );
  const [autoAdvance, setAutoAdvance] = useState(
    POMODORO_SETTINGS_DEFAULTS.autoAdvance
  );
  const [errors, setErrors] = useState({});

  // Initialize with current settings when modal opens
  useEffect(() => {
    if (isOpen && currentSettings) {
      setPreset(currentSettings.preset || POMODORO_SETTINGS_DEFAULTS.preset);
      setFocusDuration(
        currentSettings.focusDuration ||
          POMODORO_SETTINGS_DEFAULTS.focusDuration
      );
      setShortBreakDuration(
        currentSettings.shortBreakDuration ||
          POMODORO_SETTINGS_DEFAULTS.shortBreakDuration
      );
      setLongBreakDuration(
        currentSettings.longBreakDuration ||
          POMODORO_SETTINGS_DEFAULTS.longBreakDuration
      );
      setAutoAdvance(
        currentSettings.autoAdvance !== undefined
          ? currentSettings.autoAdvance
          : POMODORO_SETTINGS_DEFAULTS.autoAdvance
      );
      setErrors({});
    }
  }, [isOpen, currentSettings]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      // Focus the first preset button when modal opens
      const firstPresetButton = document.querySelector(".preset-button");
      if (firstPresetButton) {
        firstPresetButton.focus();
      }

      // Trap focus within the modal
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          handleCancel();
        }

        if (e.key === "Tab") {
          const focusableElements = document.querySelectorAll(
            '.pomodoro-settings-modal button, .pomodoro-settings-modal input, .pomodoro-settings-modal select, .pomodoro-settings-modal [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen]);

  const validateDuration = (value, min = 1, max = 120) => {
    const num = parseInt(value);
    if (isNaN(num) || num < min || num > max) {
      return false;
    }
    return true;
  };

  const handlePresetChange = (presetKey) => {
    setPreset(presetKey);
    if (presetKey !== "CUSTOM") {
      const presetConfig = POMODORO_PRESETS[presetKey];
      setFocusDuration(presetConfig.focusDuration);
      setShortBreakDuration(presetConfig.shortBreakDuration);
      setLongBreakDuration(presetConfig.longBreakDuration);
      setErrors({});
    }
  };

  const handleDurationChange = (type, value) => {
    const numValue = parseInt(value) || 0;

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [type]: null }));

    // Switch to custom preset when manually changing durations
    if (preset !== "CUSTOM") {
      setPreset("CUSTOM");
    }

    switch (type) {
      case "focus":
        setFocusDuration(numValue);
        break;
      case "shortBreak":
        setShortBreakDuration(numValue);
        break;
      case "longBreak":
        setLongBreakDuration(numValue);
        break;
    }
  };

  const validateAllInputs = () => {
    const newErrors = {};

    if (!validateDuration(focusDuration, 1, 120)) {
      newErrors.focus = "Focus duration must be between 1 and 120 minutes";
    }

    if (!validateDuration(shortBreakDuration, 1, 30)) {
      newErrors.shortBreak = "Short break must be between 1 and 30 minutes";
    }

    if (!validateDuration(longBreakDuration, 1, 60)) {
      newErrors.longBreak = "Long break must be between 1 and 60 minutes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateAllInputs()) {
      return;
    }

    const settings = {
      preset,
      focusDuration,
      shortBreakDuration,
      longBreakDuration,
      autoAdvance,
      longBreakInterval: POMODORO_DEFAULTS.LONG_BREAK_INTERVAL,
    };

    onSave(settings);
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

  if (!isOpen) return null;

  return (
    <div className="pomodoro-settings-overlay" onClick={handleOverlayClick}>
      <div
        className="pomodoro-settings-modal"
        role="dialog"
        aria-labelledby="pomodoro-settings-title"
      >
        <div className="pomodoro-settings-header">
          <h2 id="pomodoro-settings-title">Pomodoro Settings</h2>
        </div>

        <div className="pomodoro-settings-content">
          {/* Preset Selection */}
          <div className="settings-section">
            <h3>Presets</h3>
            <div className="preset-buttons">
              {Object.entries(POMODORO_PRESETS).map(([key, config]) => (
                <button
                  key={key}
                  className={`preset-button ${preset === key ? "active" : ""}`}
                  onClick={() => handlePresetChange(key)}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Inputs */}
          <div className="settings-section">
            <h3>Durations (minutes)</h3>
            <div className="duration-inputs">
              <div className="duration-input-group">
                <label htmlFor="focus-duration">Focus Session</label>
                <input
                  id="focus-duration"
                  type="number"
                  min="1"
                  max="120"
                  value={focusDuration}
                  onChange={(e) =>
                    handleDurationChange("focus", e.target.value)
                  }
                  className={errors.focus ? "error" : ""}
                />
                {errors.focus && (
                  <span className="error-message">{errors.focus}</span>
                )}
              </div>

              <div className="duration-input-group">
                <label htmlFor="short-break-duration">Short Break</label>
                <input
                  id="short-break-duration"
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakDuration}
                  onChange={(e) =>
                    handleDurationChange("shortBreak", e.target.value)
                  }
                  className={errors.shortBreak ? "error" : ""}
                />
                {errors.shortBreak && (
                  <span className="error-message">{errors.shortBreak}</span>
                )}
              </div>

              <div className="duration-input-group">
                <label htmlFor="long-break-duration">Long Break</label>
                <input
                  id="long-break-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakDuration}
                  onChange={(e) =>
                    handleDurationChange("longBreak", e.target.value)
                  }
                  className={errors.longBreak ? "error" : ""}
                />
                {errors.longBreak && (
                  <span className="error-message">{errors.longBreak}</span>
                )}
              </div>
            </div>
          </div>

          {/* Auto-advance Toggle */}
          <div className="settings-section">
            <div className="toggle-group">
              <label htmlFor="auto-advance" className="toggle-label">
                Auto-advance sessions
              </label>
              <input
                id="auto-advance"
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>
            <p className="toggle-description">
              Automatically start the next session when current one ends
            </p>
          </div>
        </div>

        <div className="pomodoro-settings-actions">
          <button
            className="settings-button cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="settings-button save-button"
            onClick={handleSave}
            disabled={Object.keys(errors).length > 0}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default PomodoroSettings;
