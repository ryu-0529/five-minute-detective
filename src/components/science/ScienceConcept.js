import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScienceConcept = ({ concept }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ヘッダー部分 - 常に表示 */}
      <div 
        className="p-4 bg-detective-light cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-detective text-detective-dark font-bold">{concept.title}</h3>
        <svg 
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* 展開時のコンテンツ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-200">
              <p className="text-gray-700">{concept.description}</p>
              
              {/* 関連性の表示 */}
              {concept.relevance && (
                <div className="mt-3 bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-bold text-detective-primary">事件との関連:</h4>
                  <p className="text-sm text-gray-700 mt-1">{concept.relevance}</p>
                </div>
              )}
              
              {/* イラストや図があれば表示 */}
              {concept.illustration && (
                <div className="mt-4">
                  <img 
                    src={concept.illustration} 
                    alt={`${concept.title}の図解`}
                    className="w-full rounded-md"
                  />
                </div>
              )}
              
              {/* 実験や実証例があれば表示 */}
              {concept.examples && (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-detective-primary">実例:</h4>
                  <ul className="list-disc list-inside mt-1 text-sm text-gray-700">
                    {concept.examples.map((example, index) => (
                      <li key={index} className="my-1">{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScienceConcept;
