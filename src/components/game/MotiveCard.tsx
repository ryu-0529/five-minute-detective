import React from 'react';
import { motion } from 'framer-motion';
import { MotiveCardPanel } from '../../types/game';

interface MotiveCardProps {
  suspectName: string;
  suspectId: string;
  panels: MotiveCardPanel[];
  revealedPanels: number[];
}

/**
 * 動機カードコンポーネント
 * 6つのパネルから構成され、特定の質問によって徐々に明かされていく
 */
const MotiveCard: React.FC<MotiveCardProps> = ({
  suspectName,
  suspectId,
  panels,
  revealedPanels,
}) => {
  // パネルのフリップアニメーション
  const flipVariants = {
    hidden: { rotateY: 180, opacity: 0 },
    visible: (i: number) => ({
      rotateY: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    }),
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
        {suspectName}の動機カード
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        {revealedPanels.length === 0
          ? '質問を通じてキャラクターの裏ストーリーを明らかにしていきましょう。'
          : revealedPanels.length === panels.length
          ? '全ての裏ストーリーが明らかになりました！'
          : `${revealedPanels.length}/${panels.length} パネル解放済み`}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
        {panels.map((panel, index) => {
          const isRevealed = revealedPanels.includes(panel.id);
          return (
            <motion.div
              key={`${suspectId}-panel-${panel.id}`}
              className={`relative aspect-[3/2] rounded-md overflow-hidden shadow-sm ${
                isRevealed ? 'bg-detective-primary/10' : 'bg-gray-200'
              }`}
              custom={index}
              initial={isRevealed ? 'visible' : 'hidden'}
              animate={isRevealed ? 'visible' : 'hidden'}
              variants={flipVariants}
            >
              {isRevealed ? (
                <div className="p-2 h-full flex items-center justify-center text-center text-sm">
                  {panel.content}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="text-2xl">?</span>
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-4 h-4 flex items-center justify-center bg-detective-dark text-white text-xs rounded-full">
                {panel.id}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* コンプリート報酬 */}
      {revealedPanels.length === panels.length && (
        <div className="mt-3 p-2 bg-detective-accent/20 border border-detective-accent rounded-md text-center">
          <span className="text-sm font-bold text-detective-dark">
            コンプリートボーナス: +100 ポイント獲得!
          </span>
        </div>
      )}
    </div>
  );
};

export default MotiveCard;