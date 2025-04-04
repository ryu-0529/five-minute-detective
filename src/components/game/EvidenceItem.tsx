import React from 'react';
import { motion } from 'framer-motion';
import { Evidence } from '../../types/game';

interface EvidenceItemProps {
  evidence: Evidence;
  isCollected: boolean;
  onExamine: () => void;
}

const EvidenceItem: React.FC<EvidenceItemProps> = ({ evidence, isCollected, onExamine }) => {
  // 証拠品が収集されてない場合は「?」表示
  if (!isCollected) {
    return (
      <div 
        className="bg-gray-200 rounded-lg p-3 h-32 flex items-center justify-center cursor-not-allowed opacity-70"
      >
        <span className="text-3xl text-gray-400 font-bold">?</span>
      </div>
    );
  }

  // 証拠品が収集されている場合
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-detective-light rounded-lg p-3 h-32 flex flex-col cursor-pointer"
      onClick={onExamine}
    >
      <h4 className="font-detective text-detective-dark font-bold text-sm mb-1">
        {evidence.name}
      </h4>
      <p className="text-xs text-gray-600 line-clamp-3">{evidence.description}</p>
      
      <div className="mt-auto">
        <span className="text-xs text-detective-primary italic">
          発見場所: {evidence.location}
        </span>
      </div>
    </motion.div>
  );
};

export default EvidenceItem;
