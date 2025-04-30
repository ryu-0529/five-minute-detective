import React from 'react';
import { motion } from 'framer-motion';

interface AirisResponseProps {
  question: string;
  response: string;
  trustLevel: number;
  isShadyResponse?: boolean;
}

/**
 * アイリスAIの回答表示コンポーネント
 * 信頼度に応じて回答の信頼性が視覚的に表現される
 */
const AirisResponse: React.FC<AirisResponseProps> = ({
  question,
  response,
  trustLevel,
  isShadyResponse = false
}) => {
  // 信頼度によって表示スタイルを変更
  const getResponseStyle = () => {
    // 不審な回答（裏の顔）の場合
    if (isShadyResponse) {
      return {
        containerClass: 'bg-red-50 border border-red-200',
        titleClass: 'text-red-700'
      };
    }
    
    // 通常の回答（信頼度による変化）
    if (trustLevel >= 70) {
      return {
        containerClass: 'bg-green-50 border border-green-200',
        titleClass: 'text-green-700'
      };
    }
    if (trustLevel >= 40) {
      return {
        containerClass: 'bg-blue-50 border border-blue-200',
        titleClass: 'text-blue-700'
      };
    }
    return {
      containerClass: 'bg-yellow-50 border border-yellow-200',
      titleClass: 'text-yellow-700'
    };
  };
  
  const styles = getResponseStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-md p-4 mb-4 ${styles.containerClass}`}
    >
      <div className="mb-2">
        <p className="text-sm text-gray-500">あなたの質問:</p>
        <p className="text-sm font-medium text-gray-700">{question}</p>
      </div>
      
      <div>
        <div className="flex items-center mb-1">
          <div className="w-6 h-6 bg-detective-primary/20 rounded-full flex items-center justify-center mr-2">
            <span className="text-detective-primary text-xs font-bold">A</span>
          </div>
          <p className={`text-sm font-bold ${styles.titleClass}`}>アイリスの回答:</p>
        </div>
        
        <div className="text-sm text-gray-700 ml-8">
          {response}
        </div>
        
        {/* 信頼度が低い場合の注意表示 */}
        {trustLevel < 40 && (
          <div className="mt-2 ml-8 text-xs text-gray-500 italic">
            ※アイリスとの信頼関係が浅いため、情報が制限されている可能性があります
          </div>
        )}
        
        {/* 怪しい回答の場合の裏側ヒント（デバッグ用、実際のゲームでは表示しない） */}
        {isShadyResponse && process.env.NODE_ENV === 'development' && (
          <div className="mt-2 border-t border-red-200 pt-2 text-xs text-red-500">
            <span className="font-bold">開発者メモ:</span> この回答には意図的な誤誘導が含まれています
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AirisResponse;
