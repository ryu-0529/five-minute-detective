import { useState, useEffect } from 'react';
import { getEpisodeById } from '../data/episodes';
import { useGame } from '../context/GameContext';

/**
 * エピソードデータと関連機能を提供するカスタムフック
 * @param {number} episodeId - エピソードID
 */
const useEpisode = (episodeId) => {
  const { progress, completeEpisode } = useGame();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState({
    currentStage: 'intro', // intro, investigation, evidence_review, science_learning, solving, conclusion
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
        const data = getEpisodeById(parseInt(episodeId));
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [episodeId]);

  // タイマー処理
  useEffect(() => {
    let interval = null;
    
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
    
    return () => clearInterval(interval);
  }, [gameState.timerActive, gameState.timeRemaining]);

  // ゲーム開始
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      timerActive: true,
      currentStage: 'investigation'
    }));
  };

  // 時間切れの処理
  const handleTimeUp = () => {
    setGameState(prev => {
      // 現在のステージに応じた処理
      if (prev.currentStage === 'investigation') {
        // 調査中に時間切れ: 強制的に証拠レビューステージへ
        return { ...prev, timerActive: false, currentStage: 'evidence_review' };
      } else if (
        prev.currentStage === 'evidence_review' || 
        prev.currentStage === 'science_learning'
      ) {
        // レビュー中に時間切れ: 解決ステージへ
        return { ...prev, timerActive: false, currentStage: 'solving' };
      } else if (prev.currentStage === 'solving') {
        // 解決中に時間切れ: 強制終了
        handleSolve(null);
        return { ...prev, timerActive: false };
      }
      return { ...prev, timerActive: false };
    });
  };

  // 証拠品を収集
  const collectEvidence = (evidenceId) => {
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
  const learnScienceConcept = (conceptId) => {
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
  const completeInvestigation = () => {
    setGameState(prev => ({
      ...prev,
      currentStage: 'evidence_review'
    }));
  };

  // 証拠レビューステージ完了
  const completeEvidenceReview = () => {
    setGameState(prev => ({
      ...prev,
      currentStage: 'science_learning'
    }));
  };

  // 科学学習ステージ完了
  const completeScienceLearning = () => {
    setGameState(prev => ({
      ...prev,
      currentStage: 'solving'
    }));
  };

  // 謎解き（犯人選択）
  const handleSolve = (suspectId) => {
    // タイマー停止
    setGameState(prev => {
      const isCorrect = suspectId === episode?.solution.culprit;
      
      // スコア計算
      const timeBonus = Math.max(0, prev.timeRemaining);
      const correctBonus = isCorrect ? 100 : 0;
      const evidenceBonus = prev.collectedItems.evidence.length * 10;
      const scienceBonus = prev.collectedItems.scienceNotes.length * 15;
      
      const totalScore = timeBonus + correctBonus + evidenceBonus + scienceBonus;
      
      // エピソード完了をコンテキストに保存
      if (episodeId) {
        completeEpisode(
          parseInt(episodeId),
          totalScore,
          prev.collectedItems
        );
      }
      
      return {
        ...prev,
        selectedSuspect: suspectId,
        timerActive: false,
        gameCompleted: true,
        currentStage: 'conclusion',
        score: totalScore
      };
    });
  };

  // ゲーム状態のリセット
  const resetGame = () => {
    setGameState({
      currentStage: 'intro',
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
  const isEpisodeUnlocked = () => {
    return progress?.unlockedEpisodes.includes(parseInt(episodeId));
  };

  // エピソードの完了状態を確認
  const isEpisodeCompleted = () => {
    return progress?.completedEpisodes.includes(parseInt(episodeId));
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
