import { useState, useEffect } from 'react';
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
  onSnapshot
} from 'firebase/firestore';

/**
 * Firestoreデータの操作を行うカスタムフック
 * @param {string} collectionName - コレクション名
 */
const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // コレクション全体の取得（一度のみ）
  const getCollection = async (constraints = []) => {
    setLoading(true);
    setError(null);
    try {
      let q = collection(db, collectionName);
      
      // 制約を追加（where, orderBy, limitなど）
      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }
      
      const querySnapshot = await getDocs(q);
      const docs = [];
      
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setDocuments(docs);
      return docs;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // リアルタイムでコレクションを監視
  const subscribeToCollection = (constraints = [], callback) => {
    setLoading(true);
    setError(null);
    
    try {
      let q = collection(db, collectionName);
      
      // 制約を追加
      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }
      
      // リアルタイムリスナーを設定
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setDocuments(docs);
        setLoading(false);
        if (callback) callback(docs);
      }, (err) => {
        setError(err.message);
        setLoading(false);
      });
      
      // クリーンアップ関数を返す
      return unsubscribe;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // 単一ドキュメントの取得
  const getDocument = async (docId) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const document = {
          id: docSnap.id,
          ...docSnap.data()
        };
        return document;
      } else {
        return null;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメントの作成または更新
  const setDocument = async (docId, data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
      return { id: docId, ...data };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメントの更新（一部フィールドのみ）
  const updateDocument = async (docId, data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      return { id: docId, ...data };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメントの削除
  const deleteDocument = async (docId) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return docId;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // where制約の作成ヘルパー関数
  const whereConstraint = (field, operator, value) => {
    return where(field, operator, value);
  };

  // orderBy制約の作成ヘルパー関数
  const orderByConstraint = (field, direction = 'asc') => {
    return orderBy(field, direction);
  };

  // limit制約の作成ヘルパー関数
  const limitConstraint = (limitCount) => {
    return limit(limitCount);
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
    limitConstraint
  };
};

export default useFirestore;
