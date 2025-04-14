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
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthContextType } from '../types/auth';

/**
 * 認証関連の機能を提供するカスタムフック
 */
const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ユーザーの認証状態を監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // 認証ユーザーが存在する場合
        setUser(authUser);
      } else {
        setUser(null);
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

  return {
    user,
    loading,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };
};

export default useAuth;
