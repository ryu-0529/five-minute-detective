import { useState, useEffect, useCallback } from 'react';

interface UseTimerProps {
  initialTime: number;
  onTimeUp?: () => void;
}

interface UseTimerResult {
  time: number;
  isActive: boolean;
  isPaused: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  addTime: (seconds: number) => void;
  formatTime: () => string;
}

/**
 * カウントダウンタイマーのカスタムフック
 * @param initialTime - 初期時間（秒）
 * @param onTimeUp - 時間切れ時のコールバック関数
 */
const useTimer = ({ initialTime, onTimeUp }: UseTimerProps): UseTimerResult => {
  const [time, setTime] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // タイマーをスタート
  const startTimer = useCallback((): void => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  // タイマーを一時停止
  const pauseTimer = useCallback((): void => {
    setIsPaused(true);
  }, []);

  // タイマーを再開
  const resumeTimer = useCallback((): void => {
    setIsPaused(false);
  }, []);

  // タイマーをリセット
  const resetTimer = useCallback((): void => {
    setTime(initialTime);
    setIsActive(false);
    setIsPaused(false);
  }, [initialTime]);

  // 時間を追加（ボーナスタイム）
  const addTime = useCallback((seconds: number): void => {
    setTime(prevTime => prevTime + seconds);
  }, []);

  // タイマーのフォーマット（MM:SS形式）
  const formatTime = useCallback((): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [time]);

  // タイマーのロジック
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            if (interval) clearInterval(interval);
            setIsActive(false);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
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
