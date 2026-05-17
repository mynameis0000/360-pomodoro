import { useEffect, useState } from "react";
import Scene from "./components/Scene";
import "./styles/global.css";

function App() {
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(25 / 60);

  // 1. Enter 시작
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") setStarted(true);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 2. 카운트다운 (0.1초 단위)
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsRunning(false);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // 3. 실시간 진행률 업데이트
  useEffect(() => {
    // 60분(3600초) 기준 비율
    setDisplayProgress(timeLeft / 3600);
  }, [timeLeft]);

  return (
    <div className="app" style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Scene 컴포넌트에 필요한 값이 전달되는지 확인 */}
      <Scene progress={displayProgress} timeLeft={timeLeft} />

      {!started && (
        <div className="landing-screen" onClick={() => setStarted(true)} style={{ zIndex: 10 }}>
          <div className="text-container">
            <span className="text-small">THE</span>
            <h1 className="text-main">POMO</h1>
            <p className="text-note">CLICK OR ENTER TO START</p>
          </div>
        </div>
      )}

      {started && (
        <div className="bottom-ui" style={{ zIndex: 10 }}>
          {!isRunning && (
            <div className="input-container">
              <span className="text-small">SET TIME</span>
              <input
                className="time-font-input"
                type="number"
                min="0"
                max="60"
                defaultValue={25}
                onChange={(e) => {
                  const mins = Number(e.target.value);
                  setDuration(mins * 60);
                  setTimeLeft(mins * 60);
                  setDisplayProgress(mins / 60);
                }}
              />
            </div>
          )}
          <div className="controls">
            <button className="control-button" onClick={() => isRunning ? (setIsRunning(false), setTimeLeft(duration)) : setIsRunning(true)}>
              {isRunning ? "RESET" : "START"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;