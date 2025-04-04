import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import usePuzzle from '../../hooks/usePuzzle';

interface SciencePuzzleProps {
  puzzleType: 'light-puzzle' | 'microbe-puzzle' | 'crypto-puzzle' | 'geology-puzzle' | 'ai-puzzle' | 'default-puzzle';
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

const SciencePuzzle: React.FC<SciencePuzzleProps> = ({ 
  puzzleType, 
  difficulty, 
  onComplete 
}) => {
  const { 
    puzzle, 
    loading, 
    error, 
    gameState, 
    moveItem,
    rotateItem,
    getHint,
    resetPuzzle
  } = usePuzzle(puzzleType, difficulty, onComplete);

  const [showHint, setShowHint] = useState<boolean>(false);
  const [currentHint, setCurrentHint] = useState<string>('');

  // ヒントを取得
  useEffect(() => {
    setCurrentHint(getHint());
  }, [gameState.moves, getHint]);

  // パズルのレンダリング
  const renderPuzzle = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-detective-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          <p className="font-bold">エラーが発生しました</p>
          <p>{error}</p>
          <button 
            onClick={resetPuzzle}
            className="mt-2 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      );
    }

    if (!puzzle) {
      return (
        <div className="text-center p-8">
          <p>パズルを読み込めませんでした。再試行してください。</p>
          <button 
            onClick={resetPuzzle}
            className="mt-4 bg-detective-primary text-white px-4 py-2 rounded-md hover:bg-detective-secondary transition-colors"
          >
            再読み込み
          </button>
        </div>
      );
    }

    // パズルの種類に応じたコンポーネントをレンダリング
    switch (puzzleType) {
      case 'light-puzzle':
        return renderLightPuzzle();
      case 'microbe-puzzle':
        return renderMicrobePuzzle();
      case 'crypto-puzzle':
        return renderCryptoPuzzle();
      case 'geology-puzzle':
        return renderGeologyPuzzle();
      case 'ai-puzzle':
        return renderAIPuzzle();
      default:
        return renderDefaultPuzzle();
    }
  };

  // 各パズルタイプのレンダリング関数
  const renderLightPuzzle = () => {
    // 実装例：光パズル（ボードとミラーを使った反射パズル）
    return (
      <div className="bg-detective-light rounded-lg p-4">
        <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
          光の経路パズル
        </h3>
        
        <div className="relative aspect-square bg-white rounded-md border border-gray-300 overflow-hidden mb-4">
          {/* ボードの実装（8x8グリッド） */}
          {puzzle.board && puzzle.board.map((row, y) => (
            <div key={`row-${y}`} className="flex">
              {row.map((cell, x) => (
                <div 
                  key={`cell-${x}-${y}`} 
                  className="w-1/8 h-1/8 border border-gray-200 flex items-center justify-center"
                  onClick={() => {/* セルクリックのロジック */}}
                >
                  {/* セル内のアイテム */}
                  {cell.type !== 'empty' && (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        transform: cell.angle ? `rotate(${cell.angle}deg)` : 'none'
                      }}
                    >
                      {cell.type === 'mirror' && (
                        <div className="w-3/4 h-3/4 bg-blue-200 rounded-full" />
                      )}
                      {cell.type === 'prism' && (
                        <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-yellow-300" />
                      )}
                      {cell.type === 'laser' && (
                        <div className="w-3/4 h-3/4 bg-red-500 rounded-full" />
                      )}
                      {cell.type === 'target' && (
                        <div className="w-3/4 h-3/4 bg-green-500 rounded-full" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          {/* レーザービーム経路の表示など */}
        </div>
        
        <div className="mt-4 flex justify-between">
          <div>
            <span className="text-sm text-gray-600">移動回数: {gameState.moves}</span>
          </div>
          <div>
            <button 
              onClick={resetPuzzle}
              className="mr-2 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
            >
              リセット
            </button>
            <button 
              onClick={() => setShowHint(!showHint)}
              className="text-sm bg-detective-secondary text-white hover:bg-opacity-90 px-3 py-1 rounded transition-colors"
            >
              {showHint ? 'ヒントを隠す' : 'ヒント'}
            </button>
          </div>
        </div>
        
        {/* ヒント表示 */}
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-detective-dark text-white rounded-md"
          >
            <p className="text-sm">{currentHint}</p>
          </motion.div>
        )}
      </div>
    );
  };

  // 他のパズルタイプのレンダリング（スケルトン実装）
  const renderMicrobePuzzle = () => (
    <div className="bg-detective-light rounded-lg p-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        微生物伝播パズル
      </h3>
      <p className="text-center py-8 text-gray-500">微生物パズル（実装中）</p>
    </div>
  );

  const renderCryptoPuzzle = () => (
    <div className="bg-detective-light rounded-lg p-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        暗号解読パズル
      </h3>
      <p className="text-center py-8 text-gray-500">暗号パズル（実装中）</p>
    </div>
  );

  const renderGeologyPuzzle = () => (
    <div className="bg-detective-light rounded-lg p-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        地質学パズル
      </h3>
      <p className="text-center py-8 text-gray-500">地質学パズル（実装中）</p>
    </div>
  );

  const renderAIPuzzle = () => (
    <div className="bg-detective-light rounded-lg p-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        AI論理パズル
      </h3>
      <p className="text-center py-8 text-gray-500">AI論理パズル（実装中）</p>
    </div>
  );

  const renderDefaultPuzzle = () => (
    <div className="bg-detective-light rounded-lg p-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        科学パズル
      </h3>
      <p className="text-center py-8 text-gray-500">標準パズル（実装中）</p>
    </div>
  );

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-detective text-xl text-detective-dark font-bold">
          科学のパズル: {getPuzzleTitle(puzzleType)}
        </h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">難易度:</span>
          <span className={`text-sm px-2 py-0.5 rounded-full ${getDifficultyClass(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
      </div>
      
      {renderPuzzle()}
      
      {gameState.completed && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-green-100 text-green-800 p-4 rounded-md"
        >
          <h3 className="font-bold text-lg mb-2">パズル完了！</h3>
          <p className="mb-2">スコア: {gameState.score} ポイント</p>
          <p>時間: {formatTime((gameState.endTime?.getTime() || 0) - (gameState.startTime?.getTime() || 0))}</p>
        </motion.div>
      )}
    </div>
  );
};

// パズルタイプからタイトルを取得
const getPuzzleTitle = (type: string): string => {
  switch (type) {
    case 'light-puzzle': return '光の反射と屈折';
    case 'microbe-puzzle': return '微生物の伝播';
    case 'crypto-puzzle': return '暗号解読';
    case 'geology-puzzle': return '地層の謎';
    case 'ai-puzzle': return 'AI論理問題';
    default: return '科学の謎';
  }
};

// 難易度に応じたラベルを取得
const getDifficultyLabel = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return '初級';
    case 'medium': return '中級';
    case 'hard': return '上級';
    default: return '標準';
  }
};

// 難易度に応じたスタイルクラスを取得
const getDifficultyClass = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// 時間のフォーマット（ミリ秒を「分:秒」形式に）
const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default SciencePuzzle;
