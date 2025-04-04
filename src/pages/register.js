import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useGame } from '../context/GameContext';

export default function Register() {
  const router = useRouter();
  const { player } = useGame();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // すでにログインしている場合はリダイレクト
  useEffect(() => {
    if (player) {
      router.push('/');
    }
  }, [player, router]);

  // 登録処理
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // パスワード確認チェック
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }
    
    try {
      // Firebaseユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // ユーザープロフィールの更新
      await updateProfile(user, {
        displayName: name
      });
      
      // Firestoreにユーザーデータを保存
      await setDoc(doc(db, 'users', user.uid), {
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
      
      // 登録成功、ホームにリダイレクト
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      // エラー処理
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('このメールアドレスはすでに使用されています');
          break;
        case 'auth/invalid-email':
          setError('メールアドレスの形式が正しくありません');
          break;
        case 'auth/weak-password':
          setError('パスワードは6文字以上にしてください');
          break;
        default:
          setError('登録に失敗しました。もう一度お試しください');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>5分探偵 | 新規登録</title>
        <meta name="description" content="5分探偵に新規登録" />
      </Head>

      <div className="min-h-screen bg-detective-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-detective-secondary px-6 py-8 text-white text-center">
            <h1 className="font-detective text-3xl font-bold">探偵アカデミーへの登録</h1>
            <p className="mt-2">アカウントを作成して謎解きの世界へ</p>
          </div>
          
          <div className="px-6 py-8">
            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {/* 登録フォーム */}
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  探偵名
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-secondary focus:border-detective-secondary"
                  placeholder="あなたの探偵名"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-secondary focus:border-detective-secondary"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-secondary focus:border-detective-secondary"
                  placeholder="6文字以上"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  パスワード (確認)
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-secondary focus:border-detective-secondary"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-detective-secondary focus:ring-detective-secondary border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  <Link href="/terms" className="text-detective-secondary hover:text-detective-primary">
                    利用規約
                  </Link>
                  と
                  <Link href="/privacy" className="text-detective-secondary hover:text-detective-primary">
                    プライバシーポリシー
                  </Link>
                  に同意します
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-detective-secondary hover:bg-detective-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-detective-secondary ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登録中...
                    </>
                  ) : (
                    '登録する'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                すでにアカウントをお持ちの場合は{' '}
                <Link href="/login" className="font-medium text-detective-secondary hover:text-detective-primary">
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
