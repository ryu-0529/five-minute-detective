import React from 'react';
import { motion } from 'framer-motion';

interface TrustMeterProps {
  value: number; // 0-100
  character?: {
    name: string;
    id: string;
    isAI?: boolean;
    title?: string; // 肩書き
  };
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 信頼度メーターコンポーネント
 * キャラクターとの信頼関係を視覚的に表示する
 */
const TrustMeter: React.FC<TrustMeterProps> = ({ value, character, size = 'md' }) => {
  // 信頼度に応じた色
  const getMeterColor = () => {
    if (value >= 80) return '#4CAF50'; // 緑 (高信頼)
    if (value >= 60) return '#8BC34A'; // 薄緑
    if (value >= 40) return '#FFC107'; // 黄色 (中程度)
    if (value >= 20) return '#FF9800'; // オレンジ
    return '#F44336'; // 赤 (低信頼)
  };

  // 信頼度に応じたラベル
  const getTrustLabel = () => {
    if (value >= 80) return '高信頼';
    if (value >= 60) return '信頼';
    if (value >= 40) return '中立';
    if (value >= 20) return '警戒';
    return '不信';
  };

  // サイズに応じたスタイルの調整
  const containerClass = size === 'sm' 
    ? "p-2 mb-0 rounded-none border-0 shadow-none" 
    : "p-3 mb-4";

  const meterHeightClass = size === 'sm' 
    ? "h-2" 
    : "h-4";
    
  // 警戒ラベルの背景色 - スクリーンショットに合わせてオレンジに固定
  const warningBgColor = "#ed8936"; // tailwind の orange-500 相当

  return (
    <div className={`bg-white rounded-lg shadow-md ${containerClass}`}>
      {character ? (
        <div className="flex items-center justify-end mb-2">
          <span className="text-sm font-bold rounded px-2 py-1 text-white" style={{ backgroundColor: getMeterColor() }}>
            {getTrustLabel()}
          </span>
          <span className="ml-2 text-sm text-gray-600">
            {value}%
          </span>
        </div>
      ) : (
        <div className="flex justify-end mb-1">
          <span className={`text-${size === 'sm' ? 'xs' : 'sm'} text-gray-600`}>
            {value}%
          </span>
        </div>
      )}

      <div className={`${meterHeightClass} bg-gray-200 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut"
          }}
          className="h-full rounded-full"
          style={{ backgroundColor: getMeterColor() }}
        />
      </div>

      {/* 信頼度レベルに応じたヒント（小サイズでは非表示） */}
      {size !== 'sm' && character && (
        <div className="mt-2 text-xs text-gray-600">
          {value >= 60 ? (
            <p>この人物は重要な情報を共有してくれるでしょう</p>
          ) : value >= 40 ? (
            <p>この人物は一部の情報を共有してくれるかもしれません</p>
          ) : (
            <p>この人物は情報を隠している可能性があります</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrustMeter;