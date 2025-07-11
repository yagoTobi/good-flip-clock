import { useState } from "react";
import "./App.css";
import FlipClock from "./components/FlipClock/FlipClock";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import TimerControls from "./components/TimerControls/TimerControls";

/* 
The way that this is currently working is that we have App.jsx as the Master Controller, which holds the 
selectedMode state - Clock or Timer, and we pass the mode prop down to the child components. 

We have the display on the screen which is the FlipClock as the main component and then the TimerControls to 
switch from one to the other. 
*/

function App() {
  const [selectedMode, setSelectedMode] = useState("Clock");

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flip Clock</h1>
      </header>

      <main className="app-main">
        <div className="clock-container">
          <FlipClock mode={selectedMode} />
          <TimerControls mode={selectedMode} />
        </div>
        <ModeSelector
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
        />
      </main>
    </div>
  );
}

export default App;
