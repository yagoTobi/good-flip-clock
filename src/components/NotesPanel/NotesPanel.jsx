import { useRef, useEffect } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import "./NotesPanel.css";

function loadNotes() {
  try {
    return localStorage.getItem("flip-clock-notes") ?? "";
  } catch {
    return "";
  }
}

function NotesPanel({ isOpen, onToggle, notes, onNotesChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  return (
    <div className="notes-root">
      {isOpen && (
        <div className="notes-panel" role="region" aria-label="Quick notes">
          <div className="notes-panel-header">
            <span className="notes-panel-label">Notes</span>
            <button
              className="notes-panel-close"
              onClick={onToggle}
              aria-label="Close notes"
            >
              <FaTimes size={12} aria-hidden="true" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className="notes-textarea"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Write your thoughts…"
            maxLength={10000}
          spellCheck={false}
            aria-label="Notes"
          />
        </div>
      )}

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
