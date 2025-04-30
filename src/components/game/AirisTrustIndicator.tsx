import React from 'react';
import { motion } from 'framer-motion';

interface AirisTrustIndicatorProps {
  trustLevel: number;
  showWarning?: boolean;
}

/**
 * アイリスとの信頼関係を視覚化するコンポーネント
 * 信頼度に応じて、アイリスの真意がプレイヤーに見えているかどうかを示す
 */
const AirisTrustIndicator: React.FC<AirisTrustIndicatorProps> = ({
  trustLevel,
  showWarning = false
}) => {
  // 信頼度レベル（0-100）に基づいた表示設定
  const getTrustColor = () => {
    if (trustLevel >= 80) return 'bg-green-500';
    if (trustLevel >= 60) return 'bg-blue-500';
    if (trustLevel >= 40) return 'bg-yellow-500';
    if (trustLevel >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrustLabel = () => {
    if (trustLevel >= 80) return '強い信頼関係';
    if (trustLevel >= 60) return '良好な信頼関係';
    if (trustLevel >= 40) return '普通の信頼関係';
    if (trustLevel >= 20) return '弱い信頼関係';
    return '不信感';
  };

  // アイリスの隠された側面を表現（信頼度が低いと見えにくい）
  const hiddenAspectOpacity = Math.max(0, Math.min(1, (100 - trustLevel) / 100));

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-3">
        アイリスとの信頼関係
      </h3>
      
      <div className="mb-4">
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${trustLevel}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${getTrustColor()}`}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">不信感</span>
          <span className="font-bold">{getTrustLabel()} ({trustLevel}%)</span>
          <span className="text-gray-500">完全な信頼</span>
        </div>
      </div>
      
      {/* 信頼度に応じてアイリスの二面性を表現 */}
      <div className="relative bg-gradient-to-r from-detective-light to-detective-primary/10 p-3 rounded-md">
        <div className="mb-2 text-sm font-bold text-detective-dark">アイリスからのメッセージ:</div>
        
        {/* 表の顔（常に見える） */}
        <div className="text-sm text-gray-700">
          あなたとの協力関係が順調です。科学的思考を持って事件に取り組みましょう。
        </div>
        
        {/* 裏の顔（信頼度が低いほど透明に - つまり見えにくい） */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hiddenAspectOpacity }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
          >
            <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded-md text-xs max-w-xs text-center">
              アイリスは何か隠しているかもしれません。質問を慎重に選び、回答を注意深く分析してください。
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-bold text-detective-dark mb-2">信頼度の影響:</h4>
        <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
          <li>信頼度が高いほど、アイリスからより詳細な情報を得られます</li>
          <li>適切な質問や選択で信頼度が上昇します</li>
          <li>不適切な疑いや批判は信頼度を下げる可能性があります</li>
          <li>信頼度が非常に低いと、アイリスの助言に誤誘導が含まれるかもしれません</li>
        </ul>
      </div>
    </div>
  );
};

export default AirisTrustIndicator;
