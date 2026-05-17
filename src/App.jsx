import { useEffect, useRef, useState } from "react";
import Scene from "./components/Scene";
import "./styles/global.css";

const DEFAULT_MINUTES = 25;
const MAX_SECONDS = 3600;

function App() {
  const [started, setStarted] = useState(false);

  const [duration, setDuration] = useState(DEFAULT_MINUTES * 60);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_MINUTES * 60);

  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const tickAudio = useRef(null);
  const alarmAudio = useRef(null);

  /* ------------------------------
   * AUDIO SETUP
   * ----------------------------- */
  useEffect(() => {
    const ticking = new Audio("/sound/ticking.mp3");
    ticking.loop = true;
    ticking.volume = 0.3;

    const alarm = new Audio("/sound/alarm.mp3");
    alarm.loop = true;
    alarm.volume = 0.7;

    tickAudio.current = ticking;
    alarmAudio.current = alarm;

    return () => {
      ticking.pause();
      alarm.pause();
    };
  }, []);

  /* ------------------------------
   * TIMER LOOP
   * ----------------------------- */
  useEffect(() => {
    if (!isRunning) return;

    setIsFinished(false);

    const interval = setInterval(() => {
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

    return () => clearInterval(interval);
  }, [isRunning]);

  /* ------------------------------
   * AUDIO CONTROL
   * ----------------------------- */
  useEffect(() => {
    if (!tickAudio.current || !alarmAudio.current) return;

    // ticking sound
    if (isRunning) {
      tickAudio.current.play().catch(() => {});
    } else {
      tickAudio.current.pause();
      tickAudio.current.currentTime = 0;
    }

    // finish alarm
    if (isFinished) {
      alarmAudio.current.play().catch(() => {});
    } else {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
    }
  }, [isRunning, isFinished]);

  /* ------------------------------
   * HANDLERS
   * ----------------------------- */

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(duration);
  };

  const handleTimeChange = (e) => {
    const minutes = Number(e.target.value);

    if (!minutes || minutes <= 0) return;

    const seconds = minutes * 60;

    setDuration(seconds);
    setTimeLeft(seconds);
  };

  /* ------------------------------
   * VALUES
   * ----------------------------- */

  const displayProgress = timeLeft / MAX_SECONDS;

  return (
    <div className={`app ${isFinished ? "finished" : ""}`}>

      {/* 홀로그램 배경 */}
      <div className="finish-hologram-bg" />

      {/* HEADER */}
      <header className="fixed-header">
        <div className="logo-container">
          <span className="text-small">THE</span>
          <h1 className="text-main">POMO</h1>
        </div>
      </header>

      {/* 3D SCENE */}
      <div className="scene-container">
        <Scene
          progress={displayProgress}
          timeLeft={timeLeft}
          isFinished={isFinished}
        />
      </div>

      {/* UI OVERLAY */}
      <div className="ui-overlay">

        {!started ? (
          <div
            className="landing-screen-click"
            onClick={() => setStarted(true)}
          >
            <p className="text-note">
              CLICK TO START
            </p>
          </div>
        ) : (
          <div className="bottom-ui">

            {isFinished ? (
              <div className="finish-ui">

                <h2 className="finish-text">
                  TIME'S UP!
                </h2>

                <button
                  className="control-button reset"
                  onClick={handleReset}
                >
                  STOP & RESET
                </button>

              </div>
            ) : (
              <div className="input-container">

                {!isRunning && (
                  <>
                    <span className="input-label">
                      SET TIME
                    </span>

                    <input
                      className="time-font-input"
                      type="number"
                      defaultValue={DEFAULT_MINUTES}
                      onChange={handleTimeChange}
                    />
                  </>
                )}

                <button
                  className="control-button"
                  onClick={
                    isRunning
                      ? handleReset
                      : handleStart
                  }
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