// App.jsx
import Scene from "./components/Scene";
import "./styles/global.css";

function App() {
  return (
    <div className="app">
      <div className="ui-overlay">
        <h1 className="text-title">
          <span>THE</span>
          <span>POMO</span>
        </h1>
        <div className="text-note">Double tap to start</div>
      </div>
      <Scene />
    {/* UI Overlay (나중에 작성되어야 z-index가 먹히기 쉽습니다) */}
      <div className="ui-overlay">
        <h1 className="text-title">
          <span>THE</span>
          <span>POMO</span>
        </h1>
      </div>
    </div>
  );
}

export default App;