import { useState, useEffect, useCallback } from 'react';

/**
 * カウントダウンタイマーのカスタムフック
 * @param {number} initialTime - 初期時間（秒）
 * @param {function} onTimeUp - 時間切れ時のコールバック関数
 */
const useTimer = (initialTime, onTimeUp) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // タイマーをスタート
  const startTimer = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  // タイマーを一時停止
  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  // タイマーを再開
  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  // タイマーをリセット
  const resetTimer = useCallback(() => {
    setTime(initialTime);
    setIsActive(false);
    setIsPaused(false);
  }, [initialTime]);

  // 時間を追加（ボーナスタイム）
  const addTime = useCallback((seconds) => {
    setTime(prevTime => prevTime + seconds);
  }, []);

  // タイマーのフォーマット（MM:SS形式）
  const formatTime = useCallback(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [time]);

  // タイマーのロジック
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsActive(false);
            onTimeUp && onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, onTimeUp]);

  return {
    time,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addTime,
    formatTime
  };
};

export default useTimer;
