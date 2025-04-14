import { useState, useEffect, useCallback } from 'react';

interface UseCountdownOptions {
  initialTime: number;
  onTimeUp?: () => void;
  autoStart?: boolean;
  interval?: number;
}

interface CountdownState {
  time: number;
  isRunning: boolean;
  isComplete: boolean;
  percentRemaining: number;
  formattedTime: string;
}

/**
 * カウントダウンタイマーのカスタムフック
 * @param options タイマーの設定オプション
 * @returns タイマーの状態と操作メソッド
 */
export const useCountdown = ({
  initialTime,
  onTimeUp,
  autoStart = false,
  interval = 1000
}: UseCountdownOptions): {
  state: CountdownState;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  addTime: (seconds: number) => void;
} => {
  const [time, setTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // 残り時間のパーセンテージ計算
  const percentRemaining = Math.max(0, Math.round((time / initialTime) * 100));

  // 時間のフォーマット (MM:SS)
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // タイマーの開始
  const start = (): void => {
    if (time > 0 && !isRunning) {
      setIsRunning(true);
      setIsComplete(false);
    }
  };

  // タイマーの一時停止
  const pause = (): void => {
    setIsRunning(false);
  };

  // タイマーのリセット
  const reset = (newTime?: number): void => {
    setIsRunning(false);
    setTime(newTime ?? initialTime);
    setIsComplete(false);
  };

  // 時間の追加 (ボーナス時間など)
  const addTime = (seconds: number): void => {
    setTime(prev => prev + seconds);
    // 時間が追加された場合、完了状態をリセット
    if (isComplete && seconds > 0) {
      setIsComplete(false);
    }
  };

  // タイマーの実行
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isRunning && time > 0) {
      timerId = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime - 1;
          // 時間切れの処理
          if (newTime <= 0) {
            setIsRunning(false);
            setIsComplete(true);
            onTimeUp?.();
            return 0;
          }
          return newTime;
        });
      }, interval);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, time, interval, onTimeUp]);

  return {
    state: {
      time,
      isRunning,
      isComplete,
      percentRemaining,
      formattedTime: formatTime(time)
    },
    start,
    pause,
    reset,
    addTime
  };
};

export default useCountdown;