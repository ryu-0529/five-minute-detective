import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScienceConcept as ScienceConceptType } from '../../types/game';

interface ScienceConceptProps {
  concept: ScienceConceptType;
  isLearned?: boolean;
  relatedConspiracy?: string; // 関連する陰謀論
  debunkingPoints?: string[]; // 陰謀論を検証するためのポイント
}

const ScienceConcept: React.FC<ScienceConceptProps> = ({ 
  concept, 
  isLearned = false,
  relatedConspiracy,
  debunkingPoints 
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`bg-white border-2 rounded-lg overflow-hidden transition-colors cursor-pointer ${
        isLearned 
          ? 'border-detective-primary shadow-md' 
          : 'border-gray-200 hover:border-detective-secondary'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-detective text-lg text-detective-dark font-bold">
            {concept.title}
          </h3>
          {isLearned && (
            <span className="bg-detective-primary text-white text-xs px-2 py-1 rounded-full">
              習得済み
            </span>
          )}
        </div>
        
        {/* コンセプトの簡易説明 */}
        <p className="text-gray-700 mt-2">
          {concept.description}
        </p>
        
        {/* 展開時の詳細説明 */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            {/* 関連する陰謀論 */}
            {relatedConspiracy && (
              <div className="mb-3">
                <h4 className="font-detective text-detective-dark font-bold text-sm mb-1">
                  関連する陰謀論
                </h4>
                <p className="text-gray-700 italic">{relatedConspiracy}</p>
              </div>
            )}
            
            {/* 陰謀論検証ポイント */}
            {debunkingPoints && debunkingPoints.length > 0 && (
              <div className="mb-3">
                <h4 className="font-detective text-detective-dark font-bold text-sm mb-1">
                  検証ポイント
                </h4>
                <ul className="list-disc list-inside text-gray-700">
                  {debunkingPoints.map((point, index) => (
                    <li key={index} className="ml-2">{point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 事件との関係 */}
            <h4 className="font-detective text-detective-dark font-bold text-sm mb-1">
              事件との関係
            </h4>
            <p className="text-gray-700 italic">{concept.relevance}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ScienceConcept;
