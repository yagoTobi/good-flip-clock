import { useState, useEffect } from "react";
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
  const [timerState, setTimerState] = useState("stopped");
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const handleTimerComplete = () => {
    setTimerState("stopped");
    console.log("Timer completed!");
  };

  const handleTimerStateChange = (newState) => {
    if (newState === "running" && timerState === "stopped" && timerHours === 0 && timerMinutes === 0 && timerSeconds === 0) {
      // Reset to 10:00 when starting from completed state
      setTimerMinutes(10);
      setTimerSeconds(0);
    }
    setTimerState(newState);
  };

  // Timer countdown logic at App level - runs continuously
  useEffect(() => {
    if (timerState !== "running") return;
    
    const timer = setInterval(() => {
      if (timerSeconds > 0) {
        setTimerSeconds(timerSeconds - 1);
      } else if (timerMinutes > 0) {
        setTimerMinutes(timerMinutes - 1);
        setTimerSeconds(59);
      } else if (timerHours > 0) {
        setTimerHours(timerHours - 1);
        setTimerMinutes(59);
        setTimerSeconds(59);
      } else {
        // Timer complete
        handleTimerComplete();
        return;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerHours, timerMinutes, timerSeconds, timerState]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flip Clock</h1>
      </header>

      <main className="app-main">
        <div className="clock-container">
          <FlipClock 
            mode={selectedMode} 
            timerState={timerState}
            timerHours={timerHours}
            timerMinutes={timerMinutes}
            timerSeconds={timerSeconds}
            onTimerComplete={handleTimerComplete}
            onTimerUpdate={(hours, minutes, seconds) => {
              setTimerHours(hours);
              setTimerMinutes(minutes);
              setTimerSeconds(seconds);
            }}
          />
          <TimerControls 
            mode={selectedMode} 
            timerState={timerState}
            onTimerStateChange={handleTimerStateChange}
          />
        </div>
        <ModeSelector
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          isTimerRunning={timerState === "running"}
        />
      </main>
    </div>
  );
}

export default App;
