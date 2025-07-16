import { useState } from "react";
import "./App.css";
import FlipClock from "./components/FlipClock/FlipClock";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import TimerControls from "./components/TimerControls/TimerControls";
import { useTimer } from "./hooks/useTimer";
import { MODES } from "./constants";

function App() {
  const [selectedMode, setSelectedMode] = useState(MODES.CLOCK);
  const timer = useTimer();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flip Clock</h1>
      </header>

      <main className="app-main">
        <div className="clock-container">
          <FlipClock mode={selectedMode} timer={timer} />
          <TimerControls mode={selectedMode} timer={timer} />
        </div>
        <ModeSelector
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          isTimerRunning={timer.isRunning}
        />
      </main>
    </div>
  );
}

export default App;
