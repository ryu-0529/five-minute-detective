import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { 
  Player, 
  GameProgress, 
  GameContextType, 
  EpisodeData,
  CollectedItems,
  EthicalChoice
} from '../types/game';

// 初期の進行状況
const initialProgress: GameProgress = {
  completedEpisodes: [],
  unlockedEpisodes: [1], // 最初は第1話のみアンロック
  collectedEvidence: [],
  scienceNotes: [],
  suspectTrustLevels: {}, // 容疑者ごとの信頼度
  aiTrustLevel: 50, // アイリスとの初期信頼関係は50%
  revealedMotivePanels: {}, // 明らかになった動機カードのパネル
  ethicalChoices: [], // 倫理的選択の履歴
  conspiracyAwarenessLevel: 0, // 陰謀論意識レベル（0-100）:高いほど陰謀論を疑う
  criticalThinkingScore: 0 // 批判的思考スキルスコア（0-100）:高いほど科学的思考が優れている
};

// ゲームコンテキストの作成
export const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

// ゲームプロバイダー（状態管理）
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // 認証情報の取得
  const { player, loading: authLoading, updatePlayerProgress } = useAuth();
  
  // 現在のエピソード
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeData | null>(null);
  // ゲームの進行状況
  const [progress, setProgress] = useState<GameProgress>(initialProgress);
  // ローディング状態
  const [loading, setLoading] = useState<boolean>(true);

  // プレイヤー情報が変わったときに進行状況を更新
  useEffect(() => {
    if (player && player.progress) {
      setProgress(player.progress);
    }
    
    setLoading(authLoading);
  }, [player, authLoading]);

  // エピソードの進行を保存
  const saveProgress = async (updatedProgress: Partial<GameProgress>): Promise<void> => {
    if (!player) return;
    
    // ローカルの状態を更新
    const newProgress = { ...progress, ...updatedProgress };
    setProgress(newProgress);
    
    // Firestoreに保存（useAuthのupdatePlayerProgressを使用）
    await updatePlayerProgress(updatedProgress);
  };

  // エピソードの完了
  const completeEpisode = async (episodeId: number, score: number, collectedItems: CollectedItems): Promise<void> => {
    if (!player) return;
    
    // 次のエピソードをアンロック
    const nextEpisodeId = episodeId + 1;
    const updatedProgress: Partial<GameProgress> = {
      completedEpisodes: [...progress.completedEpisodes, episodeId],
      unlockedEpisodes: [...progress.unlockedEpisodes]
    };
    
    // 次のエピソードがあればアンロック
    if (nextEpisodeId <= 6 && !updatedProgress.unlockedEpisodes?.includes(nextEpisodeId)) {
      updatedProgress.unlockedEpisodes?.push(nextEpisodeId);
    }
    
    // 科学ノートとエビデンスの更新
    updatedProgress.scienceNotes = [...(progress.scienceNotes || []), ...collectedItems.scienceNotes];
    updatedProgress.collectedEvidence = [...(progress.collectedEvidence || []), ...collectedItems.evidence];
    
    // 動機カードパネルの更新
    const updatedRevealedPanels = { ...progress.revealedMotivePanels };
    collectedItems.revealedPanels.forEach(({suspectId, panelId}) => {
      if (!updatedRevealedPanels[suspectId]) {
        updatedRevealedPanels[suspectId] = [];
      }
      if (!updatedRevealedPanels[suspectId].includes(panelId)) {
        updatedRevealedPanels[suspectId].push(panelId);
      }
    });
    updatedProgress.revealedMotivePanels = updatedRevealedPanels;
    
    // ローカルの進行状況を更新
    setProgress({
      ...progress,
      ...updatedProgress
    });
    
    // プレイヤースコアとプログレスをFirestoreに更新
    // スコアの更新はFirebaseの関数内で処理
    const userDoc = doc(db, 'users', player.uid);
    await updateDoc(userDoc, {
      score: player.score + score
    });
    
    // 進行状況の保存
    await updatePlayerProgress(updatedProgress);
  };

  // 容疑者との信頼度を更新
  const updateTrustLevel = async (suspectId: string, amount: number): Promise<void> => {
    if (!player) return;
    
    const updatedTrustLevels = { ...progress.suspectTrustLevels };
    if (!updatedTrustLevels[suspectId]) {
      updatedTrustLevels[suspectId] = 50; // 初期値50%
    }
    
    // 信頼度を0-100の範囲内に収める
    updatedTrustLevels[suspectId] = Math.max(0, Math.min(100, updatedTrustLevels[suspectId] + amount));
    
    await saveProgress({ suspectTrustLevels: updatedTrustLevels });
  };

  // AIとの信頼度を更新
  const updateAITrustLevel = async (amount: number): Promise<void> => {
    if (!player) return;
    
    // 信頼度を0-100の範囲内に収める
    const updatedAITrustLevel = Math.max(0, Math.min(100, progress.aiTrustLevel + amount));
    
    await saveProgress({ aiTrustLevel: updatedAITrustLevel });
  };

  // 動機カードのパネルを公開
  const revealMotivePanel = async (suspectId: string, panelId: number): Promise<void> => {
    if (!player) return;
    
    const updatedRevealedPanels = { ...progress.revealedMotivePanels };
    if (!updatedRevealedPanels[suspectId]) {
      updatedRevealedPanels[suspectId] = [];
    }
    
    if (!updatedRevealedPanels[suspectId].includes(panelId)) {
      updatedRevealedPanels[suspectId].push(panelId);
      await saveProgress({ revealedMotivePanels: updatedRevealedPanels });
    }
  };

  // 倫理的選択を行う
  const makeEthicalChoice = async (episodeId: number, choice: EthicalChoice): Promise<void> => {
    if (!player) return;
    
    const updatedEthicalChoices = [...progress.ethicalChoices, choice];
    
    // 社会信頼度と科学信頼度の更新
    const currentSocialTrust = player.socialTrustScore || 50; // 初期値50%
    const currentScienceTrust = player.scienceTrustScore || 50; // 初期値50%
    
    const updatedSocialTrust = Math.max(0, Math.min(100, currentSocialTrust + choice.impact.socialTrust));
    const updatedScienceTrust = Math.max(0, Math.min(100, currentScienceTrust + choice.impact.scienceTrust));
    
    // Firestoreに保存
    const userDoc = doc(db, 'users', player.uid);
    await updateDoc(userDoc, {
      socialTrustScore: updatedSocialTrust,
      scienceTrustScore: updatedScienceTrust
    });
    
    await saveProgress({ ethicalChoices: updatedEthicalChoices });
  };

  // 裏ストーリーを予測する（キーワード選択）
  const predictBackstory = async (suspectId: string, selectedKeywords: string[]): Promise<number> => {
    if (!currentEpisode || !player) return 0;
    
    // 本来はこの部分で選択したキーワードと正解のキーワードを比較してスコアを計算する
    // 仮の実装として正解キーワードは各容疑者のmotiveからキーワードを抽出したものとする
    const suspect = currentEpisode.suspects.find(s => s.id === suspectId);
    if (!suspect) return 0;
    
    // 仮の正解キーワード (実際の実装では正解のキーワードはサーバーサイドかデータファイルで管理)
    const correctKeywords = suspect.motive.toLowerCase().split(' ').filter(w => w.length > 3);
    
    // 一致するキーワードの数に基づいてスコアを計算
    let score = 0;
    selectedKeywords.forEach(keyword => {
      if (correctKeywords.includes(keyword.toLowerCase())) {
        score += 20; // 1つ正解につき20ポイント
      }
    });
    
    // 信頼度上昇
    await updateTrustLevel(suspectId, 5); // 予測を行うだけで信頼度が少し上昇
    
    return score;
  };

  // 陰謀論意識レベルの更新
  const updateConspiracyAwareness = async (amount: number): Promise<void> => {
    if (!player) return;
    
    // 0-100の範囲内に収める
    const updatedLevel = Math.max(0, Math.min(100, progress.conspiracyAwarenessLevel + amount));
    
    await saveProgress({ conspiracyAwarenessLevel: updatedLevel });
  };

  // 批判的思考スキルの更新
  const updateCriticalThinking = async (amount: number): Promise<void> => {
    if (!player) return;
    
    // 0-100の範囲内に収める
    const updatedScore = Math.max(0, Math.min(100, progress.criticalThinkingScore + amount));
    
    await saveProgress({ criticalThinkingScore: updatedScore });
  };

  // 提供する値
  const value: GameContextType = {
    player,
    setPlayer: () => {}, // 空の関数（useAuthを使用するため）
    currentEpisode,
    setCurrentEpisode,
    progress,
    loading,
    completeEpisode,
    saveProgress,
    updateTrustLevel,
    updateAITrustLevel,
    revealMotivePanel,
    makeEthicalChoice,
    predictBackstory,
    updateConspiracyAwareness,
    updateCriticalThinking
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// コンテキストを使用するためのカスタムフック
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
