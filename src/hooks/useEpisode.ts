import { useState, useEffect } from 'react';
import { getEpisodeById } from '../data/episodes-data';
import { useGame } from '../context/GameContext';
import { 
  EpisodeData, 
  GameStage, 
  CollectedItems 
} from '../types/game';

interface GameState {
  currentStage: GameStage;
  timeRemaining: number;
  timerActive: boolean;
  collectedItems: CollectedItems;
  selectedSuspect: string | null;
  gameCompleted: boolean;
  score: number;
}

/**
 * エピソードデータと関連機能を提供するカスタムフック
 * @param episodeId - エピソードID
 */
const useEpisode = (episodeId: string | number) => {
  const { progress, completeEpisode } = useGame();
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentStage: GameStage.INTRO,
    timeRemaining: 300, // 5分（秒数）
    timerActive: false,
    collectedItems: {
      evidence: [],
      scienceNotes: []
    },
    selectedSuspect: null,
    gameCompleted: false,
    score: 0
  });

  // エピソードデータの読み込み
  useEffect(() => {
    if (episodeId) {
      setLoading(true);
      try {
        const data = getEpisodeById(typeof episodeId === 'string' ? parseInt(episodeId) : episodeId);
        if (data) {
          setEpisode(data);
          setGameState(prev => ({
            ...prev,
            timeRemaining: data.timeLimit || 300
          }));
        } else {
          setError('エピソードが見つかりません');
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
  }, [episodeId]);

  // タイマー処理
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameState.timerActive && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (gameState.timeRemaining === 0 && gameState.timerActive) {
      // 時間切れの処理
      handleTimeUp();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.timerActive, gameState.timeRemaining]);

  // ゲーム開始
  const startGame = (): void => {
    setGameState(prev => ({
      ...prev,
      timerActive: true,
      currentStage: GameStage.INVESTIGATION
    }));
  };

  // 時間切れの処理
  const handleTimeUp = (): void => {
    setGameState(prev => {
      // 現在のステージに応じた処理
      if (prev.currentStage === GameStage.INVESTIGATION) {
        // 調査中に時間切れ: 強制的に証拠レビューステージへ
        return { ...prev, timerActive: false, currentStage: GameStage.EVIDENCE_REVIEW };
      } else if (
        prev.currentStage === GameStage.EVIDENCE_REVIEW || 
        prev.currentStage === GameStage.SCIENCE_LEARNING
      ) {
        // レビュー中に時間切れ: 解決ステージへ
        return { ...prev, timerActive: false, currentStage: GameStage.SOLVING };
      } else if (prev.currentStage === GameStage.SOLVING) {
        // 解決中に時間切れ: 強制終了
        handleSolve(null);
        return { ...prev, timerActive: false };
      }
      return { ...prev, timerActive: false };
    });
  };

  // 証拠品を収集
  const collectEvidence = (evidenceId: string): void => {
    if (!gameState.collectedItems.evidence.includes(evidenceId)) {
      setGameState(prev => ({
        ...prev,
        collectedItems: {
          ...prev.collectedItems,
          evidence: [...prev.collectedItems.evidence, evidenceId]
        },
        score: prev.score + 10 // ボーナススコア
      }));
    }
  };

  // 科学的概念を学習
  const learnScienceConcept = (conceptId: string): void => {
    if (!gameState.collectedItems.scienceNotes.includes(conceptId)) {
      setGameState(prev => ({
        ...prev,
        collectedItems: {
          ...prev.collectedItems,
          scienceNotes: [...prev.collectedItems.scienceNotes, conceptId]
        },
        score: prev.score + 15 // ボーナススコア
      }));
    }
  };

  // 調査ステージ完了
  const completeInvestigation = (): void => {
    setGameState(prev => ({
      ...prev,
      currentStage: GameStage.EVIDENCE_REVIEW
    }));
  };

  // 証拠レビューステージ完了
  const completeEvidenceReview = (): void => {
    setGameState(prev => ({
      ...prev,
      currentStage: GameStage.SCIENCE_LEARNING
    }));
  };

  // 科学学習ステージ完了
  const completeScienceLearning = (): void => {
    setGameState(prev => ({
      ...prev,
      currentStage: GameStage.SOLVING
    }));
  };

  // 謎解き（犯人選択）
  const handleSolve = (suspectId: string | null): void => {
    // タイマー停止
    setGameState(prev => {
      if (!episode) return prev;
      
      const isCorrect = suspectId === episode.solution.culprit;
      
      // スコア計算
      const timeBonus = Math.max(0, prev.timeRemaining);
      const correctBonus = isCorrect ? 100 : 0;
      const evidenceBonus = prev.collectedItems.evidence.length * 10;
      const scienceBonus = prev.collectedItems.scienceNotes.length * 15;
      
      const totalScore = timeBonus + correctBonus + evidenceBonus + scienceBonus;
      
      // エピソード完了をコンテキストに保存
      if (episodeId) {
        completeEpisode(
          typeof episodeId === 'string' ? parseInt(episodeId) : episodeId,
          totalScore,
          prev.collectedItems
        );
      }
      
      return {
        ...prev,
        selectedSuspect: suspectId,
        timerActive: false,
        gameCompleted: true,
        currentStage: GameStage.CONCLUSION,
        score: totalScore
      };
    });
  };

  // ゲーム状態のリセット
  const resetGame = (): void => {
    setGameState({
      currentStage: GameStage.INTRO,
      timeRemaining: episode?.timeLimit || 300,
      timerActive: false,
      collectedItems: {
        evidence: [],
        scienceNotes: []
      },
      selectedSuspect: null,
      gameCompleted: false,
      score: 0
    });
  };

  // エピソードのアンロック状態を確認
  const isEpisodeUnlocked = (): boolean => {
    if (!progress || !episodeId) return false;
    return progress.unlockedEpisodes.includes(
      typeof episodeId === 'string' ? parseInt(episodeId) : episodeId
    );
  };

  // エピソードの完了状態を確認
  const isEpisodeCompleted = (): boolean => {
    if (!progress || !episodeId) return false;
    return progress.completedEpisodes.includes(
      typeof episodeId === 'string' ? parseInt(episodeId) : episodeId
    );
  };

  return {
    episode,
    loading,
    error,
    gameState,
    startGame,
    collectEvidence,
    learnScienceConcept,
    completeInvestigation,
    completeEvidenceReview,
    completeScienceLearning,
    handleSolve,
    resetGame,
    isEpisodeUnlocked,
    isEpisodeCompleted
  };
};

export default useEpisode;
