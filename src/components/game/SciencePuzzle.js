import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 科学パズル - 各エピソードの科学テーマに基づいたミニゲーム
const SciencePuzzle = ({ puzzleType, difficulty, onComplete }) => {
  const [puzzle, setPuzzle] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // パズルの初期化
  useEffect(() => {
    // パズルタイプに応じたパズルの生成
    switch (puzzleType) {
      case 'light-puzzle':
        setPuzzle(generateLightPuzzle(difficulty));
        break;
      case 'microbe-puzzle':
        setPuzzle(generateMicrobePuzzle(difficulty));
        break;
      case 'crypto-puzzle':
        setPuzzle(generateCryptoPuzzle(difficulty));
        break;
      case 'geology-puzzle':
        setPuzzle(generateGeologyPuzzle(difficulty));
        break;
      case 'ai-puzzle':
        setPuzzle(generateAIPuzzle(difficulty));
        break;
      default:
        setPuzzle(generateDefaultPuzzle(difficulty));
    }
  }, [puzzleType, difficulty]);

  // パズル完了ハンドラー
  const handleComplete = (finalScore) => {
    setCompleted(true);
    setScore(finalScore);
    onComplete && onComplete(finalScore);
  };

  if (!puzzle) {
    return <div>パズルを読み込み中...</div>;
  }

  // パズルタイプに応じたコンポーネントのレンダリング
  switch (puzzleType) {
    case 'light-puzzle':
      return <LightPuzzle puzzle={puzzle} onComplete={handleComplete} />;
    case 'microbe-puzzle':
      return <MicrobePuzzle puzzle={puzzle} onComplete={handleComplete} />;
    case 'crypto-puzzle':
      return <CryptoPuzzle puzzle={puzzle} onComplete={handleComplete} />;
    case 'geology-puzzle':
      return <GeologyPuzzle puzzle={puzzle} onComplete={handleComplete} />;
    case 'ai-puzzle':
      return <AIPuzzle puzzle={puzzle} onComplete={handleComplete} />;
    default:
      return <DefaultPuzzle puzzle={puzzle} onComplete={handleComplete} />;
  }
};

// 光学パズル（第1話）- 光の反射と屈折を利用してターゲットにレーザーを導くパズル
const LightPuzzle = ({ puzzle, onComplete }) => {
  const [board, setBoard] = useState(puzzle.board);
  const [selectedItem, setSelectedItem] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [laserPath, setLaserPath] = useState([]);

  // レーザーパスの計算
  useEffect(() => {
    if (board) {
      const path = calculateLaserPath(board);
      setLaserPath(path);
      
      // ターゲットに到達したかチェック
      const isCompleted = checkPathReachesTarget(path, board);
      if (isCompleted && !completed) {
        setCompleted(true);
        const score = calculateScore(path, board);
        onComplete(score);
      }
    }
  }, [board, completed, onComplete]);

  // アイテムをクリック（選択）
  const handleItemClick = (x, y) => {
    const item = board[y][x];
    if (item.type === 'mirror' || item.type === 'prism') {
      setSelectedItem({ x, y, item });
    }
  };

  // アイテムの回転
  const handleRotateItem = () => {
    if (!selectedItem) return;
    
    const newBoard = [...board];
    const { x, y, item } = selectedItem;
    
    // アイテムに応じた回転ロジック
    if (item.type === 'mirror') {
      // 鏡は角度を45度ずつ回転
      newBoard[y][x] = {
        ...item,
        angle: (item.angle + 45) % 360
      };
    } else if (item.type === 'prism') {
      // プリズムは向きを変える
      newBoard[y][x] = {
        ...item,
        orientation: (item.orientation + 1) % 3 // 3つの向き（0,1,2）
      };
    }
    
    setBoard(newBoard);
    setSelectedItem({ ...selectedItem, item: newBoard[y][x] });
  };

  // セルをクリックしてアイテムを配置
  const handleCellClick = (x, y) => {
    if (!selectedItem || board[y][x].type !== 'empty') return;
    
    // ドラッグ&ドロップの代わりにクリックで移動
    const newBoard = [...board];
    newBoard[selectedItem.y][selectedItem.x] = { type: 'empty' };
    newBoard[y][x] = selectedItem.item;
    
    setBoard(newBoard);
    setSelectedItem(null);
  };

  // レーザーパスの計算ロジック（実際の光の物理を簡略化）
  const calculateLaserPath = (board) => {
    // 開始位置を探す
    let startX = -1, startY = -1, startDirection = '';
    
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x].type === 'laser') {
          startX = x;
          startY = y;
          startDirection = board[y][x].direction;
          break;
        }
      }
      if (startX !== -1) break;
    }
    
    if (startX === -1) return []; // レーザーが見つからない
    
    // パスの追跡
    const path = [];
    let currentX = startX;
    let currentY = startY;
    let direction = startDirection;
    let steps = 0;
    const maxSteps = 100; // 無限ループ防止
    
    path.push({ x: currentX, y: currentY, direction });
    
    while (steps < maxSteps) {
      steps++;
      
      // 次のセルに移動
      switch (direction) {
        case 'right': currentX++; break;
        case 'left': currentX--; break;
        case 'up': currentY--; break;
        case 'down': currentY++; break;
      }
      
      // ボードの外に出たらパス終了
      if (currentX < 0 || currentX >= board[0].length || currentY < 0 || currentY >= board.length) {
        break;
      }
      
      const cell = board[currentY][currentX];
      path.push({ x: currentX, y: currentY, direction });
      
      // セルの種類に応じた処理
      if (cell.type === 'mirror') {
        direction = reflectDirection(direction, cell.angle);
      } else if (cell.type === 'prism') {
        direction = refractDirection(direction, cell.orientation);
      } else if (cell.type === 'target') {
        break; // ターゲットに到達したらパス終了
      } else if (cell.type === 'block') {
        path.pop(); // ブロックにぶつかったら最後のステップを削除
        break;
      }
    }
    
    return path;
  };

  // ターゲットに到達したかチェック
  const checkPathReachesTarget = (path, board) => {
    if (path.length < 2) return false;
    
    const lastStep = path[path.length - 1];
    return board[lastStep.y][lastStep.x].type === 'target';
  };

  // スコア計算
  const calculateScore = (path, board) => {
    // 基本スコア + パスの効率性ボーナス
    const baseScore = 100;
    const efficiencyBonus = Math.max(0, 50 - path.length) * 2;
    return baseScore + efficiencyBonus;
  };

  // 光の反射方向の計算（簡略化）
  const reflectDirection = (incomingDirection, mirrorAngle) => {
    // 45度の鏡の場合の反射ロジック（簡略化）
    if (mirrorAngle === 45 || mirrorAngle === 225) {
      switch (incomingDirection) {
        case 'right': return 'up';
        case 'left': return 'down';
        case 'up': return 'right';
        case 'down': return 'left';
      }
    } else if (mirrorAngle === 135 || mirrorAngle === 315) {
      switch (incomingDirection) {
        case 'right': return 'down';
        case 'left': return 'up';
        case 'up': return 'left';
        case 'down': return 'right';
      }
    }
    return incomingDirection;
  };

  // 光の屈折方向の計算（簡略化）
  const refractDirection = (incomingDirection, orientation) => {
    // プリズムの向きに応じた屈折ロジック（簡略化）
    if (orientation === 0) {
      // 右向きプリズム
      if (incomingDirection === 'left') return 'up';
    } else if (orientation === 1) {
      // 上向きプリズム
      if (incomingDirection === 'down') return 'right';
    } else if (orientation === 2) {
      // 左向きプリズム
      if (incomingDirection === 'right') return 'down';
    }
    return incomingDirection;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        光の経路パズル
      </h3>
      
      {completed ? (
        <div className="text-center py-4">
          <p className="text-green-600 font-bold text-lg mb-2">成功！</p>
          <p className="text-gray-700">スコア: {Math.round(puzzle.difficulty === 'easy' ? score * 0.7 : score * (puzzle.difficulty === 'medium' ? 1 : 1.3))}</p>
        </div>
      ) : (
        <p className="text-gray-700 mb-4">
          ミラーとプリズムを配置・回転させて、光線をターゲットに導きましょう。
        </p>
      )}
      
      <div className="relative bg-gray-100 rounded-md overflow-hidden" style={{ aspectRatio: '1/1' }}>
        {/* ゲームボード */}
        <div className="grid grid-cols-8 gap-0.5 p-1">
          {board.map((row, y) => 
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`aspect-square relative border ${
                  selectedItem && selectedItem.x === x && selectedItem.y === y
                    ? 'border-detective-accent border-2'
                    : 'border-gray-300'
                } ${
                  cell.type === 'empty' ? 'cursor-pointer hover:bg-gray-200' : ''
                }`}
                onClick={() => cell.type === 'empty' ? handleCellClick(x, y) : handleItemClick(x, y)}
              >
                {renderCell(cell, x, y)}
              </div>
            ))
          )}
        </div>
        
        {/* レーザーパス */}
        <svg className="absolute inset-0 pointer-events-none">
          {laserPath.map((point, index) => {
            if (index === 0) return null;
            const prevPoint = laserPath[index - 1];
            return (
              <line
                key={index}
                x1={prevPoint.x * 12.5 + 6.25}
                y1={prevPoint.y * 12.5 + 6.25}
                x2={point.x * 12.5 + 6.25}
                y2={point.y * 12.5 + 6.25}
                stroke="red"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      
      {/* コントロールパネル */}
      {selectedItem && (
        <div className="mt-4 flex justify-center space-x-2">
          <button
            className="bg-detective-secondary text-white px-4 py-2 rounded-md hover:bg-detective-primary transition-colors"
            onClick={handleRotateItem}
          >
            回転
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            onClick={() => setSelectedItem(null)}
          >
            キャンセル
          </button>
        </div>
      )}
    </div>
  );
};

// セルのレンダリング
const renderCell = (cell, x, y) => {
  switch (cell.type) {
    case 'laser':
      return (
        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
          L
        </div>
      );
    case 'mirror':
      return (
        <div
          className="w-full h-full flex items-center justify-center bg-gray-400"
          style={{ transform: `rotate(${cell.angle}deg)` }}
        >
          <div className="w-3/4 h-1 bg-white"></div>
        </div>
      );
    case 'prism':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-3/4 h-3/4 bg-yellow-300 opacity-70"
            style={{
              clipPath:
                cell.orientation === 0
                  ? 'polygon(0 0, 100% 50%, 0 100%)'
                  : cell.orientation === 1
                  ? 'polygon(0 0, 100% 0, 50% 100%)'
                  : 'polygon(100% 0, 100% 100%, 0 50%)'
            }}
          ></div>
        </div>
      );
    case 'target':
      return (
        <div className="w-full h-full flex items-center justify-center bg-green-500 text-white">
          T
        </div>
      );
    case 'block':
      return (
        <div className="w-full h-full bg-gray-700"></div>
      );
    default:
      return null;
  }
};

// 光学パズルの生成
const generateLightPuzzle = (difficulty) => {
  // 難易度に応じたパズル設定
  const config = {
    easy: {
      boardSize: 8,
      mirrors: 2,
      prisms: 0,
      blocks: 3
    },
    medium: {
      boardSize: 8,
      mirrors: 3,
      prisms: 1,
      blocks: 4
    },
    hard: {
      boardSize: 8,
      mirrors: 4,
      prisms: 2,
      blocks: 5
    }
  }[difficulty] || config.medium;
  
  // 空のボードの作成
  const board = Array(config.boardSize).fill().map(() => 
    Array(config.boardSize).fill().map(() => ({ type: 'empty' }))
  );
  
  // レーザーの配置（左端のランダムな位置）
  const laserY = Math.floor(Math.random() * config.boardSize);
  board[laserY][0] = { type: 'laser', direction: 'right' };
  
  // ターゲットの配置（右端のランダムな位置）
  const targetY = Math.floor(Math.random() * config.boardSize);
  board[targetY][config.boardSize - 1] = { type: 'target' };
  
  // ブロックの配置
  for (let i = 0; i < config.blocks; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * (config.boardSize - 2)) + 1; // 端は避ける
      y = Math.floor(Math.random() * config.boardSize);
    } while (board[y][x].type !== 'empty');
    
    board[y][x] = { type: 'block' };
  }
  
  // 鏡の配置（初期状態のみ、ユーザーが動かせるように）
  for (let i = 0; i < config.mirrors; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * (config.boardSize - 2)) + 1; // 端は避ける
      y = Math.floor(Math.random() * config.boardSize);
    } while (board[y][x].type !== 'empty');
    
    board[y][x] = {
      type: 'mirror',
      angle: [45, 135, 225, 315][Math.floor(Math.random() * 4)] // ランダムな角度
    };
  }
  
  // プリズムの配置（中〜難しい難易度のみ）
  for (let i = 0; i < config.prisms; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * (config.boardSize - 2)) + 1; // 端は避ける
      y = Math.floor(Math.random() * config.boardSize);
    } while (board[y][x].type !== 'empty');
    
    board[y][x] = {
      type: 'prism',
      orientation: Math.floor(Math.random() * 3) // ランダムな向き
    };
  }
  
  return {
    board,
    difficulty
  };
};

// 他のパズルタイプの骨格
// 実際の実装は省略しますが、同様のパターンで各テーマのパズルを実装できます
const MicrobePuzzle = ({ puzzle, onComplete }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        微生物学パズル
      </h3>
      <p className="text-gray-500 italic">この機能は開発中です</p>
    </div>
  );
};

const CryptoPuzzle = ({ puzzle, onComplete }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        暗号解読パズル
      </h3>
      <p className="text-gray-500 italic">この機能は開発中です</p>
    </div>
  );
};

const GeologyPuzzle = ({ puzzle, onComplete }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        地質学パズル
      </h3>
      <p className="text-gray-500 italic">この機能は開発中です</p>
    </div>
  );
};

const AIPuzzle = ({ puzzle, onComplete }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        AI挙動予測パズル
      </h3>
      <p className="text-gray-500 italic">この機能は開発中です</p>
    </div>
  );
};

const DefaultPuzzle = ({ puzzle, onComplete }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
        科学パズル
      </h3>
      <p className="text-gray-500 italic">この科学分野のパズルはまだ実装されていません</p>
    </div>
  );
};

// 各パズルタイプのジェネレーター関数の骨格
// 実際の実装は省略
const generateMicrobePuzzle = (difficulty) => ({});
const generateCryptoPuzzle = (difficulty) => ({});
const generateGeologyPuzzle = (difficulty) => ({});
const generateAIPuzzle = (difficulty) => ({});
const generateDefaultPuzzle = (difficulty) => ({});

export default SciencePuzzle;
