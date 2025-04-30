import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BackstoryPrediction as BackstoryPredictionType } from '../../types/game';

interface BackstoryPredictionProps {
  suspectName: string;
  suspectId: string;
  keywords: string[];
  onPredict: (suspectId: string, selectedKeywords: string[]) => Promise<number>;
  onComplete: () => void;
  backstoryData?: BackstoryPredictionType;
}

/**
 * 裏ストーリー予測コンポーネント
 * キーワードを選んで容疑者の裏ストーリーを予測する
 * 陰謀論ミステリー編では特に重要な要素
 */
const BackstoryPrediction: React.FC<BackstoryPredictionProps> = ({
  suspectName,
  suspectId,
  keywords,
  onPredict,
  onComplete,
  backstoryData
}) => {
  // キーワードリストをbackstoryDataから取得（あれば）またはpropsから取得
  const availableKeywords = backstoryData?.suspectKeywords[suspectId] || keywords;
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{ score: number; message: string } | null>(null);

  const MAX_SELECTIONS = 5;

  // キーワードの選択・解除
  const toggleKeyword = (keyword: string) => {
    if (isSubmitting) return;

    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(prev => prev.filter(k => k !== keyword));
    } else {
      if (selectedKeywords.length < MAX_SELECTIONS) {
        setSelectedKeywords(prev => [...prev, keyword]);
      }
    }
  };

  // 予測を提出
  const handleSubmit = async () => {
    if (selectedKeywords.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // 予測スコアを取得
      const score = await onPredict(suspectId, selectedKeywords);
      
      // 結果メッセージを設定
      let message = '';
      if (score >= 80) {
        message = '素晴らしい！ほぼ完璧な推理です。';
      } else if (score >= 60) {
        message = '良い推理です。多くの重要なポイントを捉えています。';
      } else if (score >= 40) {
        message = '一部の要素を正しく推理できています。';
      } else if (score >= 20) {
        message = 'いくつかのポイントは合っていますが、再考の余地があります。';
      } else {
        message = '残念ながら、推理は的外れのようです。';
      }
      
      setResult({ score, message });
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
        {suspectName}の裏ストーリーを予測
      </h3>
      
      {!result ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            これまでに集めた証拠と質問の回答から、この人物の真の動機や秘密を予測してください。
            最大{MAX_SELECTIONS}つのキーワードを選択できます。
          </p>
          
          <div className="mb-4">
            <h4 className="text-sm font-bold text-detective-dark mb-2">
              キーワードを選択 ({selectedKeywords.length}/{MAX_SELECTIONS})
            </h4>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {availableKeywords.map(keyword => (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedKeywords.includes(keyword)
                      ? 'bg-detective-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={isSubmitting || (
                    !selectedKeywords.includes(keyword) && 
                    selectedKeywords.length >= MAX_SELECTIONS
                  )}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={selectedKeywords.length === 0 || isSubmitting}
            className={`w-full py-2 rounded-md font-bold transition-colors ${
              selectedKeywords.length > 0 && !isSubmitting
                ? 'bg-detective-primary text-white hover:bg-detective-secondary'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '予測中...' : '予測する'}
          </button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mb-4 py-3">
            <div className="text-2xl font-bold mb-1">
              {result.score}/100
            </div>
            <p className="text-gray-700">{result.message}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-bold text-detective-dark mb-2">
              あなたの予測したキーワード:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedKeywords.map(keyword => (
                <span
                  key={keyword}
                  className="px-3 py-1 rounded-full text-sm bg-detective-primary text-white"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={onComplete}
            className="w-full bg-detective-dark hover:bg-detective-dark/80 text-white font-bold py-2 rounded-md transition-colors"
          >
            続ける
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BackstoryPrediction;