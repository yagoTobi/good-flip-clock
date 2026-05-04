import { createContext, useReducer, useCallback, useContext, useMemo } from "react";

const PanelStateContext = createContext();
const PanelActionsContext = createContext();

const initialState = {
  customization: false,
  timerSettings: false,
  pomodoroSettings: false,
  music: false,
  tasks: false,
  notes: false,
};

const FLOATING_PANELS = ["music", "tasks", "notes"];

function panelReducer(state, action) {
  switch (action.type) {
    case "OPEN": {
      const next = { ...state, [action.panel]: true };
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

export function PanelProvider({ children }) {
  const [panels, dispatch] = useReducer(panelReducer, initialState);

  const openPanel = useCallback((panel) => dispatch({ type: "OPEN", panel }), []);
  const closePanel = useCallback((panel) => dispatch({ type: "CLOSE", panel }), []);
  const togglePanel = useCallback((panel) => dispatch({ type: "TOGGLE", panel }), []);
  const closeAll = useCallback(() => dispatch({ type: "CLOSE_ALL" }), []);

  const isAnyModalOpen = panels.customization || panels.timerSettings || panels.pomodoroSettings;
  const isAnyFloatingOpen = panels.music || panels.tasks || panels.notes;

  const state = useMemo(() => ({
    panels,
    isAnyModalOpen,
    isAnyFloatingOpen,
  }), [panels, isAnyModalOpen, isAnyFloatingOpen]);

  const actions = useMemo(() => ({
    openPanel,
    closePanel,
    togglePanel,
    closeAll,
  }), [openPanel, closePanel, togglePanel, closeAll]);

  return (
    <PanelActionsContext.Provider value={actions}>
      <PanelStateContext.Provider value={state}>
        {children}
      </PanelStateContext.Provider>
    </PanelActionsContext.Provider>
  );
}

export function usePanelState() {
  const ctx = useContext(PanelStateContext);
  if (!ctx) throw new Error("usePanelState must be used within PanelProvider");
  return ctx;
}

export function usePanelActions() {
  const ctx = useContext(PanelActionsContext);
  if (!ctx) throw new Error("usePanelActions must be used within PanelProvider");
  return ctx;
}
