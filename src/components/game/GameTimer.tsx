import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useCountdown from '../../hooks/useCountdown';

interface GameTimerProps {
  initialTime: number;
  isActive?: boolean;
  onTimeUp?: () => void;
  onTimeChange?: (remainingTime: number) => void;
  className?: string;
}

const GameTimer: React.FC<GameTimerProps> = ({
  initialTime,
  isActive = false,
  onTimeUp,
  onTimeChange,
  className = ''
}) => {
  const { state, start, pause } = useCountdown({
    initialTime,
    onTimeUp,
    autoStart: isActive,
    interval: 1000
  });

  const { time, isRunning, percentRemaining, formattedTime } = state;

  // タイマーの状態に応じてスタイルを変更
  const getTimerColor = () => {
    if (percentRemaining <= 20) return 'text-red-500';
    if (percentRemaining <= 50) return 'text-yellow-500';
    return 'text-white';
  };

  // タイマーの状態に応じてアニメーションを変更
  const getTimerAnimation = () => {
    if (percentRemaining <= 20) return 'animate-pulse';
    return '';
  };

  // タイマーの進行状況をリスニング
  useEffect(() => {
    if (isActive && !isRunning) {
      start();
    } else if (!isActive && isRunning) {
      pause();
    }
  }, [isActive, isRunning, start, pause]);

  // 親コンポーネントに残り時間の変更を通知
  useEffect(() => {
    onTimeChange?.(time);
  }, [time, onTimeChange]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`text-3xl font-bold font-detective ${getTimerColor()} ${getTimerAnimation()}`}
      >
        {formattedTime}
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mt-1 overflow-hidden">
        <motion.div
          className="h-full bg-detective-secondary"
          initial={{ width: '100%' }}
          animate={{ 
            width: `${percentRemaining}%`,
            backgroundColor: percentRemaining <= 20 
              ? '#EF4444' 
              : percentRemaining <= 50 
                ? '#F59E0B' 
                : '#38BDF8'
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="text-xs text-gray-400 mt-1">
        残り時間
      </div>
    </div>
  );
};

export default GameTimer;