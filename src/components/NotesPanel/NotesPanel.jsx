import { useRef, useEffect, useState } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import "./NotesPanel.css";

function loadNotes() {
  try {
    return localStorage.getItem("flip-clock-notes") ?? "";
  } catch {
    return "";
  }
}

function saveNotes(value) {
  try {
    localStorage.setItem("flip-clock-notes", value);
  } catch {
    // storage unavailable
  }
}

function NotesPanel({ isOpen, onToggle }) {
  const textareaRef = useRef(null);
  // Keep notes state local to prevent parent re-renders on every keystroke
  const [notes, setNotes] = useState(loadNotes);

  const handleNotesChange = (value) => {
    setNotes(value);
    // Debounce localStorage writes for better performance
    if (handleNotesChange.timeoutId) {
      clearTimeout(handleNotesChange.timeoutId);
    }
    handleNotesChange.timeoutId = setTimeout(() => saveNotes(value), 500);
  };

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  return (
    <div className="notes-root">
      <div className={`notes-panel${isOpen ? " panel-open" : ""}`} role="region" aria-label="Quick notes" aria-hidden={!isOpen}>
        <div className="notes-panel-header">
          <span className="notes-panel-label">Notes</span>
          <button
            className="notes-panel-close"
            onClick={onToggle}
            aria-label="Close notes"
            tabIndex={isOpen ? 0 : -1}
          >
            <FaTimes size={12} aria-hidden="true" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          className="notes-textarea"
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Write your thoughts…"
          maxLength={10000}
          spellCheck={false}
          aria-label="Notes"
          tabIndex={isOpen ? 0 : -1}
        />
      </div>

      <button
        className="notes-toggle"
        onClick={onToggle}
        aria-label={isOpen ? "Close notes" : "Open notes"}
        title="Quick notes"
      >
        <FaPencilAlt size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export { loadNotes };
export default NotesPanel;
