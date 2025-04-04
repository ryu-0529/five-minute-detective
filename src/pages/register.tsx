import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { NextPage } from 'next';

const Register: NextPage = () => {
  const router = useRouter();
  const { signup, error, loading } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    // 入力バリデーション
    if (!name || !email || !password) {
      setLocalError('全ての項目を入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('パスワードと確認用パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setLocalError('パスワードは6文字以上で設定してください');
      return;
    }

    try {
      await signup(email, password, name);
      router.push('/'); // 登録成功後はホームページへリダイレクト
    } catch (err) {
      console.error('Registration error:', err);
      setLocalError('アカウント登録に失敗しました。別のメールアドレスをお試しください。');
    }
  };

  return (
    <>
      <Head>
        <title>5分探偵：知恵の糸 | アカウント登録</title>
        <meta name="description" content="5分探偵アプリに新規登録して、謎解きの冒険を始めましょう。" />
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
              新規アカウント登録
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  ニックネーム
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-primary focus:border-detective-primary"
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-primary focus:border-detective-primary"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  パスワードは6文字以上で設定してください
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  パスワード（確認用）
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-detective-primary focus:border-detective-primary"
                  />
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
                  {loading ? '登録中...' : 'アカウント登録'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                既にアカウントをお持ちですか？{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-detective-primary hover:text-detective-secondary"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
