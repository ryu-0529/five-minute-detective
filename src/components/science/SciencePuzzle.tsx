import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SciencePuzzleProps {
  type: string;
  difficulty: string;
  onComplete: () => void;
  className?: string;
}

/**
 * SciencePuzzle - 科学的原理を学べるインタラクティブなパズルコンポーネント
 * type パラメータによって異なる種類のパズルを表示
 * - light-puzzle: 光学パズル (反射・屈折)
 * - virus-puzzle: ウイルス拡散パズル
 * - crypto-puzzle: 暗号解読パズル
 * - geo-puzzle: 地質学パズル
 * - ai-puzzle: AIロジックパズル
 */
const SciencePuzzle: React.FC<SciencePuzzleProps> = ({
  type,
  difficulty,
  onComplete,
  className = ''
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
  // パズルの種類に応じたコンテンツを表示
  const renderPuzzleContent = () => {
    switch (type) {
      case 'light-puzzle':
        return <LightPuzzle difficulty={difficulty} onProgress={handleProgress} />;
      case 'virus-puzzle':
        return <VirusPuzzle difficulty={difficulty} onProgress={handleProgress} />;
      case 'crypto-puzzle':
        return <CryptoPuzzle difficulty={difficulty} onProgress={handleProgress} />;
      case 'geo-puzzle':
        return <GeoPuzzle difficulty={difficulty} onProgress={handleProgress} />;
      case 'ai-puzzle':
        return <AIPuzzle difficulty={difficulty} onProgress={handleProgress} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-md">
            <p className="text-gray-500">未実装のパズルタイプです: {type}</p>
          </div>
        );
    }
  };
  
  // 進捗状況の更新
  const handleProgress = (value: number) => {
    setProgress(value);
    if (value >= 100 && !isCompleted) {
      setIsCompleted(true);
      onComplete();
    }
  };
  
  // 完了時の効果
  useEffect(() => {
    if (isCompleted) {
      // パズル完了時の処理
    }
  }, [isCompleted]);
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="bg-detective-dark text-white p-3 flex justify-between items-center">
        <h3 className="font-detective font-bold">
          科学パズル: {getPuzzleTitle(type)}
        </h3>
        <span className="text-sm bg-detective-secondary px-2 py-1 rounded">
          難易度: {difficulty}
        </span>
      </div>
      
      <div className="p-4">
        {renderPuzzleContent()}
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-detective-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0%</span>
            <span>{progress}% 完了</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// パズルのタイトルを取得
const getPuzzleTitle = (type: string): string => {
  switch (type) {
    case 'light-puzzle':
      return '光の反射と屈折';
    case 'virus-puzzle':
      return '疫学と感染経路';
    case 'crypto-puzzle':
      return '暗号の解読';
    case 'geo-puzzle':
      return '地質学的証拠';
    case 'ai-puzzle':
      return 'AI論理回路';
    default:
      return 'パズル';
  }
};

// 以下は各種パズルのコンポーネント
// 実際のアプリではこれらを別ファイルに分けることも検討

interface PuzzleProps {
  difficulty: string;
  onProgress: (value: number) => void;
}

// 光学パズル
const LightPuzzle: React.FC<PuzzleProps> = ({ difficulty, onProgress }) => {
  const [mirrors, setMirrors] = useState<{ x: number; y: number; angle: number }[]>([]);
  const [progress, setProgress] = useState<number>(0);
  
  // 実装例: 各難易度でのミラーの初期配置
  useEffect(() => {
    let initialMirrors = [];
    
    if (difficulty === '初級') {
      initialMirrors = [
        { x: 30, y: 50, angle: 45 },
        { x: 70, y: 50, angle: 135 }
      ];
    } else if (difficulty === '中級') {
      initialMirrors = [
        { x: 20, y: 30, angle: 45 },
        { x: 60, y: 40, angle: 135 },
        { x: 40, y: 70, angle: 90 }
      ];
    } else {
      initialMirrors = [
        { x: 20, y: 20, angle: 45 },
        { x: 60, y: 30, angle: 135 },
        { x: 40, y: 70, angle: 90 },
        { x: 80, y: 60, angle: 0 }
      ];
    }
    
    setMirrors(initialMirrors);
  }, [difficulty]);
  
  // ミラーの角度変更
  const rotateMirror = (index: number) => {
    const newMirrors = [...mirrors];
    newMirrors[index].angle = (newMirrors[index].angle + 45) % 360;
    setMirrors(newMirrors);
    
    // 仮の進捗更新（実際のゲームでは正解チェックが必要）
    const newProgress = Math.min(100, progress + 10);
    setProgress(newProgress);
    onProgress(newProgress);
  };
  
  return (
    <div className="bg-detective-light p-4 rounded-md h-64 relative">
      {/* 光源 */}
      <div className="absolute left-2 top-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
        光源
      </div>
      
      {/* ターゲット */}
      <div className="absolute right-2 bottom-2 w-10 h-10 border-2 border-dashed border-red-500 rounded-full flex items-center justify-center text-xs text-red-500">
        ターゲット
      </div>
      
      {/* 鏡 */}
      {mirrors.map((mirror, index) => (
        <button
          key={index}
          className="absolute w-12 h-3 bg-blue-300 transform origin-center shadow-md hover:bg-blue-400 transition-colors"
          style={{
            left: `${mirror.x}%`,
            top: `${mirror.y}%`,
            transform: `translate(-50%, -50%) rotate(${mirror.angle}deg)`
          }}
          onClick={() => rotateMirror(index)}
        />
      ))}
      
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        鏡をクリックして回転させ、光線をターゲットに導きましょう
      </div>
    </div>
  );
};

// ウイルスパズル
const VirusPuzzle: React.FC<PuzzleProps> = ({ difficulty, onProgress }) => {
  // 簡易な実装（本来はより複雑なシミュレーションが必要）
  useEffect(() => {
    // 自動的に50%の進捗をシミュレート
    setTimeout(() => {
      onProgress(50);
    }, 2000);
  }, [onProgress]);
  
  return (
    <div className="bg-detective-light p-4 rounded-md h-64 flex items-center justify-center">
      <p>感染経路追跡パズル - 実装中</p>
    </div>
  );
};

// 暗号パズル
const CryptoPuzzle: React.FC<PuzzleProps> = ({ difficulty, onProgress }) => {
  // 簡易な実装
  useEffect(() => {
    // 自動的に50%の進捗をシミュレート
    setTimeout(() => {
      onProgress(50);
    }, 2000);
  }, [onProgress]);
  
  return (
    <div className="bg-detective-light p-4 rounded-md h-64 flex items-center justify-center">
      <p>暗号解読パズル - 実装中</p>
    </div>
  );
};

// 地質学パズル
const GeoPuzzle: React.FC<PuzzleProps> = ({ difficulty, onProgress }) => {
  // 簡易な実装
  useEffect(() => {
    // 自動的に50%の進捗をシミュレート
    setTimeout(() => {
      onProgress(50);
    }, 2000);
  }, [onProgress]);
  
  return (
    <div className="bg-detective-light p-4 rounded-md h-64 flex items-center justify-center">
      <p>地質学パズル - 実装中</p>
    </div>
  );
};

// AIパズル
const AIPuzzle: React.FC<PuzzleProps> = ({ difficulty, onProgress }) => {
  // 簡易な実装
  useEffect(() => {
    // 自動的に50%の進捗をシミュレート
    setTimeout(() => {
      onProgress(50);
    }, 2000);
  }, [onProgress]);
  
  return (
    <div className="bg-detective-light p-4 rounded-md h-64 flex items-center justify-center">
      <p>AIロジックパズル - 実装中</p>
    </div>
  );
};

export default SciencePuzzle;