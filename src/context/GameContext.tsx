import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { 
  Player, 
  GameProgress, 
  GameContextType, 
  EpisodeData,
  CollectedItems
} from '../types/game';

// 初期の進行状況
const initialProgress: GameProgress = {
  completedEpisodes: [],
  unlockedEpisodes: [1], // 最初は第1話のみアンロック
  collectedEvidence: [],
  scienceNotes: []
};

// ゲームコンテキストの作成
export const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

// ゲームプロバイダー（状態管理）
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // プレイヤーの状態
  const [player, setPlayer] = useState<Player | null>(null);
  // 現在のエピソード
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeData | null>(null);
  // ゲームの進行状況
  const [progress, setProgress] = useState<GameProgress>(initialProgress);
  // ローディング状態
  const [loading, setLoading] = useState<boolean>(true);

  // ユーザーログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        // ユーザーのゲーム進行データを取得
        const userDoc = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDoc);
        
        if (userSnap.exists()) {
          // 既存ユーザーのデータ読み込み
          const userData = userSnap.data();
          setPlayer({
            uid: user.uid,
            displayName: user.displayName || userData.displayName,
            email: user.email || '',
            photoURL: user.photoURL || undefined,
            level: userData.level || 1,
            score: userData.score || 0
          });
          setProgress(userData.progress || initialProgress);
        } else {
          // 新規ユーザーの初期データ作成
          const newUserData = {
            displayName: user.displayName || 'Detective',
            email: user.email || '',
            photoURL: user.photoURL || '',
            level: 1,
            score: 0,
            progress: initialProgress
          };
          await setDoc(userDoc, newUserData);
          setPlayer({
            uid: user.uid,
            ...newUserData
          });
        }
      } else {
        // 未ログイン状態
        setPlayer(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // エピソードの進行を保存
  const saveProgress = async (updatedProgress: Partial<GameProgress>): Promise<void> => {
    if (!player) return;
    
    const newProgress = { ...progress, ...updatedProgress };
    setProgress(newProgress);
    
    // Firestoreに保存
    const userDoc = doc(db, 'users', player.uid);
    await updateDoc(userDoc, {
      progress: newProgress
    });
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
    if (nextEpisodeId <= 5 && !updatedProgress.unlockedEpisodes?.includes(nextEpisodeId)) {
      updatedProgress.unlockedEpisodes?.push(nextEpisodeId);
    }
    
    // 科学ノートとエビデンスの更新
    updatedProgress.scienceNotes = [...(progress.scienceNotes || []), ...collectedItems.scienceNotes];
    updatedProgress.collectedEvidence = [...(progress.collectedEvidence || []), ...collectedItems.evidence];
    
    // プレイヤースコアの更新
    const updatedPlayer = {
      ...player,
      score: player.score + score
    };
    setPlayer(updatedPlayer);
    
    // Firestoreのプレイヤー情報更新
    const userDoc = doc(db, 'users', player.uid);
    await updateDoc(userDoc, {
      score: updatedPlayer.score
    });
    
    // 進行状況の保存
    await saveProgress(updatedProgress);
  };

  // 提供する値
  const value: GameContextType = {
    player,
    setPlayer,
    currentEpisode,
    setCurrentEpisode,
    progress,
    loading,
    completeEpisode,
    saveProgress
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
