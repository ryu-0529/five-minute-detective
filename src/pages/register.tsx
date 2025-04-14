import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { NextPage } from 'next';
import Image from 'next/image';

const Register: NextPage = () => {
  const router = useRouter();
  const { signup, loginWithGoogle, error, loading } = useAuth();
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
  
  // Googleアカウントでの登録処理
  const handleGoogleSignup = async () => {
    setLocalError(null);
    try {
      await loginWithGoogle();
      router.push('/'); // 登録成功後はホームページへリダイレクト
    } catch (err) {
      console.error('Google signup error:', err);
      setLocalError('Googleアカウントでの登録に失敗しました。しばらくしてから再度お試しください。');
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
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-detective-primary"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Googleで登録
                </button>
              </div>
            
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
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
