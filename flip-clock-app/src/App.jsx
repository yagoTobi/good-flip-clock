import { useState } from "react";
import "./App.css";
import FlipClock from "./components/FlipClock/FlipClock";
import ModeSelector from "./components/ModeSelector/ModeSelector";

function App() {
  const [selectedMode, setSelectedMode] = useState("Clock");

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flip Clock</h1>
      </header>

      <main className="app-main">
        <FlipClock mode={selectedMode} />
        <ModeSelector 
          selectedMode={selectedMode} 
          onModeChange={setSelectedMode} 
        />
      </main>
    </div>
  );
}

export default App;
