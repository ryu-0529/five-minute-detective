import { useState } from 'react';
import { db } from '../services/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentReference,
  WhereFilterOp,
  OrderByDirection,
  Unsubscribe
} from 'firebase/firestore';
import { FirestoreContextType } from '../types/auth';
import { GameProgress, Player } from '../types/game';

interface DocumentWithId extends DocumentData {
  id: string;
}

/**
 * Firestoreデータの操作を行うカスタムフック
 * @param collectionName - コレクション名
 */
const useFirestore = (collectionName: string) => {
  const [documents, setDocuments] = useState<DocumentWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // コレクション全体の取得（一度のみ）
  const getCollection = async (constraints: QueryConstraint[] = []): Promise<DocumentWithId[]> => {
    setLoading(true);
    setError(null);
    try {
      let q = collection(db, collectionName);
      
      // 制約を追加（where, orderBy, limitなど）
      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }
      
      const querySnapshot = await getDocs(q);
      const docs: DocumentWithId[] = [];
      
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        docs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setDocuments(docs);
      return docs;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // リアルタイムでコレクションを監視
  const subscribeToCollection = (
    constraints: QueryConstraint[] = [], 
    callback?: (docs: DocumentWithId[]) => void
  ): Unsubscribe => {
    setLoading(true);
    setError(null);
    
    try {
      let q = collection(db, collectionName);
      
      // 制約を追加
      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }
      
      // リアルタイムリスナーを設定
      const unsubscribe = onSnapshot(
        q, 
        (querySnapshot: QuerySnapshot) => {
          const docs: DocumentWithId[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            docs.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setDocuments(docs);
          setLoading(false);
          if (callback) callback(docs);
        }, 
        (err: Error) => {
          setError(err.message);
          setLoading(false);
        }
      );
      
      // クリーンアップ関数を返す
      return unsubscribe;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      throw err;
    }
  };

  // 単一ドキュメントの取得
  const getDocument = async (docId: string): Promise<DocumentWithId | null> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const document: DocumentWithId = {
          id: docSnap.id,
          ...docSnap.data()
        };
        return document;
      } else {
        return null;
      }
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメントの作成または更新
  const setDocument = async (docId: string, data: DocumentData): Promise<DocumentWithId> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
      return { id: docId, ...data };
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメントの更新（一部フィールドのみ）
  const updateDocument = async (docId: string, data: DocumentData): Promise<DocumentWithId> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      return { id: docId, ...data };
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメントの削除
  const deleteDocument = async (docId: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return docId;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // where制約の作成ヘルパー関数
  const whereConstraint = (field: string, operator: WhereFilterOp, value: unknown): QueryConstraint => {
    return where(field, operator, value);
  };

  // orderBy制約の作成ヘルパー関数
  const orderByConstraint = (field: string, direction: OrderByDirection = 'asc'): QueryConstraint => {
    return orderBy(field, direction);
  };

  // limit制約の作成ヘルパー関数
  const limitConstraint = (limitCount: number): QueryConstraint => {
    return limit(limitCount);
  };

  // ユーザーの進行状況を取得
  const getUserProgress = async (userId: string): Promise<GameProgress | null> => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists() && userSnap.data()?.progress) {
        return userSnap.data().progress as GameProgress;
      }
      return null;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // ユーザーの進行状況を更新
  const updateUserProgress = async (userId: string, data: Partial<GameProgress>): Promise<void> => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        // 既存の進行状況と新しいデータをマージ
        const existingProgress = userSnap.data().progress || {};
        const updatedProgress = { ...existingProgress, ...data };
        
        await updateDoc(userDoc, {
          progress: updatedProgress
        });
      }
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // ユーザープロフィールを取得
  const getUserProfile = async (userId: string): Promise<Player | null> => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
          uid: userId,
          displayName: userData.displayName || 'Detective',
          email: userData.email || '',
          photoURL: userData.photoURL,
          level: userData.level || 1,
          score: userData.score || 0,
          progress: userData.progress
        };
      }
      return null;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // ユーザープロフィールを更新
  const updateUserProfile = async (userId: string, data: Partial<Player>): Promise<void> => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    getCollection,
    subscribeToCollection,
    getDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    whereConstraint,
    orderByConstraint,
    limitConstraint,
    getUserProgress,
    updateUserProgress,
    getUserProfile,
    updateUserProfile
  };
};

export default useFirestore;
