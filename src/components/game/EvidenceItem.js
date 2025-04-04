import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const EvidenceItem = ({ evidence, isCollected, onExamine }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // 証拠品が集められていない場合のスタイル
  if (!isCollected) {
    return (
      <motion.div
        className="bg-gray-200 rounded-lg shadow-md p-4 h-48 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
      >
        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>
    );
  }

  // カードをフリップする処理
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      onExamine && onExamine(evidence);
    }
  };

  return (
    <motion.div
      className="perspective-500 h-48 cursor-pointer"
      whileHover={{ scale: 1.03 }}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* カード表面 */}
        <div
          className="absolute w-full h-full bg-white rounded-lg shadow-md p-4 backface-hidden"
        >
          <h3 className="font-detective text-detective-dark font-bold">{evidence.name}</h3>
          <div className="mt-2 flex items-center justify-center h-24 bg-gray-100 rounded-md overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={`/images/evidence/${evidence.id}.jpg`}
                alt={evidence.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 italic">クリックして詳細を見る</p>
        </div>

        {/* カード裏面 */}
        <div
          className="absolute w-full h-full bg-detective-light rounded-lg shadow-md p-4 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <h3 className="font-detective text-detective-dark font-bold text-sm">{evidence.name}</h3>
          <p className="text-xs mt-1 text-gray-700"><strong>発見場所:</strong> {evidence.location}</p>
          <div className="mt-2 h-24 overflow-y-auto scrollbar-thin">
            <p className="text-sm text-gray-800">{evidence.description}</p>
            <p className="mt-2 text-xs text-detective-primary italic">{evidence.relevance}</p>
          </div>
          <p className="mt-1 text-xs text-gray-500 italic">クリックして戻る</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EvidenceItem;
