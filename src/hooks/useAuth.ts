import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthContextType } from '../types/auth';
import { Player, GameProgress } from '../types/game';

/**
 * 認証関連の機能を提供するカスタムフック
 */
const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ユーザーの認証状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      
      if (authUser) {
        // 認証ユーザーが存在する場合
        setUser(authUser);
        
        // プレイヤーデータをFirestoreから取得
        try {
          const playerDoc = await getDoc(doc(db, 'users', authUser.uid));
          
          if (playerDoc.exists()) {
            // 既存ユーザーのデータ取得
            const playerData = playerDoc.data() as Player;
            setPlayer({
              uid: authUser.uid,
              displayName: playerData.displayName || authUser.displayName || 'Detective',
              email: playerData.email || authUser.email || '',
              photoURL: playerData.photoURL || authUser.photoURL || undefined,
              level: playerData.level || 1,
              score: playerData.score || 0,
              progress: playerData.progress || {
                completedEpisodes: [],
                unlockedEpisodes: [1],
                collectedEvidence: [],
                scienceNotes: []
              }
            });
          } else {
            // 新規ユーザー用の初期データを作成
            const newPlayer: Player = {
              uid: authUser.uid,
              displayName: authUser.displayName || 'Detective',
              email: authUser.email || '',
              photoURL: authUser.photoURL || undefined,
              level: 1,
              score: 0,
              progress: {
                completedEpisodes: [],
                unlockedEpisodes: [1], // 最初は第1話のみアンロック
                collectedEvidence: [],
                scienceNotes: []
              }
            };
            
            // Firestoreに保存
            await setDoc(doc(db, 'users', authUser.uid), newPlayer);
            setPlayer(newPlayer);
          }
        } catch (err) {
          console.error('プレイヤーデータの取得に失敗:', err);
          setError('プレイヤーデータの取得に失敗しました');
        }
      } else {
        // 未ログイン状態
        setUser(null);
        setPlayer(null);
      }
      
      setLoading(false);
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  // メールとパスワードでログイン
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 新規ユーザー登録
  const signup = async (email: string, password: string, displayName: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // ユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // プロフィール更新
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      // Firestoreにユーザーデータを保存
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: displayName,
        email: email,
        level: 1,
        score: 0,
        createdAt: new Date(),
        progress: {
          completedEpisodes: [],
          unlockedEpisodes: [1], // 最初は第1話のみアンロック
          collectedEvidence: [],
          scienceNotes: []
        }
      });
      
      setUser(userCredential.user);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Googleでログイン
  const loginWithGoogle = async (): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Firestoreにユーザーデータが存在するか確認
      const userDoc = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userDoc);
      
      if (!userSnap.exists()) {
        // 初回ログインならユーザーデータを作成
        await setDoc(userDoc, {
          displayName: userCredential.user.displayName || 'Detective',
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          level: 1,
          score: 0,
          createdAt: new Date(),
          progress: {
            completedEpisodes: [],
            unlockedEpisodes: [1], // 最初は第1話のみアンロック
            collectedEvidence: [],
            scienceNotes: []
          }
        });
      }
      
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // パスワードリセットメールの送信
  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ユーザープロフィールの更新
  const updateUserProfile = async (displayName?: string, photoURL?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (!auth.currentUser) throw new Error('ユーザーが認証されていません');
      
      const updates: { displayName?: string; photoURL?: string } = {};
      if (displayName) updates.displayName = displayName;
      if (photoURL) updates.photoURL = photoURL;
      
      await updateProfile(auth.currentUser, updates);
      
      // Firestoreの情報も更新
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, updates);
      
      setUser({ ...auth.currentUser });
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // プレイヤーの進行状況を更新
  const updatePlayerProgress = async (progress: Partial<GameProgress>): Promise<void> => {
    if (!user || !player) {
      setError('ユーザーがログインしていません');
      throw new Error('ユーザーがログインしていません');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 更新するプレイヤー情報
      const updatedProgress = {
        ...player.progress,
        ...progress
      };
      
      // 更新するプレイヤーオブジェクト
      const updatedPlayer = {
        ...player,
        progress: updatedProgress
      };
      
      // Firestoreに保存
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        progress: updatedProgress
      });
      
      // ローカル状態を更新
      setPlayer(updatedPlayer);
    } catch (err) {
      console.error('進行状況の更新に失敗:', err);
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    player,
    loading,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    updatePlayerProgress
  };
};

export default useAuth;
