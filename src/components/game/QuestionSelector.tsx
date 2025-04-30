import React, { useState } from 'react';
import { Question } from '../../types/game';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionSelectorProps {
  questions: Question[];
  suspectName: string;
  remainingQuestions: number;
  onSelectQuestion: (question: Question) => void;
}

/**
 * 4択質問選択コンポーネント
 */
const QuestionSelector: React.FC<QuestionSelectorProps> = ({ 
  questions, 
  suspectName, 
  remainingQuestions, 
  onSelectQuestion 
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 質問の選択
  const handleSelect = (index: number, e?: React.MouseEvent) => {
    // イベント伝播を防止
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // ネイティブイベントも止める
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    
    // 非同期で状態を更新（より長い遅延を設定）
    if (!isSubmitting) {
      setTimeout(() => {
        setSelectedIndex(index);
      }, 50);
    }
  };

  // 質問の確定
  const handleSubmit = (e?: React.MouseEvent) => {
    // イベント伝播を防止
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      // ネイティブイベントも止める
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }

    if (selectedIndex !== null && !isSubmitting) {
      // 早めにボタンの状態を更新してUI応答を良くする
      setIsSubmitting(true);
      
      // イベントの伝播を防止するために遅延実行
      setTimeout(() => {
        try {
          // このコンポーネント内での状態をすぐに更新
          const questionToSubmit = questions[selectedIndex];
          
          // onSelectQuestionを呼び出す前に少し待機
          setTimeout(() => {
            try {
              // onSelectQuestionを呼び出す
              onSelectQuestion(questionToSubmit);
              
              // アニメーション完了後にリセット
              setTimeout(() => {
                setSelectedIndex(null);
                setIsSubmitting(false);
              }, 500);
            } catch (error) {
              console.error('質問選択処理でエラーが発生:', error);
              setIsSubmitting(false);
            }
          }, 20);
        } catch (error) {
          console.error('質問選択処理でエラーが発生:', error);
          setIsSubmitting(false);
        }
      }, 100); // より長めの遅延を設定
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-detective text-lg text-detective-dark font-bold">
          {suspectName}に質問する
        </h3>
        <span className="bg-detective-light px-3 py-1 rounded-full text-sm font-bold">
          残り質問数: {remainingQuestions}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {questions.map((question, index) => (
          <motion.button
            key={question.id}
            className={`p-3 text-left rounded-md border transition-colors ${
              selectedIndex === index 
                ? 'border-detective-primary bg-detective-primary/10' 
                : 'border-gray-200 hover:border-detective-primary/50 hover:bg-detective-primary/5'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // ネイティブイベントも止める
              if (e.nativeEvent) {
                e.nativeEvent.stopImmediatePropagation();
              }
              
              handleSelect(index, e);
            }}
            disabled={isSubmitting}
          >
            {question.text}
          </motion.button>
        ))}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // ネイティブイベントも止める
          if (e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation();
          }
          
          // 少し遅延して実行
          setTimeout(() => {
            handleSubmit(e);
          }, 50);
        }}
        disabled={selectedIndex === null || isSubmitting || remainingQuestions <= 0}
        className={`w-full py-2 rounded-md font-bold transition-colors ${
          selectedIndex !== null && remainingQuestions > 0 && !isSubmitting
            ? 'bg-detective-primary text-white hover:bg-detective-secondary'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {remainingQuestions <= 0 
          ? '質問制限に達しました' 
          : isSubmitting 
            ? '質問中...' 
            : '質問する'}
      </button>
    </div>
  );
};

export default QuestionSelector;