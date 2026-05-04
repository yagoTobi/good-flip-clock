import { useState, useRef } from "react";
import { FaTasks, FaPlus, FaTimes, FaCheck } from "react-icons/fa";
import "./TaskList.css";

const DEFAULT_TASKS = [
  { id: 1, text: "Review today's notes", done: false },
  { id: 2, text: "Take a 5-min break", done: false },
  { id: 3, text: "Plan tomorrow", done: false },
];

function loadTasks() {
  try {
    const saved = localStorage.getItem("flip-clock-tasks");
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : DEFAULT_TASKS;
    }
    return DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS;
  }
}

function TaskList({ isOpen, onToggle }) {
  const [tasks, setTasks] = useState(loadTasks);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const saveTasks = (next) => {
    setTasks(next);
    try {
      localStorage.setItem("flip-clock-tasks", JSON.stringify(next));
    } catch {
      // storage unavailable
    }
  };

  const addTask = () => {
    const text = inputValue.trim();
    if (!text) return;
    saveTasks([...tasks, { id: Date.now(), text, done: false }]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const toggleTask = (id) => {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="task-list-root">
      <div className={`task-panel${isOpen ? " panel-open" : ""}`} role="region" aria-label="Task list" aria-hidden={!isOpen}>
        <div className="task-panel-header">
          <span className="task-panel-label">My Tasks</span>
          <button
            className="task-panel-close"
            onClick={onToggle}
            aria-label="Close task list"
            tabIndex={isOpen ? 0 : -1}
          >
            <FaTimes size={12} aria-hidden="true" />
          </button>
        </div>

        <div className="task-items">
          {tasks.length === 0 && (
            <p className="task-empty">No tasks yet. Add one below!</p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item${task.done ? " done" : ""}`}
            >
              <button
                className="task-check"
                onClick={() => toggleTask(task.id)}
                aria-label={
                  task.done ? "Mark as incomplete" : "Mark as complete"
                }
                tabIndex={isOpen ? 0 : -1}
              >
                {task.done && <FaCheck size={7} aria-hidden="true" />}
              </button>
              <span className="task-text">{task.text}</span>
              <button
                className="task-delete"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
                tabIndex={isOpen ? 0 : -1}
              >
                <FaTimes size={10} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="task-add-row">
          <input
            ref={inputRef}
            className="task-input"
            type="text"
            placeholder="Add a task…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={60}
            aria-label="New task"
            tabIndex={isOpen ? 0 : -1}
          />
          <button
            className="task-add-btn"
            onClick={addTask}
            disabled={!inputValue.trim()}
            aria-label="Add task"
            tabIndex={isOpen ? 0 : -1}
          >
            <FaPlus size={11} aria-hidden="true" />
          </button>
        </div>
      </div>

      <button
        className="task-toggle"
        onClick={onToggle}
        aria-label={isOpen ? "Close task list" : "Open task list"}
        title="My tasks"
      >
        <FaTasks size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export default TaskList;
