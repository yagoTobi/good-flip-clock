import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PomodoroSettings from "../PomodoroSettings";
import {
  POMODORO_PRESETS,
  POMODORO_SETTINGS_DEFAULTS,
} from "../../../constants";

describe("PomodoroSettings", () => {
  let mockOnClose, mockOnSave;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnSave = jest.fn();
  });

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    currentSettings: POMODORO_SETTINGS_DEFAULTS,
  };

  test("renders when isOpen is true", () => {
    render(<PomodoroSettings {...defaultProps} />);

    expect(screen.getByText("Pomodoro Settings")).toBeInTheDocument();
    expect(screen.getByText("Presets")).toBeInTheDocument();
    expect(screen.getByText("Durations (minutes)")).toBeInTheDocument();
  });

  test("does not render when isOpen is false", () => {
    render(<PomodoroSettings {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Pomodoro Settings")).not.toBeInTheDocument();
  });

  test("renders all preset buttons", () => {
    render(<PomodoroSettings {...defaultProps} />);

    Object.values(POMODORO_PRESETS).forEach((preset) => {
      expect(screen.getByText(preset.name)).toBeInTheDocument();
    });
  });

  test("shows active preset button", () => {
    const settings = { ...POMODORO_SETTINGS_DEFAULTS, preset: "EXTENDED" };
    render(<PomodoroSettings {...defaultProps} currentSettings={settings} />);

    const extendedButton = screen.getByText("50:10").closest("button");
    expect(extendedButton).toHaveClass("active");
  });

  test("updates durations when preset is selected", () => {
    render(<PomodoroSettings {...defaultProps} />);

    const deepWorkButton = screen.getByText("90:20");
    fireEvent.click(deepWorkButton);

    expect(screen.getByDisplayValue("90")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(screen.getByDisplayValue("45")).toBeInTheDocument();
  });

  test("switches to custom preset when duration is manually changed", () => {
    render(<PomodoroSettings {...defaultProps} />);

    const focusInput = screen.getByLabelText("Focus Session");
    fireEvent.change(focusInput, { target: { value: "30" } });

    const customButton = screen.getByText("Custom").closest("button");
    expect(customButton).toHaveClass("active");
  });

  test("validates focus duration input", async () => {
    render(<PomodoroSettings {...defaultProps} />);

    const focusInput = screen.getByLabelText("Focus Session");
    fireEvent.change(focusInput, { target: { value: "150" } });

    const saveButton = screen.getByText("Save Settings");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Focus duration must be between 1 and 120 minutes")
      ).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("validates short break duration input", async () => {
    render(<PomodoroSettings {...defaultProps} />);

    const shortBreakInput = screen.getByLabelText("Short Break");
    fireEvent.change(shortBreakInput, { target: { value: "35" } });

    const saveButton = screen.getByText("Save Settings");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Short break must be between 1 and 30 minutes")
      ).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("validates long break duration input", async () => {
    render(<PomodoroSettings {...defaultProps} />);

    const longBreakInput = screen.getByLabelText("Long Break");
    fireEvent.change(longBreakInput, { target: { value: "70" } });

    const saveButton = screen.getByText("Save Settings");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Long break must be between 1 and 60 minutes")
      ).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("toggles auto-advance setting", () => {
    render(<PomodoroSettings {...defaultProps} />);

    const autoAdvanceCheckbox = screen.getByLabelText("Auto-advance sessions");
    expect(autoAdvanceCheckbox).toBeChecked();

    fireEvent.click(autoAdvanceCheckbox);
    expect(autoAdvanceCheckbox).not.toBeChecked();
  });

  test("saves settings with valid inputs", () => {
    render(<PomodoroSettings {...defaultProps} />);

    const focusInput = screen.getByLabelText("Focus Session");
    const shortBreakInput = screen.getByLabelText("Short Break");
    const longBreakInput = screen.getByLabelText("Long Break");
    const autoAdvanceCheckbox = screen.getByLabelText("Auto-advance sessions");

    fireEvent.change(focusInput, { target: { value: "30" } });
    fireEvent.change(shortBreakInput, { target: { value: "8" } });
    fireEvent.change(longBreakInput, { target: { value: "20" } });
    fireEvent.click(autoAdvanceCheckbox);

    const saveButton = screen.getByText("Save Settings");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      preset: "CUSTOM",
      focusDuration: 30,
      shortBreakDuration: 8,
      longBreakDuration: 20,
      autoAdvance: false,
      longBreakInterval: 4,
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("cancels without saving", () => {
    render(<PomodoroSettings {...defaultProps} />);

    const focusInput = screen.getByLabelText("Focus Session");
    fireEvent.change(focusInput, { target: { value: "30" } });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("closes when clicking overlay", () => {
    render(<PomodoroSettings {...defaultProps} />);

    const overlay = document.querySelector(".pomodoro-settings-overlay");
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("initializes with current settings", () => {
    const customSettings = {
      preset: "EXTENDED",
      focusDuration: 50,
      shortBreakDuration: 10,
      longBreakDuration: 30,
      autoAdvance: false,
    };

    render(
      <PomodoroSettings {...defaultProps} currentSettings={customSettings} />
    );

    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByLabelText("Auto-advance sessions")).not.toBeChecked();

    const extendedButton = screen.getByText("50:10").closest("button");
    expect(extendedButton).toHaveClass("active");
  });
});
