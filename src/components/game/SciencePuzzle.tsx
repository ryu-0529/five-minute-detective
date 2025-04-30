import React, { useState, useEffect } from 'react';
import { EpisodeData } from '../../types/game';
import useLightPuzzle from '../../hooks/useLightPuzzle';
import { motion } from 'framer-motion';

interface SciencePuzzleProps {
  episode: EpisodeData;
  onComplete: (score: number) => void;
}

const SciencePuzzle: React.FC<SciencePuzzleProps> = ({ episode, onComplete }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  // パズルタイプを決定
  const getPuzzleType = () => {
    if (!episode || !episode.miniGame) return 'default-puzzle';
    return episode.miniGame.type;
  };
  
  // 光学パズルのレンダリング
  const renderLightPuzzle = () => {
    const {
      board,
      lightPaths,
      selectedElement,
      isCompleted,
      score,
      moveElement,
      rotateElement,
      selectElement,
      resetPuzzle,
      getHint
    } = useLightPuzzle(difficulty, onComplete);
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-bold text-blue-600">
          光学パズル: {isCompleted ? '完成！' : '光の経路を操作しよう'}
        </h3>
        
        {/* 難易度切り替え */}
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-3 py-1 rounded ${difficulty === 'easy' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setDifficulty('easy');
              resetPuzzle();
            }}
          >
            初級
          </button>
          <button
            className={`px-3 py-1 rounded ${difficulty === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setDifficulty('medium');
              resetPuzzle();
            }}
          >
            中級
          </button>
          <button
            className={`px-3 py-1 rounded ${difficulty === 'hard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setDifficulty('hard');
              resetPuzzle();
            }}
          >
            上級
          </button>
        </div>
        
        {/* ヒントとスコア */}
        <div className="w-full max-w-md bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700">{getHint()}</p>
          {isCompleted && <p className="text-lg font-bold text-green-600 mt-2">スコア: {score}点</p>}
        </div>
        
        {/* パズルボード */}
        <div className="relative w-80 h-80 bg-gray-100 border-2 border-blue-800 rounded-lg overflow-hidden">
          {/* 光の経路を描画 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {lightPaths.map((path, pathIndex) => (
              <polyline
                key={`path-${pathIndex}`}
                points={path.points
                  .map(p => `${(p.x + 0.5) * 40},${(p.y + 0.5) * 40}`)
                  .join(' ')}
                fill="none"
                stroke={path.color}
                strokeWidth="2"
                strokeOpacity="0.7"
                strokeDasharray="5,3"
              />
            ))}
          </svg>
          
          {/* パズル要素を描画 */}
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {board.map((row, y) =>
              row.map((cell, x) => (
                <motion.div
                  key={`cell-${x}-${y}`}
                  className={`relative flex items-center justify-center ${
                    selectedElement && selectedElement.x === x && selectedElement.y === y
                      ? 'ring-2 ring-yellow-400'
                      : ''
                  }`}
                  onClick={() => selectElement(x, y)}
                  whileHover={{ scale: cell.type !== 'empty' ? 1.1 : 1 }}
                  animate={{
                    rotateZ: cell.angle || 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* セルの内容に応じた描画 */}
                  {cell.type === 'laser' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255, 0, 0, 0.2)' }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cell.color || 'red' }}
                      />
                    </div>
                  )}
                  
                  {cell.type === 'mirror' && (
                    <div
                      className="w-6 h-1 bg-blue-200 border border-blue-400"
                      style={{ transform: `rotate(${cell.angle}deg)` }}
                    />
                  )}
                  
                  {cell.type === 'prism' && (
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-b-[17.3px] border-b-blue-300 border-r-[10px] border-r-transparent" />
                  )}
                  
                  {cell.type === 'target' && (
                    <div
                      className="w-6 h-6 rounded-full border-4 border-dashed flex items-center justify-center"
                      style={{ borderColor: cell.color || 'red' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                  
                  {cell.type === 'obstacle' && (
                    <div className="w-8 h-8 bg-gray-800 rounded-sm" />
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
        
        {/* 操作メニュー */}
        <div className="flex space-x-4 mt-4">
          {selectedElement && (
            <>
              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => rotateElement(selectedElement.x, selectedElement.y, 45)}
                >
                  回転 ↻
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => rotateElement(selectedElement.x, selectedElement.y, -45)}
                >
                  回転 ↺
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() =>
                    moveElement(
                      selectedElement.x,
                      selectedElement.y,
                      selectedElement.x - 1,
                      selectedElement.y - 1
                    )
                  }
                >
                  ↖
                </button>
                <button
                  className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() =>
                    moveElement(
                      selectedElement.x,
                      selectedElement.y,
                      selectedElement.x,
                      selectedElement.y - 1
                    )
                  }
                >
                  ↑
                </button>
                <button
                  className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() =>
                    moveElement(
                      selectedElement.x,
                      selectedElement.y,
                      selectedElement.x + 1,
                      selectedElement.y - 1
                    )
                  }
                >
                  ↗
                </button>
                <button
                  className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() =>
                    moveElement(
                      selectedElement.x,
                      selectedElement.y,
                      selectedElement.x - 1,
                      selectedElement.y
                    )
                  }
                >
                  ←
                </button>
                <button
                  className="bg-red-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() => selectElement(-1, -1)}
                >
                  ×
                </button>
                <button
                  className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() =>
                    moveElement(
                      selectedElement.x,
                      selectedElement.y,
                      selectedElement.x + 1,
                      selectedElement.y
                    )
                  }
                >
                  →
                </button>
                <button
                  className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() =>
                    moveElement(
                      selectedElement.x,
                      selectedElement.y,
                      selectedElement.x - 1,
                      selectedElement.y + 1
                    )
                  }
                >
                  ↙
                </button>
                <button
                  className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() =>
                    moveElement(
                      selectedElement.x,
                      selectedElement.y,
                      selectedElement.x,
                      selectedElement.y + 1
                    )
                  }
                >
                  ↓
                </button>
                <button
                  className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded"
                  onClick={() =>
                    moveElement(
                      selectedElement.x,
                      selectedElement.y,
                      selectedElement.x + 1,
                      selectedElement.y + 1
                    )
                  }
                >
                  ↘
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* リセットボタン */}
        <button
          className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={resetPuzzle}
        >
          パズルをリセット
        </button>
        
        {/* 完了メッセージ */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-3">パズル完成！</h3>
              <p className="mb-4">
                おめでとうございます！スコア: <span className="font-bold">{score}点</span>
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => onComplete(score)}
              >
                次へ進む
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };
  
  // その他のパズルタイプの処理
  // 実際のアプリでは他のパズルタイプも実装する
  
  // パズルタイプに応じたコンポーネントをレンダリング
  switch (getPuzzleType()) {
    case 'light-puzzle':
      return renderLightPuzzle();
    case 'microbe-puzzle':
      return <div>微生物パズル（実装中）</div>;
    case 'crypto-puzzle':
      return <div>暗号パズル（実装中）</div>;
    case 'geology-puzzle':
      return <div>地質学パズル（実装中）</div>;
    case 'ai-puzzle':
      return <div>AIパズル（実装中）</div>;
    case 'multi-science-puzzle':
      return <div>複合科学パズル（実装中）</div>;
    default:
      return <div>パズルが設定されていません</div>;
  }
};

export default SciencePuzzle;
