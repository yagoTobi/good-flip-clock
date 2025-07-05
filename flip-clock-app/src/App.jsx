import "./App.css";
import FlipClock from "./components/FlipClock/FlipClock";
import ModeSelector from "./components/ModeSelector/ModeSelector";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Flip Clock</h1>
      </header>

      <main className="app-main">
        <FlipClock />
        <ModeSelector />
      </main>
    </div>
  );
}

export default App;
