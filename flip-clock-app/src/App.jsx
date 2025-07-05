import "./App.css"; // Import the App.css file for styles
import FlipClock from "./components/FlipClock/FlipClock";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Flip Clock</h1>
      </header>

      <main className="app-main">
        <FlipClock />
        <p>Currently building our flip clock...</p>
      </main>
    </div>
  );
}

export default App;
