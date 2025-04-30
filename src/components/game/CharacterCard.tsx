import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Suspect } from '../../types/game';

interface CharacterCardProps {
  suspects: Suspect[];
  initialIndex?: number;
  onAskQuestions: (suspectId: string) => void;
}

/**
 * キャラクターカードコンポーネント
 * 左右のスワイプで複数のキャラクターを切り替えられる
 */
const CharacterCard: React.FC<CharacterCardProps> = ({
  suspects,
  initialIndex = 0,
  onAskQuestions,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);

  const currentSuspect = suspects[currentIndex];

  // 肩書きと名前を分離する関数
  const formatNameAndTitle = (name: string): { name: string; title: string } => {
    const match = name.match(/(.+?)(?:\s*\((.+?)\))?$/);
    if (match) {
      return {
        name: match[1],
        title: match[2] || ''
      };
    }
    return { name, title: '' };
  };

  const { name, title } = formatNameAndTitle(currentSuspect.name);

  // キャラクター切り替え
  const changeCharacter = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = suspects.length - 1;
      setDirection('left');
    } else if (newIndex >= suspects.length) {
      newIndex = 0;
      setDirection('right');
    } else {
      setDirection(newIndex > currentIndex ? 'right' : 'left');
    }
    setCurrentIndex(newIndex);
  };

  // 左矢印クリック
  const handlePrev = () => {
    changeCharacter(currentIndex - 1);
  };

  // 右矢印クリック
  const handleNext = () => {
    changeCharacter(currentIndex + 1);
  };

  // ドラッグスタート
  const handleDragStart = (_: any, info: PanInfo) => {
    setIsDragging(true);
    dragStartX.current = info.point.x;
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!isDragging || dragStartX.current === null) return;

    const dragDistance = info.point.x - dragStartX.current;
    const threshold = 50; // スワイプと判定する距離

    if (dragDistance > threshold) {
      // 右にスワイプ -> 前のキャラクター
      handlePrev();
    } else if (dragDistance < -threshold) {
      // 左にスワイプ -> 次のキャラクター
      handleNext();
    }

    setIsDragging(false);
    dragStartX.current = null;
  };

  // 質問するボタンクリック
  const handleAskQuestions = () => {
    onAskQuestions(currentSuspect.id);
  };

  // カードアニメーション
  const cardVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -300 : 300,
      opacity: 0,
    }),
  };

  // 警戒レベルに応じた色
  const getTrustLevelColor = (level: number) => {
    if (level >= 75) return 'bg-green-500';
    if (level >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* ナビゲーションインジケーター */}
      <div className="flex justify-center gap-1 mb-2">
        {suspects.map((_, index) => (
          <div
            key={`indicator-${index}`}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-detective-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* メインカード */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSuspect.id}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="p-4">
              {/* キャラクター名と肩書き */}
              <h2 className="text-xl font-bold text-detective-dark mb-1">
                {name} {title && <span className="text-sm font-normal text-gray-500">({title})</span>}
              </h2>
              
              {/* 警戒レベルメーター（名前なし） */}
              <div className="mb-4 mt-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-bold">警戒</span>
                  <span className="text-detective-primary">{currentSuspect.trustLevel}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getTrustLevelColor(currentSuspect.trustLevel)}`}
                    style={{ width: `${currentSuspect.trustLevel}%` }}
                  />
                </div>
              </div>

              {/* プロフィール画像スペース */}
              <div className="w-full aspect-video bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-400">
                プロフィール画像
              </div>

              {/* プロフィール情報 */}
              <div className="mb-4">
                <h3 className="font-bold text-detective-dark mb-1">プロフィール</h3>
                <p className="text-sm text-gray-700">{currentSuspect.profile}</p>
              </div>

              {/* 動機情報 */}
              <div className="mb-4">
                <h3 className="font-bold text-detective-dark mb-1">動機</h3>
                <p className="text-sm text-gray-700">{currentSuspect.motive}</p>
              </div>

              {/* アリバイ情報 */}
              <div className="mb-4">
                <h3 className="font-bold text-detective-dark mb-1">アリバイ</h3>
                <p className="text-sm text-gray-700">{currentSuspect.alibi}</p>
              </div>

              {/* 質問ボタン */}
              <button
                onClick={handleAskQuestions}
                className="w-full py-3 bg-detective-primary text-white rounded-md hover:bg-detective-primary-dark transition-colors"
              >
                質問する
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 左右ナビゲーションボタン */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-detective-dark"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-detective-dark"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default CharacterCard;
