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
    
    // 隣接セルのみ移動可能（パズルにより調整）
    const isAdjacent = 
      (Math.abs(fromX - toX) === 1 && fromY === toY) || 
      (Math.abs(fromY - toY) === 1 && fromX === toX);
    
    return isAdjacent;
  };

  // パズルが解けたかチェック（パズルタイプに依存）
  const checkPuzzleSolved = (board: PuzzleBoard, goal: PuzzleGoal): boolean => {
    // 実装例（シンプルな実装、実際はパズルのロジックに応じて変更）
    return false;
  };

  // パズル生成関数の実装例
  const generateLightPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => {
    // 実装例：光パズルの生成
    // 8x8のボード例
    const board: PuzzleBoard = Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ type: 'empty' }))
    );
    
    return {
      type: 'light-puzzle',
      difficulty,
      board,
      hints: [
        '鏡の角度を調整してレーザーの進路を変更しよう',
        'レーザーが障害物に当たると止まります',
        'プリズムは光の色を分解することができます'
      ],
      goal: {
        // ゴール条件
      }
    };
  };

  // 他のパズル生成関数の骨格
  const generateMicrobePuzzle = (difficulty: PuzzleDifficulty): PuzzleData => ({ 
    type: 'microbe-puzzle', 
    difficulty 
  });
  
  const generateCryptoPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => ({ 
    type: 'crypto-puzzle', 
    difficulty 
  });
  
  const generateGeologyPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => ({ 
    type: 'geology-puzzle', 
    difficulty 
  });
  
  const generateAIPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => ({ 
    type: 'ai-puzzle', 
    difficulty 
  });
  
  const generateDefaultPuzzle = (difficulty: PuzzleDifficulty): PuzzleData => ({ 
    type: 'default-puzzle', 
    difficulty 
  });

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
    getHint
  };
};

export default usePuzzle;
