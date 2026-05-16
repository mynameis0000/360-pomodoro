import { useEffect, useRef, useState } from "react";

export default function usePomodoro(
  duration = 1500
) {

  const [isRunning, setIsRunning] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(duration);

  const startTimeRef = useRef(null);

  const animationRef = useRef(null);



  useEffect(() => {

    if (!isRunning) return;

    // 시작 기준 시간
    startTimeRef.current =
      Date.now() - ((duration - timeLeft) * 1000);



    const update = () => {

      const elapsed =
        (Date.now() - startTimeRef.current) / 1000;

      const remaining =
        Math.max(duration - elapsed, 0);

      setTimeLeft(remaining);

      if (remaining > 0) {
        animationRef.current =
          requestAnimationFrame(update);
      }

    };



    animationRef.current =
      requestAnimationFrame(update);



    return () => {
      cancelAnimationFrame(
        animationRef.current
      );
    };

  }, [isRunning]);



  const reset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };



  return {
    timeLeft,
    progress: timeLeft / duration,
    isRunning,
    setIsRunning,
    reset
  };
}