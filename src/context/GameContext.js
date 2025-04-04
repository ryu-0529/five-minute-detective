import { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// ゲームコンテキストの作成
export const GameContext = createContext();

// ゲームプロバイダー（状態管理）
export const GameProvider = ({ children }) => {
  // プレイヤーの状態
  const [player, setPlayer] = useState(null);
  // 現在のエピソード
  const [currentEpisode, setCurrentEpisode] = useState(null);
  // ゲームの進行状況
  const [progress, setProgress] = useState({
    completedEpisodes: [],
    unlockedEpisodes: [1], // 最初は第1話のみアンロック
    collectedEvidence: [],
    scienceNotes: []
  });
  // ローディング状態
  const [loading, setLoading] = useState(true);

  // ユーザーログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
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
            email: user.email,
            photoURL: user.photoURL,
            level: userData.level || 1,
            score: userData.score || 0
          });
          setProgress(userData.progress || progress);
        } else {
          // 新規ユーザーの初期データ作成
          const newUserData = {
            displayName: user.displayName || 'Detective',
            email: user.email,
            photoURL: user.photoURL,
            level: 1,
            score: 0,
            progress: progress
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
  const saveProgress = async (updatedProgress) => {
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
  const completeEpisode = async (episodeId, score, collectedItems) => {
    // 次のエピソードをアンロック
    const nextEpisodeId = episodeId + 1;
    const updatedProgress = {
      completedEpisodes: [...progress.completedEpisodes, episodeId],
      unlockedEpisodes: [...progress.unlockedEpisodes]
    };
    
    // 次のエピソードがあればアンロック
    if (nextEpisodeId <= 5 && !updatedProgress.unlockedEpisodes.includes(nextEpisodeId)) {
      updatedProgress.unlockedEpisodes.push(nextEpisodeId);
    }
    
    // 科学ノートとエビデンスの更新
    updatedProgress.scienceNotes = [...progress.scienceNotes, ...collectedItems.scienceNotes];
    updatedProgress.collectedEvidence = [...progress.collectedEvidence, ...collectedItems.evidence];
    
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
  const value = {
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
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
