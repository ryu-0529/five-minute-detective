import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../../types/game';

interface QuestionResponseProps {
  question: Question;
  suspectName: string;
  trustChange: number;
  onContinue: () => void;
}

/**
 * 質問応答表示コンポーネント
 */
const QuestionResponse: React.FC<QuestionResponseProps> = ({
  question,
  suspectName,
  trustChange,
  onContinue,
}) => {
  // 信頼度変化に応じた色とテキスト
  const getTrustFeedback = () => {
    if (trustChange > 10) {
      return { text: '信頼度が大幅に上昇', color: 'text-green-600' };
    } else if (trustChange > 0) {
      return { text: '信頼度が上昇', color: 'text-green-500' };
    } else if (trustChange === 0) {
      return { text: '信頼度に変化なし', color: 'text-gray-500' };
    } else if (trustChange > -10) {
      return { text: '信頼度が減少', color: 'text-yellow-500' };
    } else {
      return { text: '信頼度が大幅に減少', color: 'text-red-500' };
    }
  };

  const trustFeedback = getTrustFeedback();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-5 mb-4"
    >
      <div className="mb-4">
        <h3 className="font-detective text-lg text-detective-dark font-bold mb-1">
          あなたの質問:
        </h3>
        <p className="text-gray-700 bg-detective-light p-3 rounded-md">
          {question.text}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-detective text-lg text-detective-dark font-bold mb-1">
          {suspectName}の回答:
        </h3>
        <div className="bg-detective-light p-3 rounded-md text-gray-800 leading-relaxed">
          {question.response}
        </div>
      </div>

      <div className="mb-5 flex items-center">
        <span className="mr-2">結果:</span>
        <span className={`font-bold ${trustFeedback.color}`}>
          {trustFeedback.text} ({trustChange > 0 ? '+' : ''}{trustChange}%)
        </span>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-detective-primary hover:bg-detective-secondary text-white font-bold py-2 rounded-md transition-colors"
      >
        続ける
      </button>
    </motion.div>
  );
};

export default QuestionResponse;