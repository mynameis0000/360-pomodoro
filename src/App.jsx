// App.jsx
import Scene from "./components/Scene";
import "./styles/global.css";

// App.jsx
function App() {
  return (
    <div className="app">
      <Scene />

      <div className="ui-overlay">
        <div className="text-container">
          <span className="text-small">THE</span>
          <h1 className="text-main">POMO</h1>
          <p className="text-note">DOUBLE TAP TO START</p>
        </div>
      </div>
    </div>
  );
}
export default App;