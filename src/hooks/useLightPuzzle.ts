import { useState, useEffect, useCallback } from 'react';

// 光パズルの要素の型
export interface LightPuzzleElement {
  type: 'empty' | 'mirror' | 'prism' | 'laser' | 'target' | 'obstacle';
  angle?: number; // 方向や角度（0, 90, 180, 270）
  color?: string; // 光の色（red, blue, green, white, etc.）
  movable?: boolean; // 動かせるかどうか
  rotatable?: boolean; // 回転できるかどうか
}

// パズルボードの型
export type LightPuzzleBoard = LightPuzzleElement[][];

// 光線パスの型
export interface LightPath {
  color: string;
  points: { x: number; y: number }[];
}

// 光パズルのゴール条件
export interface LightPuzzleGoal {
  targets: {
    x: number;
    y: number;
    color: string;
  }[];
}

// 難易度設定の型
export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

// カスタムフックの戻り値の型
export interface UseLightPuzzleReturn {
  board: LightPuzzleBoard;
  lightPaths: LightPath[];
  selectedElement: { x: number; y: number } | null;
  isCompleted: boolean;
  score: number;
  moveElement: (fromX: number, fromY: number, toX: number, toY: number) => void;
  rotateElement: (x: number, y: number, angle: number) => void;
  selectElement: (x: number, y: number) => void;
  resetPuzzle: () => void;
  getHint: () => string;
}

/**
 * 光パズルのカスタムフック
 * @param difficulty 難易度（easy, medium, hard）
 * @param onComplete パズル完成時のコールバック
 */
const useLightPuzzle = (
  difficulty: PuzzleDifficulty = 'easy',
  onComplete?: (score: number) => void
): UseLightPuzzleReturn => {
  // 初期ボードの生成
  const initialBoard = generateInitialBoard(difficulty);
  
  // 状態
  const [board, setBoard] = useState<LightPuzzleBoard>(initialBoard);
  const [lightPaths, setLightPaths] = useState<LightPath[]>([]);
  const [selectedElement, setSelectedElement] = useState<{ x: number; y: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [hints] = useState<string[]>([
    '鏡の角度を調整してレーザーの進路を変更しよう',
    'レーザーが障害物に当たると止まります',
    'プリズムは光の色を分解したり、光の進路を変えることができます',
    '全ての光源からの光を対応する色のターゲットに導きましょう'
  ]);
  
  // ゴール条件
  const [goal] = useState<LightPuzzleGoal>({
    targets: difficulty === 'hard' ? [
      { x: 7, y: 0, color: 'red' },
      { x: 7, y: 7, color: 'blue' }
    ] : [
      { x: difficulty === 'easy' ? 3 : 7, y: difficulty === 'easy' ? 0 : 7, color: 'red' }
    ]
  });
  
  // 光の経路を計算
  const calculateLightPaths = useCallback(() => {
    const paths: LightPath[] = [];
    
    // レーザー光源を探す
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const element = board[y][x];
        if (element.type === 'laser') {
          // 光線の経路を追跡
          const path = traceLightPath(board, x, y, element.angle || 0, element.color || 'red');
          paths.push(path);
        }
      }
    }
    
    return paths;
  }, [board]);
  
  // パズルが解けているかチェック
  const checkIsCompleted = useCallback((paths: LightPath[]) => {
    // すべてのターゲットが対応する色の光を受け取っているか確認
    return goal.targets.every(target => {
      // このターゲットに当たる光があるか確認
      return paths.some(path => {
        const lastPoint = path.points[path.points.length - 1];
        return (
          lastPoint.x === target.x &&
          lastPoint.y === target.y &&
          path.color === target.color
        );
      });
    });
  }, [goal.targets]);
  
  // 要素を動かす
  const moveElement = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    if (isCompleted) return; // パズルが完了していたら操作不可
    
    // 範囲チェック
    if (
      fromX < 0 ||
      fromY < 0 ||
      toX < 0 ||
      toY < 0 ||
      fromX >= board[0].length ||
      fromY >= board.length ||
      toX >= board[0].length ||
      toY >= board.length
    ) {
      return;
    }
    
    const fromElement = board[fromY][fromX];
    const toElement = board[toY][toX];
    
    // 動かせる要素かチェック
    if (
      fromElement.type === 'laser' ||
      fromElement.type === 'target' ||
      fromElement.type === 'obstacle' ||
      fromElement.movable === false ||
      toElement.type !== 'empty'
    ) {
      return;
    }
    
    // 隣接しているかチェック
    const isAdjacent =
      (Math.abs(fromX - toX) === 1 && fromY === toY) ||
      (Math.abs(fromY - toY) === 1 && fromX === toX);
    
    if (!isAdjacent) return;
    
    // 要素を移動
    const newBoard = [...board];
    newBoard[toY][toX] = { ...fromElement };
    newBoard[fromY][fromX] = { type: 'empty' };
    
    setBoard(newBoard);
    setMoves(moves + 1);
    setSelectedElement(null);
  }, [board, isCompleted, moves]);
  
  // 要素を回転
  const rotateElement = useCallback((x: number, y: number, angleChange: number) => {
    if (isCompleted) return; // パズルが完了していたら操作不可
    
    // 範囲チェック
    if (x < 0 || y < 0 || x >= board[0].length || y >= board.length) {
      return;
    }
    
    const element = board[y][x];
    
    // 回転できる要素かチェック
    if (
      (element.type !== 'mirror' && element.type !== 'prism' && element.type !== 'laser') ||
      element.rotatable === false
    ) {
      return;
    }
    
    // 要素を回転
    const newBoard = [...board];
    const currentAngle = element.angle || 0;
    newBoard[y][x] = {
      ...element,
      angle: (currentAngle + angleChange) % 360
    };
    
    setBoard(newBoard);
    setMoves(moves + 1);
  }, [board, isCompleted, moves]);
  
  // 要素を選択
  const selectElement = useCallback((x: number, y: number) => {
    // 範囲チェック
    if (x < 0 || y < 0 || x >= board[0].length || y >= board.length) {
      return;
    }
    
    const element = board[y][x];
    
    // 選択可能な要素かチェック
    if (
      element.type === 'empty' ||
      (element.type !== 'mirror' && element.type !== 'prism' && element.movable !== true)
    ) {
      setSelectedElement(null);
      return;
    }
    
    // 同じ要素を再選択した場合は選択解除
    if (selectedElement && selectedElement.x === x && selectedElement.y === y) {
      setSelectedElement(null);
      return;
    }
    
    setSelectedElement({ x, y });
  }, [board, selectedElement]);
  
  // パズルをリセット
  const resetPuzzle = useCallback(() => {
    setBoard(generateInitialBoard(difficulty));
    setSelectedElement(null);
    setIsCompleted(false);
    setScore(0);
    setMoves(0);
  }, [difficulty]);
  
  // ヒントを取得
  const getHint = useCallback(() => {
    // 移動回数に応じたヒント
    if (moves < 5) {
      return hints[0];
    } else if (moves < 15) {
      return hints[Math.min(1, hints.length - 1)];
    } else {
      return hints[Math.min(2, hints.length - 1)];
    }
  }, [hints, moves]);
  
  // 光路の計算と完了チェック
  useEffect(() => {
    const newPaths = calculateLightPaths();
    setLightPaths(newPaths);
    
    const completed = checkIsCompleted(newPaths);
    if (completed && !isCompleted) {
      // 完了時の処理
      setIsCompleted(true);
      
      // スコア計算
      const timeBonus = 0; // 時間経過に応じたボーナス（実装省略）
      const movesBonus = Math.max(0, 50 - moves) * 2;
      const difficultyMultiplier =
        difficulty === 'easy' ? 1 :
        difficulty === 'medium' ? 1.5 : 2;
      
      const finalScore = Math.round((100 + timeBonus + movesBonus) * difficultyMultiplier);
      setScore(finalScore);
      
      // 完了コールバック
      if (onComplete) {
        onComplete(finalScore);
      }
    }
  }, [board, calculateLightPaths, checkIsCompleted, difficulty, isCompleted, moves, onComplete]);
  
  return {
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
  };
};

// 初期ボードの生成
const generateInitialBoard = (difficulty: PuzzleDifficulty): LightPuzzleBoard => {
  // 8x8のボード生成
  const board: LightPuzzleBoard = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null).map(() => ({ type: 'empty' })));
  
  // 難易度別の設定
  if (difficulty === 'easy') {
    // 光源（レーザー）
    board[0][0] = { type: 'laser', angle: 0, color: 'red' };
    
    // 鏡の配置
    board[0][3] = { type: 'mirror', angle: 45, movable: true };
    board[3][3] = { type: 'mirror', angle: 135, movable: true };
    
    // ゴール（ターゲット）
    board[3][0] = { type: 'target', color: 'red' };
    
    // 障害物
    board[1][1] = { type: 'obstacle' };
    board[2][2] = { type: 'obstacle' };
    
  } else if (difficulty === 'medium') {
    // 光源（レーザー）
    board[0][0] = { type: 'laser', angle: 0, color: 'red' };
    
    // 鏡の配置
    board[0][3] = { type: 'mirror', angle: 45, movable: true };
    board[3][3] = { type: 'mirror', angle: 135, movable: true };
    board[5][2] = { type: 'mirror', angle: 90, movable: true };
    
    // プリズム
    board[2][5] = { type: 'prism', angle: 0, rotatable: true };
    
    // ゴール（ターゲット）
    board[7][7] = { type: 'target', color: 'red' };
    
    // 障害物
    board[1][1] = { type: 'obstacle' };
    board[2][2] = { type: 'obstacle' };
    board[4][4] = { type: 'obstacle' };
    board[6][6] = { type: 'obstacle' };
    
  } else { // hard
    // 複数の光源
    board[0][0] = { type: 'laser', angle: 0, color: 'red' };
    board[0][7] = { type: 'laser', angle: 270, color: 'blue' };
    
    // 鏡の配置
    board[2][2] = { type: 'mirror', angle: 45, movable: true };
    board[2][5] = { type: 'mirror', angle: 135, movable: true };
    board[5][2] = { type: 'mirror', angle: 315, movable: true };
    board[5][5] = { type: 'mirror', angle: 225, movable: true };
    
    // プリズム
    board[3][3] = { type: 'prism', angle: 0, rotatable: true };
    board[4][4] = { type: 'prism', angle: 90, rotatable: true };
    
    // 複数のゴール
    board[7][0] = { type: 'target', color: 'red' };
    board[7][7] = { type: 'target', color: 'blue' };
    
    // 障害物
    board[1][3] = { type: 'obstacle' };
    board[3][1] = { type: 'obstacle' };
    board[4][6] = { type: 'obstacle' };
    board[6][4] = { type: 'obstacle' };
  }
  
  return board;
};

// 光の経路を追跡
const traceLightPath = (
  board: LightPuzzleBoard,
  startX: number,
  startY: number,
  angle: number,
  color: string
): LightPath => {
  const path: LightPath = {
    color,
    points: [{ x: startX, y: startY }]
  };
  
  let x = startX;
  let y = startY;
  let currentAngle = angle;
  let currentColor = color;
  
  // 光の進行方向に基づく移動量
  const getDirection = (angle: number) => {
    // 0度は右、90度は下、180度は左、270度は上
    switch (angle % 360) {
      case 0:
        return { dx: 1, dy: 0 }; // 右
      case 90:
        return { dx: 0, dy: 1 }; // 下
      case 180:
        return { dx: -1, dy: 0 }; // 左
      case 270:
        return { dx: 0, dy: -1 }; // 上
      default:
        // 斜め方向など他の角度は今回は考慮しない
        return { dx: 0, dy: 0 };
    }
  };
  
  // 光の反射角度を計算
  const getReflectionAngle = (incidentAngle: number, surfaceAngle: number) => {
    // 簡略化した反射計算（実際はもっと複雑な物理を考慮）
    return (2 * surfaceAngle - incidentAngle + 360) % 360;
  };
  
  // 最大ステップ数（無限ループ防止）
  const maxSteps = 100;
  let steps = 0;
  
  while (steps < maxSteps) {
    steps++;
    
    // 現在の方向を取得
    const { dx, dy } = getDirection(currentAngle);
    
    // 次のセルへ移動
    x += dx;
    y += dy;
    
    // ボード外に出たら終了
    if (x < 0 || y < 0 || x >= board[0].length || y >= board.length) {
      break;
    }
    
    // 現在のセル
    const cell = board[y][x];
    
    // パスに現在位置を追加
    path.points.push({ x, y });
    
    // セルタイプに基づく処理
    if (cell.type === 'empty') {
      // 空のセルは通過
      continue;
    } else if (cell.type === 'obstacle') {
      // 障害物は光を止める
      break;
    } else if (cell.type === 'mirror') {
      // 鏡は光を反射
      currentAngle = getReflectionAngle(currentAngle, cell.angle || 0);
    } else if (cell.type === 'prism') {
      // プリズムの場合、光の色を変えたり、屈折させたりする処理
      // 簡略化したプリズム処理
      if (currentColor === 'white') {
        // 白色光がプリズムを通ると分解
        currentColor = ['red', 'green', 'blue'][Math.floor(Math.random() * 3)];
        path.color = currentColor;
      } else {
        // 屈折（角度変更）
        currentAngle = (currentAngle + 90) % 360;
      }
    } else if (cell.type === 'target') {
      // ターゲットに到達したら終了
      break;
    }
  }
  
  return path;
};

export default useLightPuzzle;
