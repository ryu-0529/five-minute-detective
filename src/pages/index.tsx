import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { getNextEpisode } from '../data/episodes-data';
import { NextPage } from 'next';

const Home: NextPage = () => {
  const { player, progress, loading } = useGame();
  const nextEpisode = !loading && progress ? getNextEpisode(progress.completedEpisodes) : null;

  // アニメーション設定
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <>
      <Head>
        <title>5分探偵：知恵の糸 | ホーム</title>
        <meta name="description" content="科学の力で謎を解く5分間のミステリーゲーム" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-detective-light">
        {/* ヒーローセクション */}
        <section className="relative h-96 bg-detective-dark overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-detective-dark to-detective-primary opacity-90"></div>
          
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
            <motion.h1 
              className="text-4xl md:text-6xl font-detective font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              5分探偵<span className="text-detective-secondary">：</span>知恵の糸
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-xl max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              科学の知識で謎を解く、5分で完結するミステリーゲーム。
              各エピソードの謎を解き明かし、隠された大きな陰謀を暴け！
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {player ? (
                nextEpisode ? (
                  <Link 
                    href={`/episodes/${nextEpisode.id}`}
                    className="bg-detective-accent hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors text-center"
                  >
                    次のエピソードを開始
                  </Link>
                ) : (
                  <Link 
                    href="/episodes"
                    className="bg-detective-accent hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors text-center"
                  >
                    エピソード一覧を見る
                  </Link>
                )
              ) : (
                <Link 
                  href="/login"
                  className="bg-detective-accent hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors text-center"
                >
                  ログインして始める
                </Link>
              )}
              
              <Link 
                href="/about"
                className="bg-transparent hover:bg-white/10 text-white border border-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
              >
                ゲームについて
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-detective font-bold text-center text-detective-dark mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              ゲームの特徴
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-detective-light rounded-lg p-6 shadow-md"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-detective-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-detective font-bold text-center text-detective-dark mb-2">5分で完結</h3>
                <p className="text-gray-700 text-center">
                  忙しい日常の合間にもプレイできる、手軽なミステリー体験。
                  各エピソードは5分以内で解決可能です。
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-detective-light rounded-lg p-6 shadow-md"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-detective-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-detective font-bold text-center text-detective-dark mb-2">科学で謎解き</h3>
                <p className="text-gray-700 text-center">
                  物理、生物、数学など、科学の原理を応用した謎解き。
                  遊びながら科学的思考が身につきます。
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-detective-light rounded-lg p-6 shadow-md"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-detective-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-detective font-bold text-center text-detective-dark mb-2">大きな陰謀</h3>
                <p className="text-gray-700 text-center">
                  一見バラバラに見える5つのエピソードは、実は大きな謎に繋がっています。
                  全ての事件を解決して真実を暴き出そう。
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* プレイヤーステータス（ログイン済みの場合） */}
        {player && (
          <section className="py-12 bg-detective-light">
            <div className="container mx-auto px-4">
              <motion.h2 
                className="text-3xl font-detective font-bold text-center text-detective-dark mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                探偵状況
              </motion.h2>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-detective-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    {player.displayName?.charAt(0) || '?'}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-detective font-bold text-detective-dark">{player.displayName}</h3>
                    <p className="text-sm text-gray-600">探偵レベル: {player.level}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-detective-accent font-bold">
                      スコア: {player.score}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-detective text-detective-dark font-bold mb-2">進行状況</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-detective-secondary h-4 rounded-full"
                      style={{ width: `${Math.min(100, (progress?.completedEpisodes.length || 0 / 5) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">
                    {progress?.completedEpisodes.length || 0}/5 エピソード完了
                  </p>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Link 
                    href="/episodes"
                    className="bg-detective-primary hover:bg-detective-secondary text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    エピソード一覧へ
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTAセクション */}
        <section className="py-16 bg-detective-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl font-detective font-bold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              5分で1つの謎を解こう
            </motion.h2>
            
            <motion.p 
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              短時間で楽しめる謎解き体験が、あなたを待っています。
              科学の知識を活かしながら、エニグマ財団の陰謀を暴きましょう。
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {player ? (
                <>
                  <Link 
                    href="/episodes"
                    className="bg-white hover:bg-gray-100 text-detective-primary font-bold py-3 px-8 rounded-lg shadow-lg transition-colors"
                  >
                    今すぐ謎を解く
                  </Link>
                  <Link 
                    href="/science-notes"
                    className="bg-transparent hover:bg-white/10 text-white border border-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    科学ノートを見る
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/register"
                    className="bg-white hover:bg-gray-100 text-detective-primary font-bold py-3 px-8 rounded-lg shadow-lg transition-colors"
                  >
                    今すぐ無料登録
                  </Link>
                  <Link 
                    href="/login"
                    className="bg-transparent hover:bg-white/10 text-white border border-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    ログイン
                  </Link>
                </>
              )}
            </motion.div>
            
            {/* iOSでのインストール方法ガイド */}
            <motion.div
              className="mt-12 max-w-md mx-auto bg-white/10 backdrop-blur-sm p-4 rounded-lg text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="font-detective text-lg font-bold mb-2">
                iOSでホーム画面に追加
              </h3>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Safariで開く</li>
                <li>共有ボタン<span className="inline-block mx-1">
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </span>をタップ</li>
                <li>「ホーム画面に追加」を選択</li>
              </ol>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
