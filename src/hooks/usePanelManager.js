import { useReducer, useCallback } from "react";

const initialState = {
  customization: false,
  timerSettings: false,
  pomodoroSettings: false,
  music: false,
  tasks: false,
  notes: false,
};

// Floating panels are mutually exclusive with each other
const FLOATING_PANELS = ["music", "tasks", "notes"];

function panelReducer(state, action) {
  switch (action.type) {
    case "OPEN": {
      const next = { ...state, [action.panel]: true };
      // If opening a floating panel, close the other floating panels
      if (FLOATING_PANELS.includes(action.panel)) {
        FLOATING_PANELS.forEach((p) => {
          if (p !== action.panel) next[p] = false;
        });
      }
      return next;
    }
    case "CLOSE":
      return { ...state, [action.panel]: false };
    case "TOGGLE": {
      const isOpening = !state[action.panel];
      if (isOpening) {
        const next = { ...state, [action.panel]: true };
        if (FLOATING_PANELS.includes(action.panel)) {
          FLOATING_PANELS.forEach((p) => {
            if (p !== action.panel) next[p] = false;
          });
        }
        return next;
      }
      return { ...state, [action.panel]: false };
    }
    case "CLOSE_ALL":
      return initialState;
    default:
      return state;
  }
}

export function usePanelManager() {
  const [panels, dispatch] = useReducer(panelReducer, initialState);

  const openPanel = useCallback((panel) => dispatch({ type: "OPEN", panel }), []);
  const closePanel = useCallback((panel) => dispatch({ type: "CLOSE", panel }), []);
  const togglePanel = useCallback((panel) => dispatch({ type: "TOGGLE", panel }), []);
  const closeAll = useCallback(() => dispatch({ type: "CLOSE_ALL" }), []);

  // Check if any modal-type panel is open (blocks gestures/auto-hide)
  const isAnyModalOpen = panels.customization || panels.timerSettings || panels.pomodoroSettings;
  // Check if any floating panel is open (suppresses auto-hide timer)
  const isAnyFloatingOpen = panels.music || panels.tasks || panels.notes;
  const isAnyOpen = isAnyModalOpen || isAnyFloatingOpen;

  return {
    panels,
    openPanel,
    closePanel,
    togglePanel,
    closeAll,
    isAnyModalOpen,
    isAnyFloatingOpen,
    isAnyOpen,
  };
}
