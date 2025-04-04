import { useState, useEffect, useCallback } from 'react';

/**
 * 科学パズルのロジックを処理するカスタムフック
 * @param {string} puzzleType - パズルのタイプ (light-puzzle, microbe-puzzle など)
 * @param {string} difficulty - 難易度 (easy, medium, hard)
 * @param {function} onComplete - パズル完了時のコールバック関数
 */
const usePuzzle = (puzzleType, difficulty, onComplete) => {
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState({
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
      let generatedPuzzle;
      
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
      setError('パズルの生成に失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [puzzleType, difficulty]);

  // パズル完了の処理
  const completePuzzle = useCallback((score) => {
    if (gameState.completed) return;
    
    const endTime = new Date();
    const timeTaken = (endTime - gameState.startTime) / 1000; // 秒単位
    
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
  const updatePuzzleState = useCallback((update, incrementMoves = true) => {
    setPuzzle(prev => ({ ...prev, ...update }));
    
    if (incrementMoves) {
      setGameState(prev => ({
        ...prev,
        moves: prev.moves + 1
      }));
    }
  }, []);

  // パズルのリセット
  const resetPuzzle = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      // パズルを再生成
      let generatedPuzzle;
      
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
      setError('パズルのリセットに失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [puzzleType, difficulty]);

  // パズルの特定要素を移動
  const moveItem = useCallback((fromX, fromY, toX, toY) => {
    if (!puzzle || !puzzle.board) return;
    if (gameState.completed) return;
    
    // 移動可能かチェック
    const isValidMove = checkValidMove(puzzle.board, fromX, fromY, toX, toY);
    
    if (isValidMove) {
      const newBoard = [...puzzle.board];
      const item = newBoard[fromY][fromX];
      newBoard[fromY][fromX] = { type: 'empty' };
      newBoard[toX][toY] = item;
      
      updatePuzzleState({ board: newBoard });
      
      // 移動後にパズルの状態をチェック
      const isPuzzleSolved = checkPuzzleSolved(newBoard, puzzle.goal);
      if (isPuzzleSolved) {
        completePuzzle(100); // 基本スコア 100 で完了
      }
    }
  }, [puzzle, gameState.completed, updatePuzzleState, completePuzzle]);

  // 要素を回転
  const rotateItem = useCallback((x, y, angle) => {
    if (!puzzle || !puzzle.board) return;
    if (gameState.completed) return;
    
    const newBoard = [...puzzle.board];
    const item = newBoard[y][x];
    
    if (item.angle !== undefined) {
      newBoard[y][x] = {
        ...item,
        angle: (item.angle + angle) % 360
      };
      
      updatePuzzleState({ board: newBoard });
      
      // 回転後にパズルの状態をチェック
      const isPuzzleSolved = checkPuzzleSolved(newBoard, puzzle.goal);
      if (isPuzzleSolved) {
        completePuzzle(100); // 基本スコア 100 で完了
      }
    }
  }, [puzzle, gameState.completed, updatePuzzleState, completePuzzle]);

  // ヒントの取得
  const getHint = useCallback(() => {
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
  const checkValidMove = (board, fromX, fromY, toX, toY) => {
    // 実装例（シンプルな実装）
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
  const checkPuzzleSolved = (board, goal) => {
    // 実装例（シンプルな実装、実際はパズルのロジックに応じて変更）
    return false;
  };

  // パズル生成関数の実装例（実際にはもっと複雑なロジックになる）
  const generateLightPuzzle = (difficulty) => {
    // 実装例：光パズルの生成
    return {
      type: 'light-puzzle',
      difficulty,
      board: [
        // 8x8のボード例
        Array(8).fill().map(() => ({ type: 'empty' })),
        Array(8).fill().map(() => ({ type: 'empty' })),
        Array(8).fill().map(() => ({ type: 'empty' })),
        Array(8).fill().map(() => ({ type: 'empty' })),
        Array(8).fill().map(() => ({ type: 'empty' })),
        Array(8).fill().map(() => ({ type: 'empty' })),
        Array(8).fill().map(() => ({ type: 'empty' })),
        Array(8).fill().map(() => ({ type: 'empty' })),
      ],
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
  const generateMicrobePuzzle = (difficulty) => ({ type: 'microbe-puzzle', difficulty });
  const generateCryptoPuzzle = (difficulty) => ({ type: 'crypto-puzzle', difficulty });
  const generateGeologyPuzzle = (difficulty) => ({ type: 'geology-puzzle', difficulty });
  const generateAIPuzzle = (difficulty) => ({ type: 'ai-puzzle', difficulty });
  const generateDefaultPuzzle = (difficulty) => ({ type: 'default-puzzle', difficulty });

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
