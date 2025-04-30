import React from 'react';
import { motion } from 'framer-motion';
import { GameStage } from '../../types/game';

interface GameStageNavigatorProps {
  currentStage: GameStage;
  availableStages: GameStage[];
  onStageSelect: (stage: GameStage) => void;
  timeRemaining: number;
}

/**
 * ゲームステージナビゲーター
 * 利用可能なステージ間をナビゲートするためのコンポーネント
 */
const GameStageNavigator: React.FC<GameStageNavigatorProps> = ({
  currentStage,
  availableStages,
  onStageSelect,
  timeRemaining
}) => {
  // ステージ名の日本語表示
  const stageNames: Record<GameStage, string> = {
    [GameStage.INTRO]: 'イントロ',
    [GameStage.INVESTIGATION]: '調査',
    [GameStage.QUESTIONING]: '質問',
    [GameStage.EVIDENCE_REVIEW]: '証拠の確認',
    [GameStage.SCIENCE_LEARNING]: '科学知識',
    [GameStage.BACKSTORY_PREDICTION]: '裏ストーリー予測',
    [GameStage.SOLVING]: '解決',
    [GameStage.ETHICAL_CHOICE]: '倫理的選択',
    [GameStage.CONCLUSION]: '結論'
  };

  // ステージアイコン
  const stageIcons: Record<GameStage, string> = {
    [GameStage.INTRO]: '📖',
    [GameStage.INVESTIGATION]: '🔍',
    [GameStage.QUESTIONING]: '❓',
    [GameStage.EVIDENCE_REVIEW]: '📊',
    [GameStage.SCIENCE_LEARNING]: '🧪',
    [GameStage.BACKSTORY_PREDICTION]: '🔮',
    [GameStage.SOLVING]: '💡',
    [GameStage.ETHICAL_CHOICE]: '⚖️',
    [GameStage.CONCLUSION]: '🏆'
  };

  // タイムアウトの場合は警告表示
  const isTimeWarning = timeRemaining <= 60; // 残り1分以下

  return (
    <div className="bg-detective-dark rounded-md p-2 mb-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto hide-scrollbar">
          {availableStages.map((stage) => (
            <button
              key={stage}
              onClick={() => onStageSelect(stage)}
              className={`px-3 py-1 text-sm rounded-md whitespace-nowrap transition-colors ${
                currentStage === stage
                  ? 'bg-detective-primary text-white'
                  : 'bg-detective-dark/50 text-gray-300 hover:bg-detective-dark/80'
              }`}
              disabled={currentStage === stage}
            >
              <span className="mr-1">{stageIcons[stage]}</span>
              {stageNames[stage]}
            </button>
          ))}
        </div>

        {/* タイマー表示 */}
        <div
          className={`text-sm font-mono font-bold px-3 py-1 rounded-md ${
            isTimeWarning
              ? 'bg-red-500/20 text-red-400 animate-pulse'
              : 'bg-detective-dark/40 text-gray-300'
          }`}
        >
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default GameStageNavigator;