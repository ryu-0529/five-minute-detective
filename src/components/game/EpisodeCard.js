import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const EpisodeCard = ({ episode, isUnlocked, isCompleted }) => {
  const router = useRouter();

  // 状態に応じたスタイルを設定
  const cardStyles = isUnlocked 
    ? "cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all" 
    : "opacity-50 cursor-not-allowed";
  
  const statusBadge = isCompleted 
    ? <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">完了</span>
    : isUnlocked 
      ? <span className="absolute top-3 right-3 bg-detective-accent text-white text-xs font-bold px-2 py-1 rounded-full">挑戦可能</span>
      : <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">ロック</span>;

  // エピソードをクリックしたときの処理
  const handleClick = () => {
    if (isUnlocked) {
      router.push(`/episodes/${episode.id}`);
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden relative ${cardStyles}`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 状態バッジ */}
      {statusBadge}
      
      {/* エピソードサムネイル */}
      <div className="h-40 bg-detective-secondary flex items-center justify-center">
        <div className="text-white text-center p-4">
          <h3 className="font-detective text-xl">Episode {episode.id}</h3>
          <p className="font-handwritten text-lg">{episode.title}</p>
        </div>
      </div>
      
      {/* エピソード情報 */}
      <div className="p-4">
        <h3 className="font-detective text-lg font-bold text-detective-dark">{episode.title}</h3>
        <p className="text-gray-600 text-sm italic mb-2">{episode.subtitle}</p>
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{episode.description}</p>
        
        {/* 科学分野と難易度 */}
        <div className="flex justify-between text-xs text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {episode.scienceField}
          </span>
          <span className="bg-detective-light text-detective-dark px-2 py-1 rounded-full">
            難易度: {episode.difficulty}
          </span>
        </div>
      </div>
      
      {/* ロック状態のオーバーレイ */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};

export default EpisodeCard;
