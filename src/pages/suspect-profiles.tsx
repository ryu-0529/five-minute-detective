import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import CharacterCard from '../components/game/CharacterCard';
import episode3 from '../data/episodes-conspiracy/episode3';
import { Suspect } from '../types/game';

interface SuspectProfilesProps {
  suspects: Suspect[];
}

const SuspectProfiles: React.FC<SuspectProfilesProps> = ({ suspects }) => {
  const [activeQuestionSuspectId, setActiveQuestionSuspectId] = useState<string | null>(null);

  const handleAskQuestions = (suspectId: string) => {
    setActiveQuestionSuspectId(suspectId);
    // ここで質問モーダルを表示したり、別のページに遷移したりする処理を実装
    alert(`${suspectId}への質問モーダルを表示します`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-detective text-detective-dark text-center mb-8">
          容疑者プロフィール
        </h1>
        
        <div className="mb-8">
          <p className="text-center text-gray-600 mb-4">
            各容疑者の情報を確認し、質問することができます。
            左右にスワイプして別の容疑者を表示できます。
          </p>
        </div>

        {/* キャラクターカード */}
        <CharacterCard 
          suspects={suspects} 
          initialIndex={0} 
          onAskQuestions={handleAskQuestions} 
        />

        {/* 操作説明 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>← →ボタンまたはスワイプで容疑者を切り替え</p>
          <p>「質問する」ボタンで対話を開始します</p>
        </div>

        {/* エピソード情報 */}
        <div className="mt-12 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-detective-dark mb-2">
            事件情報: {episode3.title}
          </h2>
          <p className="text-gray-700 mb-4">
            {episode3.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-detective-primary/10 text-detective-primary text-xs px-2 py-1 rounded">
              難易度: {episode3.difficulty}
            </span>
            <span className="bg-detective-primary/10 text-detective-primary text-xs px-2 py-1 rounded">
              分野: {episode3.scienceField}
            </span>
            <span className="bg-detective-primary/10 text-detective-primary text-xs px-2 py-1 rounded">
              制限時間: {Math.floor(episode3.timeLimit / 60)}分
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      suspects: episode3.suspects,
    },
  };
};

export default SuspectProfiles;
