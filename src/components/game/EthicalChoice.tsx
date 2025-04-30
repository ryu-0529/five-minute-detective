import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EthicalChoice as EthicalChoiceType, EthicalChoices } from '../../types/game';

interface EthicalChoiceProps {
  episodeId: number;
  dilemma: EthicalChoices;
  onChoice: (episodeId: number, choice: EthicalChoiceType) => Promise<void>;
  onComplete: () => void;
}

/**
 * 倫理的選択コンポーネント
 * 「真実の公開」と「社会の安定」のジレンマを提示
 * 
 * 陰謀論ミステリー編では、各エピソード終了時に「真実を公開するか」「社会の安定を優先するか」
 * というジレンマを提示し、プレイヤーの選択が今後のエピソードやエンディングに影響を与える。
 * 選択によって社会信頼度と科学信頼度が変動し、最終的なエンディング分岐の条件となる。
 */
const EthicalChoice: React.FC<EthicalChoiceProps> = ({
  episodeId,
  dilemma,
  onChoice,
  onComplete,
}) => {
  const [choice, setChoice] = useState<'truth' | 'stability' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // 選択を確定
  const handleSubmit = async () => {
    if (!choice || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const ethicalChoice: EthicalChoiceType = {
        episodeId,
        choiceType: choice,
        impact: choice === 'truth' 
          ? dilemma.truthOption.impact 
          : dilemma.stabilityOption.impact
      };
      
      await onChoice(episodeId, ethicalChoice);
      setIsComplete(true);
    } catch (error) {
      console.error('Ethical choice error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // インパクト表示
  const ImpactDisplay = ({ label, value }: { label: string; value: number }) => (
    <div className="flex items-center">
      <span className="text-xs text-gray-600">{label}:</span>
      <span className={`ml-1 text-xs font-bold ${
        value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
      }`}>
        {value > 0 ? `+${value}` : value}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-3">
        {dilemma.title}
      </h3>
      
      <p className="text-gray-700 mb-5">
        {dilemma.description}
      </p>
      
      {!isComplete ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* 真実オプション */}
            <motion.button
              className={`p-4 rounded-md text-left border-2 transition-all ${
                choice === 'truth' 
                  ? 'border-detective-primary bg-detective-primary/10' 
                  : 'border-gray-200 hover:border-detective-primary/30'
              }`}
              whileHover={{ scale: 1.01 }}
              disabled={isSubmitting}
              onClick={() => setChoice('truth')}
            >
              <h4 className="font-bold text-sm text-detective-dark mb-1">真実を公開</h4>
              <p className="text-sm text-gray-700 mb-3">{dilemma.truthOption.text}</p>
              <div className="flex space-x-4">
                <ImpactDisplay 
                  label="社会信頼" 
                  value={dilemma.truthOption.impact.socialTrust} 
                />
                <ImpactDisplay 
                  label="科学信頼" 
                  value={dilemma.truthOption.impact.scienceTrust} 
                />
              </div>
            </motion.button>
            
            {/* 安定オプション */}
            <motion.button
              className={`p-4 rounded-md text-left border-2 transition-all ${
                choice === 'stability' 
                  ? 'border-detective-primary bg-detective-primary/10' 
                  : 'border-gray-200 hover:border-detective-primary/30'
              }`}
              whileHover={{ scale: 1.01 }}
              disabled={isSubmitting}
              onClick={() => setChoice('stability')}
            >
              <h4 className="font-bold text-sm text-detective-dark mb-1">社会の安定を優先</h4>
              <p className="text-sm text-gray-700 mb-3">{dilemma.stabilityOption.text}</p>
              <div className="flex space-x-4">
                <ImpactDisplay 
                  label="社会信頼" 
                  value={dilemma.stabilityOption.impact.socialTrust} 
                />
                <ImpactDisplay 
                  label="科学信頼" 
                  value={dilemma.stabilityOption.impact.scienceTrust} 
                />
              </div>
            </motion.button>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!choice || isSubmitting}
            className={`w-full py-2 rounded-md font-bold transition-colors ${
              choice && !isSubmitting
                ? 'bg-detective-primary text-white hover:bg-detective-secondary'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '選択中...' : '選択を確定'}
          </button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-4 rounded-md bg-detective-light mb-4">
            <h4 className="font-bold mb-2">
              {choice === 'truth' ? '真実を公開する' : '社会の安定を優先する'}ことを選びました
            </h4>
            <p className="text-sm text-gray-700">
              {choice === 'truth' 
                ? dilemma.truthOption.text 
                : dilemma.stabilityOption.text}
            </p>
          </div>
          
          <div className="flex justify-center gap-4 mb-4">
            <div className="px-3 py-2 rounded-md bg-detective-primary/10">
              <p className="text-sm font-bold text-detective-dark mb-1">社会信頼度</p>
              <p className={`text-sm ${
                (choice === 'truth' ? dilemma.truthOption.impact.socialTrust : dilemma.stabilityOption.impact.socialTrust) > 0
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {(choice === 'truth' ? dilemma.truthOption.impact.socialTrust : dilemma.stabilityOption.impact.socialTrust) > 0 ? '+' : ''}
                {choice === 'truth' 
                  ? dilemma.truthOption.impact.socialTrust 
                  : dilemma.stabilityOption.impact.socialTrust}%
              </p>
            </div>
            
            <div className="px-3 py-2 rounded-md bg-detective-primary/10">
              <p className="text-sm font-bold text-detective-dark mb-1">科学信頼度</p>
              <p className={`text-sm ${
                (choice === 'truth' ? dilemma.truthOption.impact.scienceTrust : dilemma.stabilityOption.impact.scienceTrust) > 0
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {(choice === 'truth' ? dilemma.truthOption.impact.scienceTrust : dilemma.stabilityOption.impact.scienceTrust) > 0 ? '+' : ''}
                {choice === 'truth' 
                  ? dilemma.truthOption.impact.scienceTrust 
                  : dilemma.stabilityOption.impact.scienceTrust}%
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">
            あなたの選択は今後のエピソードでの展開に影響を与えます。
          </p>
          
          <button
            onClick={onComplete}
            className="w-full bg-detective-primary hover:bg-detective-secondary text-white font-bold py-2 rounded-md transition-colors"
          >
            続ける
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default EthicalChoice;