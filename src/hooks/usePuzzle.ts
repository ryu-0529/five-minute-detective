import { useState, useEffect, useCallback } from 'react';

// パズルの難易度
type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

// パズルの種類
type PuzzleType = 'light-puzzle' | 'microbe-puzzle' | 'crypto-puzzle' | 'geology-puzzle' | 'ai-puzzle' | 'default-puzzle';

// パズルの要素の型
interface PuzzleItem {
  type: string;
  angle?: number;
  color?: string;
  [key: string]: any;
}

// パズルのボード
type PuzzleBoard = PuzzleItem[][];

// パズルのゴール条件
interface PuzzleGoal {
  [key: string]: any;
}

// パズルデータの型
interface PuzzleData {
  type: PuzzleType;
  difficulty: PuzzleDifficulty;
  board?: PuzzleBoard;
  hints?: string[];
  goal?: PuzzleGoal;
  [key: string]: any;
}

// ゲーム状態の型
interface PuzzleGameState {
  completed: boolean;
  score: number;
  moves: number;
  startTime: Date | null;
  endTime: Date | null;
}

/**
 * 科学パズルのロジックを処理するカスタムフック
 * @param puzzleType - パズルのタイプ (light-puzzle, microbe-puzzle など)
 * @param difficulty - 難易度 (easy, medium, hard)
 * @param onComplete - パズル完了時のコールバック関数
 */
const usePuzzle = (
  puzzleType: PuzzleType, 
  difficulty: PuzzleDifficulty, 
  onComplete?: (score: number) => void
) => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<PuzzleGameState>({
    completed: false,
    score: 0,
    moves: 0,
    startTime: null,
    endTime: null
  });

  // パズルの初期化
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      // パズルタイプに基づいてパズルを生成
      let generatedPuzzle: PuzzleData;
      
      switch (puzzleType) {
        case 'light-puzzle':
          generatedPuzzle = generateLightPuzzle(difficulty);
          break;
        case 'microbe-puzzle':
          generatedPuzzle = generateMicrobePuzzle(difficulty);
          break;
        case 'crypto-puzzle':
          generatedPuzzle = generateCryptoPuzzle(difficulty);
          break;
        case 'geology-puzzle':
          generatedPuzzle = generateGeologyPuzzle(difficulty);
          break;
        case 'ai-puzzle':
          generatedPuzzle = generateAIPuzzle(difficulty);
          break;
        default:
          generatedPuzzle = generateDefaultPuzzle(difficulty);
      }
      
      setPuzzle(generatedPuzzle);
      setGameState(prev => ({
        ...prev,
        startTime: new Date(),
        completed: false,
        score: 0,
        moves: 0
      }));
    } catch (err) {
      setError(`パズルの生成に失敗しました: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [puzzleType, difficulty]);

  // パズル完了の処理
  const completePuzzle = useCallback((score: number): void => {
    if (gameState.completed || !gameState.startTime) return;
    
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - gameState.startTime.getTime()) / 1000; // 秒単位
    
    // 時間ボーナスを計算（早く解くほど高スコア）
    const timeBonus = Math.max(0, 300 - timeTaken) * 0.5;
    
    // 移動回数に基づくボーナス（少ない移動ほど高スコア）
    const movesBonus = Math.max(0, 50 - gameState.moves) * 2;
    
    // 難易度ボーナス
    const difficultyMultiplier = 
      difficulty === 'easy' ? 1 :
      difficulty === 'medium' ? 1.5 :
      difficulty === 'hard' ? 2 : 1;
    
    // 最終スコアの計算
    const finalScore = Math.round((score + timeBonus + movesBonus) * difficultyMultiplier);
    
    setGameState(prev => ({
      ...prev,
      completed: true,
      score: finalScore,
      endTime
    }));
    
    // 完了コールバックを呼び出し
    if (onComplete) {
      onComplete(finalScore);
    }
  }, [difficulty, gameState.completed, gameState.moves, gameState.startTime, onComplete]);

  // パズルの状態を更新
  const updatePuzzleState = useCallback((update: Partial<PuzzleData>, incrementMoves: boolean = true): void => {
    setPuzzle(prev => prev ? { ...prev, ...update } : null);
    
    if (incrementMoves) {
      setGameState(prev => ({
        ...prev,
        moves: prev.moves + 1
      }));
    }
  }, []);

  // パズルのリセット
  const resetPuzzle = useCallback((): void => {
    setLoading(true);
    setError(null);
    
    try {
      // パズルを再生成
      let generatedPuzzle: PuzzleData;
      
      switch (puzzleType) {
        case 'light-puzzle':
          generatedPuzzle = generateLightPuzzle(difficulty);
          break;
        case 'microbe-puzzle':
          generatedPuzzle = generateMicrobePuzzle(difficulty);
          break;
        case 'crypto-puzzle':
          generatedPuzzle = generateCryptoPuzzle(difficulty);
          break;
        case 'geology-puzzle':
          generatedPuzzle = generateGeologyPuzzle(difficulty);
          break;
        case 'ai-puzzle':
          generatedPuzzle = generateAIPuzzle(difficulty);
          break;
        default:
          generatedPuzzle = generateDefaultPuzzle(difficulty);
      }
      
      setPuzzle(generatedPuzzle);
      setGameState({
        completed: false,
        score: 0,
        moves: 0,
        startTime: new Date(),
        endTime: null
      });
    } catch (err) {
      setError(`パズルのリセットに失敗しました: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [puzzleType, difficulty]);

  // パズルの特定要素を移動
  const moveItem = useCallback((fromX: number, fromY: number, toX: number, toY: number): void => {
    if (!puzzle || !puzzle.board) return;
    if (gameState.completed) return;
    
    // 移動可能かチェック
    const isValidMove = checkValidMove(puzzle.board, fromX, fromY, toX, toY);
    
    if (isValidMove) {
      const newBoard = [...puzzle.board.map(row => [...row])];
      const item = newBoard[fromY][fromX];
      newBoard[fromY][fromX] = { type: 'empty' };
      newBoard[toY][toX] = item;
      
      updatePuzzleState({ board: newBoard });
      
      // 移動後にパズルの状態をチェック
      if (puzzle.goal && checkPuzzleSolved(newBoard, puzzle.goal)) {
        completePuzzle(100); // 基本スコア 100 で完了
      }
    }
  }, [puzzle, gameState.completed, updatePuzzleState, completePuzzle]);

  // 要素を回転
  const rotateItem = useCallback((x: number, y: number, angle: number): void => {
    if (!puzzle || !puzzle.board) return;
    if (gameState.completed) return;
    
    const newBoard = [...puzzle.board.map(row => [...row])];
    const item = newBoard[y][x];
    
    if (item.angle !== undefined) {
      newBoard[y][x] = {
        ...item,
        angle: (item.angle + angle) % 360
      };
      
      updatePuzzleState({ board: newBoard });
      
      // 回転後にパズルの状態をチェック
      if (puzzle.goal && checkPuzzleSolved(newBoard, puzzle.goal)) {
        completePuzzle(100); // 基本スコア 100 で完了
      }
    }
  }, [puzzle, gameState.completed, updatePuzzleState, completePuzzle]);

  // ヒントの取得
  const getHint = useCallback((): string => {
    if (!puzzle || !puzzle.hints || puzzle.hints.length === 0) {
      return '現在ヒントはありません';
    }
    
    // パズルの進行状況に応じたヒント
    if (gameState.moves < 5) {
      return puzzle.hints[0];
    } else if (gameState.moves < 15) {
      return puzzle.hints[Math.min(1, puzzle.hints.length - 1)];
    } else {
      return puzzle.hints[Math.min(2, puzzle.hints.length - 1)];
    }
  }, [puzzle, gameState.moves]);

  // 移動可能かチェック（パズルタイプに依存）
  const checkValidMove = (board: PuzzleBoard, fromX: number, fromY: number, toX: number, toY: number): boolean => {
    // ボードの範囲内かチェック
    if (!board || !board[0]) return false;
    if (toX < 0 || toY < 0 || toX >= board[0].length || toY >= board.length) {
      return false; // ボードの範囲外
    }
    
    if (board[toY][toX].type !== 'empty') {
      return false; // 移動先が空いていない
    }
    
    // 移動できる要素かチェック
    const item = board[fromY][fromX];
    if (item.type === 'laser' || item.type === 'target' || item.type === 'obstacle') {
      return false; // 固定要素は移動できない
    }
    
    if (item.type === 'mirror' || item.type === 'prism') {
      if (item.movable === false) {
        return false; // 移動不可の要素
      }
    }
    
    // 隣接セルのみ移動可能（パズルにより調整）
    const isAdjacent = 
      (Math.abs(fromX - toX) === 1 && fromY === toY) || 
      (Math.abs(fromY - toY) === 1 && fromX === toX);
    
    return isAdjacent;
  };

  // パズルが解けたかチェック（パズルタイプに依存）
  const checkPuzzleSolved = (board: PuzzleBoard, goal: PuzzleGoal): boolean => {
    // 光線パズルの場合
    if (goal.targets && Array.isArray(goal.targets)) {
      // 各ターゲットへの光線パスをシミュレーション
      const lightPaths = simulateLightPaths(board);
      
      // すべてのターゲットが対応する色の光を受け取っているか確認
      return goal.targets.every(target => {
        const targetCell = board[target.y][target.x];
        if (targetCell.type !== 'target') return false;
        
        // このターゲットに当たる光があるか確認
        return lightPaths.some(path => {
          const lastPoint = path.points[path.points.length - 1];
          return lastPoint.x === target.x && 
                 lastPoint.y === target.y && 
                 path.color === target.color;
        });
      });
    }
    
    // その他のパズルタイプ
    return false;
  };
  
  // 光線の経路をシミュレーション
  const simulateLightPaths = (board: PuzzleBoard) => {
    const lightPaths: any[] = [];
    
    // レーザー光源を見つける
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const cell = board[y][x];
        if (cell.type === 'laser') {
          // 光源からの光線経路を追跡
          const path = traceLightPath(board, x, y, cell.angle, cell.color);
          lightPaths.push(path);
        }
      }
    }
    
    return lightPaths;
  };
  
  // 光の経路を追跡
  const traceLightPath = (board: PuzzleBoard, startX: number, startY: number, angle: number, color: string) => {
    const path = {
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
        case 0: return { dx: 1, dy: 0 }; // 右
        case 90: return { dx: 0, dy: 1 }; // 下
        case 180: return { dx: -1, dy: 0 }; // 左
        case 270: return { dx: 0, dy: -1 }; // 上
        default: {
          // 斜め方向など他の角度は今回は考慮しない
          return { dx: 0, dy: 0 };
        }
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
        currentAngle = getReflectionAngle(currentAngle, cell.angle);
      } else if (cell.type === 'prism') {
        // プリズムの場合、光の色を変えたり、屈折させたりする処理
        // 簡略化したプリズム処理
        if (currentColor === 'white') {
          // 白色光がプリズムを通ると分解
          currentColor = ['red', 'green', 'blue'][Math.floor(Math.random() * 3)];
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

  // パズル生成関数の実装例
  const generateLightPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => {
    // 8x8のボード生成
    const board: PuzzleBoard = Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ type: 'empty' }))
    );
    
    // 難易度別の設定
    if (difficulty === 'easy') {
      // 光源（レーザー）
      board[0][0] = { type: 'laser', angle: 0, color: 'red' };
      
      // 鏡の配置
      board[0][3] = { type: 'mirror', angle: 45 };
      board[3][3] = { type: 'mirror', angle: 135 };
      
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
      board[2][5] = { type: 'prism', angle: 0 };
      
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
    
    return {
      type: 'light-puzzle',
      difficulty,
      board,
      hints: [
        '鏡の角度を調整してレーザーの進路を変更しよう',
        'レーザーが障害物に当たると止まります',
        'プリズムは光の色を分解したり、光の進路を変えることができます',
        '全ての光源からの光を対応する色のターゲットに導きましょう'
      ],
      goal: {
        // 各ターゲットに対応する色の光を当てる必要がある
        targets: difficulty === 'hard' ? [
          { x: 7, y: 0, color: 'red' },
          { x: 7, y: 7, color: 'blue' }
        ] : [
          { x: difficulty === 'easy' ? 3 : 7, y: difficulty === 'easy' ? 0 : 7, color: 'red' }
        ]
      }
    };
  };

  // 微生物パズル生成関数
  const generateMicrobePuzzle = (difficulty: PuzzleDifficulty): PuzzleData => {
    // 感染経路シミュレーションパズル
    // 簡易的な施設マップとして8x8グリッドを使用
    const board: PuzzleBoard = Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ type: 'empty' }))
    );
    
    // 病気の発生源
    board[0][0] = { type: 'source', pathogen: 'virus' };
    
    // 難易度に応じて部屋・壁・人物を配置
    if (difficulty === 'easy') {
      // 壁（部屋の区切り）
      for (let i = 0; i < 8; i++) {
        if (i !== 2) board[i][3] = { type: 'wall' };
        if (i !== 5) board[3][i] = { type: 'wall' };
      }
      
      // 人物（感染する可能性がある）
      board[1][1] = { type: 'person', infected: false, id: 'p1' };
      board[1][5] = { type: 'person', infected: false, id: 'p2' };
      board[5][1] = { type: 'person', infected: false, id: 'p3' };
      board[5][5] = { type: 'person', infected: false, id: 'p4' };
      
      // 空調システム（空気感染の経路）
      board[2][2] = { type: 'vent', connected: [{ x: 5, y: 2 }] };
      board[5][2] = { type: 'vent', connected: [{ x: 2, y: 2 }] };
      
    } else if (difficulty === 'medium') {
      // より複雑なレイアウト
      // 壁の配置
      for (let i = 0; i < 8; i++) {
        if (i !== 2 && i !== 6) board[i][3] = { type: 'wall' };
        if (i !== 1 && i !== 5) board[3][i] = { type: 'wall' };
      }
      
      // 人物
      board[1][1] = { type: 'person', infected: false, id: 'p1' };
      board[1][5] = { type: 'person', infected: false, id: 'p2' };
      board[5][1] = { type: 'person', infected: false, id: 'p3' };
      board[5][5] = { type: 'person', infected: false, id: 'p4' };
      board[7][7] = { type: 'person', infected: false, id: 'p5' };
      
      // 空調システム
      board[2][2] = { type: 'vent', connected: [{ x: 5, y: 2 }, { x: 2, y: 5 }] };
      board[5][2] = { type: 'vent', connected: [{ x: 2, y: 2 }, { x: 5, y: 5 }] };
      board[2][5] = { type: 'vent', connected: [{ x: 2, y: 2 }] };
      board[5][5] = { type: 'vent', connected: [{ x: 5, y: 2 }] };
      
      // 水系統
      board[1][3] = { type: 'water', connected: [{ x: 5, y: 3 }] };
      board[5][3] = { type: 'water', connected: [{ x: 1, y: 3 }] };
      
    } else { // hard
      // 最も複雑なレイアウト
      // 複雑な壁配置
      for (let i = 0; i < 8; i++) {
        if (i % 2 !== 0) board[i][i] = { type: 'wall' };
        if (i % 2 === 0) board[i][7-i] = { type: 'wall' };
      }
      
      for (let i = 2; i < 6; i++) {
        if (i !== 3) board[i][3] = { type: 'wall' };
        if (i !== 4) board[4][i] = { type: 'wall' };
      }
      
      // 多数の人物
      board[0][2] = { type: 'person', infected: false, id: 'p1' };
      board[0][6] = { type: 'person', infected: false, id: 'p2' };
      board[2][0] = { type: 'person', infected: false, id: 'p3' };
      board[6][0] = { type: 'person', infected: false, id: 'p4' };
      board[7][3] = { type: 'person', infected: false, id: 'p5' };
      board[3][7] = { type: 'person', infected: false, id: 'p6' };
      board[4][4] = { type: 'person', infected: false, id: 'p7' };
      
      // 複雑な空調システム
      board[1][1] = { type: 'vent', connected: [{ x: 6, y: 1 }, { x: 1, y: 6 }] };
      board[6][1] = { type: 'vent', connected: [{ x: 1, y: 1 }, { x: 6, y: 6 }] };
      board[1][6] = { type: 'vent', connected: [{ x: 1, y: 1 }, { x: 6, y: 6 }] };
      board[6][6] = { type: 'vent', connected: [{ x: 6, y: 1 }, { x: 1, y: 6 }] };
      
      // 水系統
      board[2][3] = { type: 'water', connected: [{ x: 3, y: 2 }, { x: 5, y: 3 }] };
      board[3][2] = { type: 'water', connected: [{ x: 2, y: 3 }, { x: 3, y: 5 }] };
      board[5][3] = { type: 'water', connected: [{ x: 2, y: 3 }, { x: 3, y: 5 }] };
      board[3][5] = { type: 'water', connected: [{ x: 3, y: 2 }, { x: 5, y: 3 }] };
    }
    
    return {
      type: 'microbe-puzzle',
      difficulty,
      board,
      hints: [
        '感染経路には空気感染、接触感染、水系感染などがあります',
        '壁は人の移動を阻みますが、空調システムは壁を越えて感染を広げることがあります',
        '感染パターンを観察して、最も可能性の高い感染経路を特定してください'
      ],
      goal: {
        // 実際の感染者パターンと一致させる
        infectionPattern: [
          { id: 'p1', infected: true },
          { id: 'p4', infected: true },
          // 他の人物の感染状態
        ]
      },
      // 感染経路のオプション
      transmissionRoutes: [
        { id: 'airborne', name: '空気感染', selected: false },
        { id: 'contact', name: '接触感染', selected: false },
        { id: 'waterborne', name: '水系感染', selected: false }
      ]
    };
  };
  
  // 暗号パズル生成関数
  const generateCryptoPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => {
    // 暗号文（難易度に応じて複雑さが変わる）
    let encryptedMessage = '';
    let originalMessage = '';
    let cipherType = '';
    let key = '';
    
    if (difficulty === 'easy') {
      // シーザー暗号（単純な文字のシフト）
      originalMessage = 'THE SECRET LOCATION IS HIDDEN';
      cipherType = 'caesar';
      key = '3'; // 3文字シフト
      
      // シーザー暗号の実装（3文字シフト）
      encryptedMessage = originalMessage.split('').map(char => {
        if (char === ' ') return ' ';
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // 大文字アルファベット
          return String.fromCharCode(((code - 65 + 3) % 26) + 65);
        }
        return char;
      }).join('');
      
    } else if (difficulty === 'medium') {
      // 置換暗号（各文字を別の文字に置き換え）
      originalMessage = 'FIND THE QUANTUM ALGORITHM DESIGN';
      cipherType = 'substitution';
      key = 'ZYXWVUTSRQPONMLKJIHGFEDCBA'; // 逆アルファベット置換
      
      // 置換暗号の実装
      const substitutionMap: {[key: string]: string} = {};
      for (let i = 0; i < 26; i++) {
        substitutionMap[String.fromCharCode(65 + i)] = key[i];
      }
      
      encryptedMessage = originalMessage.split('').map(char => {
        if (char === ' ') return ' ';
        return substitutionMap[char] || char;
      }).join('');
      
    } else { // hard
      // ヴィジュネル暗号（複数のシーザー暗号を組み合わせる）
      originalMessage = 'PROJECT OMEGA REQUIRES QUANTUM ENTANGLEMENT';
      cipherType = 'vigenere';
      key = 'CIPHER'; // 鍵となる単語
      
      // ヴィジュネル暗号の実装
      encryptedMessage = '';
      for (let i = 0; i < originalMessage.length; i++) {
        const char = originalMessage[i];
        if (char === ' ') {
          encryptedMessage += ' ';
          continue;
        }
        
        const charCode = char.charCodeAt(0);
        const keyChar = key[i % key.length];
        const keyShift = keyChar.charCodeAt(0) - 65;
        
        if (charCode >= 65 && charCode <= 90) { // 大文字アルファベット
          const encryptedChar = String.fromCharCode(((charCode - 65 + keyShift) % 26) + 65);
          encryptedMessage += encryptedChar;
        } else {
          encryptedMessage += char;
        }
      }
    }
    
    return {
      type: 'crypto-puzzle',
      difficulty,
      encryptedMessage,
      originalMessage, // 正解メッセージ（実際のゲームでは隠す）
      cipherType,
      key,
      userInput: '', // ユーザーの解答入力用
      hints: [
        '暗号文の文字パターンを分析してみましょう',
        '頻出するアルファベットは E, T, A, O, I, N が多いです',
        '単語の区切りと短い単語（THE, AND, IS など）を手がかりにする',
        difficulty === 'hard' ? '繰り返しパターンを見つけて鍵の長さを推測する' : ''
      ].filter(Boolean),
      goal: {
        message: originalMessage
      },
      // 使用可能な暗号解読ツール
      tools: [
        { id: 'frequency', name: '頻度分析', available: true },
        { id: 'substitution', name: '置換テスト', available: true },
        { id: 'pattern', name: 'パターン認識', available: difficulty !== 'easy' }
      ]
    };
  };
  
  // 地質学パズル生成関数
  const generateGeologyPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => {
    // 地層断面図パズル
    // 8x8グリッドを使用して地層を表現
    const board: PuzzleBoard = Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ type: 'empty' }))
    );
    
    // 基本地層の生成（一番下は最古の地層）
    const layerTypes = ['bedrock', 'limestone', 'sandstone', 'shale', 'soil'];
    
    // 難易度によって地層構造を変化
    if (difficulty === 'easy') {
      // 単純な層状構造
      for (let y = 0; y < 8; y++) {
        const layerType = y < layerTypes.length ? layerTypes[y] : 'empty';
        for (let x = 0; x < 8; x++) {
          board[7-y][x] = { type: 'layer', layerType, age: (y+1) * 10 }; // 年代は下層ほど古い
        }
      }
      
      // 化石の配置
      board[6][2] = { type: 'fossil', fossilType: 'trilobite', age: 20 };
      board[5][5] = { type: 'fossil', fossilType: 'ammonite', age: 30 };
      board[3][1] = { type: 'fossil', fossilType: 'dinosaur', age: 50 };
      
    } else if (difficulty === 'medium') {
      // 断層のある構造
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          if (x < 4) {
            // 左半分（断層で持ち上げられた部分）
            const layerIndex = Math.min(Math.floor(y/2), layerTypes.length - 1);
            board[7-y][x] = { type: 'layer', layerType: layerTypes[layerIndex], age: (layerIndex+1) * 10 };
          } else {
            // 右半分
            const layerIndex = Math.min(y, layerTypes.length - 1);
            board[7-y][x] = { type: 'layer', layerType: layerTypes[layerIndex], age: (layerIndex+1) * 10 };
          }
        }
      }
      
      // 断層線
      for (let y = 0; y < 8; y++) {
        board[y][4] = { type: 'fault', direction: 'vertical' };
      }
      
      // 化石の配置
      board[6][1] = { type: 'fossil', fossilType: 'trilobite', age: 20 };
      board[6][6] = { type: 'fossil', fossilType: 'trilobite', age: 20 };
      board[4][2] = { type: 'fossil', fossilType: 'ammonite', age: 30 };
      board[3][5] = { type: 'fossil', fossilType: 'dinosaur', age: 50 };
      
    } else { // hard
      // 複雑な地質構造（断層、褶曲、貫入）
      // 基本地層
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          // 複雑なパターン生成
          let layerIndex;
          if (x < 3) {
            // 左側（褶曲構造）
            layerIndex = Math.abs((y % 6) - 3);
          } else if (x >= 5) {
            // 右側（断層）
            layerIndex = Math.floor(y/2);
          } else {
            // 中央（火成岩の貫入）
            layerIndex = (x === 4 && y > 2 && y < 6) ? 0 : Math.min(y, layerTypes.length - 1);
          }
          
          const layerType = layerIndex < layerTypes.length ? layerTypes[layerIndex] : 'empty';
          board[7-y][x] = { type: 'layer', layerType, age: (layerIndex+1) * 10 };
        }
      }
      
      // 火成岩の貫入
      for (let y = 3; y < 6; y++) {
        board[y][4] = { type: 'intrusion', rockType: 'granite', age: 15 }; // 若い年代の貫入岩
      }
      
      // 断層線
      for (let y = 0; y < 8; y++) {
        board[y][5] = { type: 'fault', direction: 'vertical' };
      }
      
      // 複雑な化石配置
      board[7][1] = { type: 'fossil', fossilType: 'trilobite', age: 20 };
      board[5][0] = { type: 'fossil', fossilType: 'trilobite', age: 20 };
      board[7][6] = { type: 'fossil', fossilType: 'trilobite', age: 20 };
      board[3][2] = { type: 'fossil', fossilType: 'ammonite', age: 30 };
      board[3][7] = { type: 'fossil', fossilType: 'ammonite', age: 30 };
      board[1][1] = { type: 'fossil', fossilType: 'dinosaur', age: 50 };
      board[0][6] = { type: 'footprint', fossilType: 'human', age: 5 }; // 問題の足跡化石
    }
    
    return {
      type: 'geology-puzzle',
      difficulty,
      board,
      hints: [
        '地層は通常、下層ほど古く、上層ほど新しい（層序の法則）',
        '同じ種類の化石は同じ時代に形成されたはず',
        '断層は地層を変位させ、相対的な年代関係を複雑にする',
        '火成岩の貫入は周囲の地層より後に形成される'
      ],
      goal: {
        // 不自然な足跡化石を特定する
        anomaly: difficulty === 'hard' ? { x: 6, y: 0, type: 'footprint' } : null,
        // 地層の正しい年代順を特定
        correctSequence: ['bedrock', 'limestone', 'sandstone', 'shale', 'soil']
      },
      // 使用可能な調査ツール
      tools: [
        { id: 'dating', name: '年代測定', available: true },
        { id: 'microscope', name: '岩石顕微鏡', available: true },
        { id: 'chemical', name: '化学分析', available: difficulty !== 'easy' }
      ]
    };
  };
  
  // AI/量子コンピューティングパズル生成関数
  const generateAIPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => {
    // 量子状態パズル（量子ビットの操作）
    // 8x1グリッドで8つの量子ビットを表現
    const board: PuzzleBoard = Array(1).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ type: 'qubit', state: '0', probability: 1.0 }))
    );
    
    // 難易度に応じた初期状態と目標状態
    let initialState = '';
    let targetState = '';
    let availableGates = [];
    
    if (difficulty === 'easy') {
      // 基本的なビット反転（NOT操作）
      initialState = '00000000';
      targetState = '11111111';
      
      // 使用可能なゲート
      availableGates = [
        { id: 'not', name: 'NOT', description: 'ビットを反転（0→1, 1→0）' }
      ];
      
    } else if (difficulty === 'medium') {
      // ハーフビットの反転（量子重ね合わせ）
      initialState = '00000000';
      targetState = '01010101';
      
      // 使用可能なゲート
      availableGates = [
        { id: 'not', name: 'NOT', description: 'ビットを反転（0→1, 1→0）' },
        { id: 'hadamard', name: 'H', description: '量子重ね合わせ状態を作る' },
        { id: 'measure', name: '測定', description: '重ね合わせ状態を測定して0か1に確定' }
      ];
      
      // 初期状態の設定
      for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
          board[0][i] = { type: 'qubit', state: '0', probability: 1.0 };
        } else {
          board[0][i] = { type: 'qubit', state: 'H', probability: 0.5 }; // 重ね合わせ状態
        }
      }
      
    } else { // hard
      // エンタングルメント（量子もつれ）を含む複雑な状態
      initialState = '00000000';
      targetState = 'entangled'; // 特殊な目標状態
      
      // 使用可能なゲート
      availableGates = [
        { id: 'not', name: 'NOT', description: 'ビットを反転（0→1, 1→0）' },
        { id: 'hadamard', name: 'H', description: '量子重ね合わせ状態を作る' },
        { id: 'cnot', name: 'CNOT', description: '制御NOTゲート（2ビット間の操作）' },
        { id: 'measure', name: '測定', description: '重ね合わせ状態を測定して0か1に確定' }
      ];
      
      // 初期状態の設定
      for (let i = 0; i < 8; i++) {
        // ランダムな初期状態
        const randomState = Math.random() > 0.5 ? '0' : '1';
        board[0][i] = { type: 'qubit', state: randomState, probability: 1.0 };
      }
    }
    
    return {
      type: 'ai-puzzle',
      difficulty,
      board,
      initialState,
      targetState,
      currentState: initialState,
      gates: availableGates,
      selectedGate: null,
      hints: [
        '量子ビットは0と1の重ね合わせ状態を取ることができます',
        'NOTゲートは古典的なビット反転操作です',
        'Hゲート（アダマールゲート）は重ね合わせ状態を作ります',
        difficulty !== 'easy' ? 'CNOTゲートを使うと2つのビットを「もつれ」させることができます' : ''
      ].filter(Boolean),
      goal: {
        state: targetState,
        // エンタングルメント状態の検証関数を定義
        checkEntanglement: (state: string) => {
          // 実際には量子もつれの検証は複雑
          // 簡易的な実装として、特定のパターンを確認
          return state.includes('E'); // Eはエンタングル状態を表す特殊マーカー
        }
      },
      // シミュレーション関連の追加機能
      simulation: {
        steps: 0,
        history: [initialState],
        isRunning: false
      }
    };
  };
  
  // マルチサイエンスパズル（最終エピソード用）
  const generateDefaultPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => {
    // 5つの科学分野を組み合わせた総合パズル
    // 各分野から要素を1つずつ含むパズルボード
    const board: PuzzleBoard = Array(5).fill(null).map(() => 
      Array(5).fill(null).map(() => ({ type: 'empty' }))
    );
    
    // 各科学分野のパズル要素を配置
    // 光学（1行目）
    board[0][0] = { type: 'laser', angle: 0, color: 'red' };
    board[0][1] = { type: 'mirror', angle: 45, movable: true };
    board[0][2] = { type: 'prism', angle: 0, rotatable: true };
    board[0][3] = { type: 'empty' };
    board[0][4] = { type: 'target', color: 'blue' };
    
    // 微生物学（2行目）
    board[1][0] = { type: 'source', pathogen: 'virus' };
    board[1][1] = { type: 'person', infected: false, id: 'p1' };
    board[1][2] = { type: 'vent', connected: [{ x: 2, y: 1 }] };
    board[1][3] = { type: 'wall' };
    board[1][4] = { type: 'person', infected: false, id: 'p2' };
    
    // 暗号学（3行目）
    board[2][0] = { type: 'cipher', text: 'ENIGMA' };
    board[2][1] = { type: 'key', value: '3' };
    board[2][2] = { type: 'decoder', method: 'caesar' };
    board[2][3] = { type: 'message', encrypted: true };
    board[2][4] = { type: 'message', encrypted: false, text: 'OMEGA' };
    
    // 地質学（4行目）
    board[3][0] = { type: 'layer', layerType: 'bedrock', age: 50 };
    board[3][1] = { type: 'fossil', fossilType: 'ancient', age: 40 };
    board[3][2] = { type: 'fault', direction: 'vertical' };
    board[3][3] = { type: 'layer', layerType: 'soil', age: 10 };
    board[3][4] = { type: 'footprint', fossilType: 'human', age: 5 };
    
    // AI/量子コンピューティング（5行目）
    board[4][0] = { type: 'qubit', state: '0', probability: 1.0 };
    board[4][1] = { type: 'gate', gateType: 'hadamard' };
    board[4][2] = { type: 'gate', gateType: 'cnot' };
    board[4][3] = { type: 'qubit', state: 'H', probability: 0.5 };
    board[4][4] = { type: 'qubit', state: 'E', probability: 0.5 }; // エンタングル状態
    
    // 難易度に応じた追加要素
    if (difficulty === 'medium' || difficulty === 'hard') {
      // 中級以上は各パズル要素の相互作用を追加
      board[0][2].affectRow = 2; // プリズムが暗号行に影響
      board[1][3].affectCol = 3; // 壁が特定の列に影響
      board[3][2].affectRow = 4; // 断層が量子行に影響
    }
    
    if (difficulty === 'hard') {
      // 上級はさらに複雑な相互作用と時間変化要素
      board[2][2].timeDependent = true; // 時間経過で変化するデコーダー
      board[4][0].affectsAll = true; // 全体に影響する量子効果
    }
    
    return {
      type: 'multi-science-puzzle',
      difficulty,
      board,
      hints: [
        '各行は異なる科学分野（光学、微生物学、暗号学、地質学、量子計算）を表しています',
        '全ての分野を正しく解くと、共通するキーワードが見つかります',
        '各分野の要素は他の分野に影響することがあります',
        '「プロジェクトΩ」のキーワードを見つけるのが目標です'
      ],
      goal: {
        keyword: 'OMEGA', // 全ての分野を解くと得られるキーワード
        // 各分野のサブゴール
        fields: [
          { id: 'optics', completed: false },
          { id: 'microbiology', completed: false },
          { id: 'cryptography', completed: false },
          { id: 'geology', completed: false },
          { id: 'quantum', completed: false }
        ]
      },
      // 各分野で使用可能なツール
      tools: [
        { id: 'physics', name: '物理学ツール', available: true },
        { id: 'biology', name: '生物学ツール', available: true },
        { id: 'mathematics', name: '数学ツール', available: true },
        { id: 'earth', name: '地球科学ツール', available: true },
        { id: 'computer', name: 'コンピュータ科学ツール', available: true }
      ]
    };
  };

  return {
    puzzle,
    loading,
    error,
    gameState,
    updatePuzzleState,
    completePuzzle,
    resetPuzzle,
    moveItem,
    rotateItem,
    getHint,
    // パズルタイプに応じた追加機能
    ...(puzzle?.type === 'crypto-puzzle' ? {
      // 暗号パズル用の追加機能
      decryptMessage: (input: string, method: string, key: string): string => {
        // 暗号解読ロジック
        if (method === 'caesar') {
          const shift = parseInt(key) || 0;
          return input.split('').map(char => {
            if (char === ' ') return ' ';
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) { // 大文字アルファベット
              return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
            }
            return char;
          }).join('');
        }
        return input; // 他の暗号方式は実装省略
      }
    } : {}),
    ...(puzzle?.type === 'ai-puzzle' ? {
      // AI/量子パズル用の追加機能
      applyGate: (gateType: string, qubitIndex: number, targetIndex?: number): void => {
        if (!puzzle || !puzzle.board) return;
        // ゲート適用ロジック
        const newBoard = [...puzzle.board.map(row => [...row])];
        const qubit = newBoard[0][qubitIndex];
        
        if (gateType === 'not') {
          // NOTゲート：0⇔1
          qubit.state = qubit.state === '0' ? '1' : qubit.state === '1' ? '0' : qubit.state;
        } else if (gateType === 'hadamard') {
          // アダマールゲート：重ね合わせ状態
          qubit.state = qubit.state === '0' || qubit.state === '1' ? 'H' : qubit.state;
          qubit.probability = 0.5;
        } else if (gateType === 'cnot' && targetIndex !== undefined) {
          // CNOT：制御ビットの値に応じて対象ビットを反転
          const targetQubit = newBoard[0][targetIndex];
          if (qubit.state === '1') {
            targetQubit.state = targetQubit.state === '0' ? '1' : targetQubit.state === '1' ? '0' : targetQubit.state;
          }
          // 特定条件でエンタングル状態に
          if (qubit.state === 'H' && (targetQubit.state === '0' || targetQubit.state === '1')) {
            qubit.state = 'E';
            targetQubit.state = 'E';
          }
        }
        
        updatePuzzleState({ board: newBoard });
        
        // 目標状態との一致を確認
        if (puzzle.goal && checkQuantumGoal(newBoard, puzzle.goal)) {
          completePuzzle(150); // 高難度なので高いスコア
        }
      }
    } : {}),
    // その他のパズルタイプに応じた追加機能も同様に実装可能
  };

};

export default usePuzzle;
