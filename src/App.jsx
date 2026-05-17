import { useEffect, useState, useRef } from "react";
import Scene from "./components/Scene";
import "./styles/global.css";

function App() {
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(25 / 3600);

  const tickAudio = useRef(null);
  const alarmAudio = useRef(null);

  useEffect(() => {
    tickAudio.current = new Audio("/sound/ticking.mp3");
    tickAudio.current.loop = true;
    tickAudio.current.volume = 0.3;
    alarmAudio.current = new Audio("/sound/alarm.mp3");
    alarmAudio.current.loop = true;
    alarmAudio.current.volume = 0.7;
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      setIsFinished(false);
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(interval);
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) tickAudio.current.play().catch(() => {});
    else tickAudio.current.pause();

    if (isFinished) alarmAudio.current.play().catch(() => {});
    else {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
    }
  }, [isRunning, isFinished]);

  useEffect(() => {
    setDisplayProgress(timeLeft / 3600);
  }, [timeLeft]);

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(duration);
  };

  return (
    <div className="app">
      {/* 고정 헤더: started와 무관하게 항상 상단에 존재 */}
      <header className="fixed-header">
        <div className="logo-container">
          <span className="text-small">THE</span>
          <h1 className="text-main">POMO</h1>
        </div>
      </header>

      {/* 3D 레이어 */}
      <div className="scene-container">
        <Scene progress={displayProgress} timeLeft={timeLeft} isFinished={isFinished} />
      </div>

      {/* UI 오버레이 */}
      <div className="ui-overlay">
        {!started ? (
          <div className="landing-screen-click" onClick={() => setStarted(true)}>
            <p className="text-note">CLICK TO START</p>
          </div>
        ) : (
          <div className="bottom-ui">
            {isFinished ? (
              <div className="finish-ui">
                <h2 className="finish-text">TIME'S UP!</h2>
                <button className="control-button reset" onClick={handleReset}>STOP & RESET</button>
              </div>
            ) : (
              <div className="input-container">
                {!isRunning && (
                  <>
                    <span className="input-label">SET TIME</span>
                    <input
                      className="time-font-input"
                      type="number"
                      defaultValue={25}
                      onChange={(e) => {
                        const mins = Number(e.target.value);
                        setDuration(mins * 60);
                        setTimeLeft(mins * 60);
                      }}
                    />
                  </>
                )}
                <button 
                  className="control-button" 
                  onClick={() => isRunning ? handleReset() : setIsRunning(true)}
                >
                  {isRunning ? "RESET" : "START"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;