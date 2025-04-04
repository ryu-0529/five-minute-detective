import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { NextPage } from 'next';

const Login: NextPage = () => {
  const router = useRouter();
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  // リダイレクト先を取得
  const { redirect } = router.query;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    // 入力バリデーション
    if (!email || !password) {
      setLocalError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      await login(email, password);
      
      // リダイレクト先が指定されている場合はそちらに遷移
      if (typeof redirect === 'string' && redirect) {
        router.push(`/${redirect}`);
      } else {
        router.push('/'); // デフォルトはホームページ
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
  };

  return (
    <>
      <Head>
        <title>5分探偵：知恵の糸 | ログイン</title>
        <meta name="description" content="5分探偵アプリにログインして、謎解きの冒険を続けましょう。" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-detective-light py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-detective-dark py-6">
            <h2 className="text-center text-2xl font-detective font-bold text-white">
              5分探偵：知恵の糸
            </h2>
            <p className="mt-2 text-center text-sm text-detective-secondary">
              アカウントにログインして謎解きを続ける
            </p>
          </div>

          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* エラーメッセージ */}
              {(localError || error) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{localError || error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-primary focus:border-detective-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-primary focus:border-detective-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link 
                    href="/forgot-password"
                    className="font-medium text-detective-primary hover:text-detective-secondary"
                  >
                    パスワードをお忘れですか？
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-detective-primary hover:bg-detective-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-detective-primary ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'ログイン中...' : 'ログイン'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    または
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div>
                  <Link
                    href="/register"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-detective-dark bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    新規アカウント登録
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
