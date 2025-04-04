import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { episodes } from '../../data/episodes';
import EpisodeCard from '../../components/game/EpisodeCard';

export default function Episodes() {
  const router = useRouter();
  const { player, progress } = useGame();
  const [filter, setFilter] = useState('all'); // all, unlocked, completed

  // ログイン確認
  if (!player) {
    // ユーザーがログインしていない場合はログインページへリダイレクト
    router.push('/login?redirect=episodes');
    return null;
  }

  // エピソードのフィルタリング
  const filteredEpisodes = episodes.filter(episode => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return progress.unlockedEpisodes.includes(episode.id);
    if (filter === 'completed') return progress.completedEpisodes.includes(episode.id);
    return true;
  });

  // アニメーション設定
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Head>
        <title>5分探偵 | エピソード一覧</title>
        <meta name="description" content="5分で解ける科学ミステリーエピソード一覧" />
      </Head>

      <div className="min-h-screen bg-detective-light py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h1 
              className="font-detective text-4xl text-detective-dark font-bold mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              エピソード一覧
            </motion.h1>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              科学の知識を駆使して様々な謎を解き明かしましょう。
              全てのエピソードをクリアして、エニグマ財団の陰謀を暴きましょう。
            </motion.p>
          </div>

          {/* フィルターとソート */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-lg shadow-sm">
              <button
                className={`px-4 py-2 rounded-l-lg ${
                  filter === 'all'
                    ? 'bg-detective-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setFilter('all')}
              >
                全て
              </button>
              <button
                className={`px-4 py-2 ${
                  filter === 'unlocked'
                    ? 'bg-detective-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setFilter('unlocked')}
              >
                プレイ可能
              </button>
              <button
                className={`px-4 py-2 rounded-r-lg ${
                  filter === 'completed'
                    ? 'bg-detective-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setFilter('completed')}
              >
                クリア済み
              </button>
            </div>
          </div>

          {/* プログレスバー - 全体の進行状況 */}
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="font-detective text-lg text-detective-dark font-bold mb-2">
              全体進行状況
            </h2>
            <div className="w-full bg-white rounded-full h-4 shadow-md overflow-hidden">
              <div 
                className="bg-detective-primary h-4 transition-all duration-500"
                style={{ width: `${(progress.completedEpisodes.length / episodes.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-600">
              <span>0%</span>
              <span>{Math.round((progress.completedEpisodes.length / episodes.length) * 100)}% 完了</span>
              <span>100%</span>
            </div>
          </div>

          {/* エピソード一覧 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredEpisodes.length > 0 ? (
              filteredEpisodes.map(episode => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  isUnlocked={progress.unlockedEpisodes.includes(episode.id)}
                  isCompleted={progress.completedEpisodes.includes(episode.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">条件に合うエピソードがありません</p>
              </div>
            )}
          </motion.div>

          {/* 大きな謎への導入テキスト */}
          {progress.completedEpisodes.length > 0 && (
            <motion.div 
              className="mt-16 max-w-3xl mx-auto bg-detective-dark text-white rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="font-detective text-2xl font-bold mb-4 text-detective-secondary">
                進行中の調査: プロジェクトΩ
              </h2>
              <p className="mb-4">
                これまでの調査で{progress.completedEpisodes.length}つの手がかりを入手しました。
                {progress.completedEpisodes.length < 5 ? 'さらに調査を進めてエニグマ財団の秘密を解き明かしましょう。' : 'すべての手がかりが集まりました。最終調査に挑みましょう。'}
              </p>
              
              {/* 謎解きの進行状況 - 収集した手がかり */}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {[1, 2, 3, 4, 5].map(num => (
                  <div
                    key={num}
                    className={`h-16 rounded-md flex items-center justify-center ${
                      progress.completedEpisodes.includes(num)
                        ? 'bg-detective-accent text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {progress.completedEpisodes.includes(num) ? (
                      <span className="font-detective font-bold">鍵 {num}</span>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              
              {/* 最終エピソードへのボタン */}
              {progress.completedEpisodes.length >= 5 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => router.push('/episodes/final')}
                    className="bg-detective-accent hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors"
                  >
                    最終調査に挑む
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
