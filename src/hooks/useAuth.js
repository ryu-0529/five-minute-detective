import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * 認証関連の機能を提供するカスタムフック
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 新規ユーザー登録
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // ユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // プロフィール更新
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Firestoreにユーザーデータを保存
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: name,
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
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Googleでログイン
  const loginWithGoogle = async () => {
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
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // パスワードリセットメールの送信
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ユーザープロフィールの更新
  const updateUserProfile = async (displayName, photoURL) => {
    setLoading(true);
    setError(null);
    try {
      const updates = {};
      if (displayName) updates.displayName = displayName;
      if (photoURL) updates.photoURL = photoURL;
      
      await updateProfile(auth.currentUser, updates);
      
      // Firestoreの情報も更新
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, updates);
      
      setUser({ ...auth.currentUser });
    } catch (err) {
      setError(err.message);
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
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };
};

export default useAuth;
