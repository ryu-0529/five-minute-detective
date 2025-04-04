import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { EpisodeData } from '../../types/game';

interface EpisodeCardProps {
  episode: EpisodeData;
  isUnlocked: boolean;
  isCompleted: boolean;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, isUnlocked, isCompleted }) => {
  // アニメーション用のVariants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={isUnlocked ? "hover" : undefined}
      className={`rounded-lg overflow-hidden shadow-md ${
        isUnlocked 
          ? 'cursor-pointer'
          : 'opacity-75 grayscale'
      }`}
    >
      <div className={`h-40 relative ${
        isCompleted 
          ? 'bg-detective-secondary'
          : isUnlocked
            ? 'bg-detective-primary'
            : 'bg-gray-500'
      }`}>
        {/* エピソードイメージ（実際の実装ではここに画像を表示） */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 仮のアイコン */}
          {isCompleted ? (
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : isUnlocked ? (
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ) : (
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </div>
        
        {/* エピソード番号バッジ */}
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
          エピソード {episode.id}
        </div>
        
        {/* 完了・アンロックステータス */}
        <div className="absolute bottom-4 right-4">
          {isCompleted ? (
            <span className="bg-detective-accent text-white px-3 py-1 rounded-full text-xs font-bold">
              クリア済み
            </span>
          ) : isUnlocked ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              プレイ可能
            </span>
          ) : (
            <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              ロック中
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <h3 className="font-detective text-lg text-detective-dark font-bold mb-1">
          {episode.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {episode.subtitle}
        </p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: getDifficultyColor(episode.difficulty) }}></span>
            <span className="text-xs text-gray-500">{episode.difficulty}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            {episode.scienceField}
          </div>
        </div>
        
        {/* プレイボタン */}
        {isUnlocked && (
          <div className="mt-4">
            <Link
              href={`/episodes/${episode.id}`}
              className={`block w-full py-2 text-center rounded-md ${
                isCompleted
                  ? 'bg-detective-secondary text-white hover:bg-opacity-90'
                  : 'bg-detective-primary text-white hover:bg-detective-secondary'
              } transition-colors`}
            >
              {isCompleted ? '再プレイ' : 'プレイする'}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 難易度に応じた色を取得
const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case '初級':
      return '#4CAF50'; // Green
    case '中級':
      return '#FF9800'; // Orange
    case '上級':
      return '#F44336'; // Red
    default:
      return '#9E9E9E'; // Gray
  }
};

export default EpisodeCard;
