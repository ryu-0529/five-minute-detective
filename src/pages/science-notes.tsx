import React from 'react';
import Head from 'next/head';
import { useGame } from '../context/GameContext';

const ScienceNotesPage: React.FC = () => {
  const { player } = useGame();
  
  // ダミーデータ（本来はGameContextから取得）
  const scienceNotes = [
    {
      id: 'note1',
      title: '光の反射と屈折',
      field: '物理学（光学）',
      content: '光は境界面で反射・屈折する。反射角は入射角に等しく、屈折は媒質の屈折率に依存する。',
      unlocked: true,
      episode: '消えた展示物'
    },
    {
      id: 'note2',
      title: '全反射の原理',
      field: '物理学（光学）',
      content: '光が屈折率の高い媒質から低い媒質に臨界角以上で入射すると、全反射が起こる。',
      unlocked: true,
      episode: '消えた展示物'
    },
    {
      id: 'note3',
      title: '細菌と感染経路',
      field: '微生物学',
      content: '細菌の感染経路は主に接触、飛沫、空気感染の3種類がある。',
      unlocked: false,
      episode: '謎の病気'
    }
  ];

  return (
    <>
      <Head>
        <title>科学ノート | 5分探偵：知恵の糸</title>
        <meta name="description" content="5分探偵で学んだ科学知識をまとめた科学ノートページです。" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-detective-primary mb-6">科学ノート</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-4">
            エピソードで学んだ科学的知識をここに記録しています。
            新しいエピソードをクリアすると、さらに多くの科学知識が追加されます。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scienceNotes.map((note) => (
            <div 
              key={note.id} 
              className={`
                rounded-lg shadow-md overflow-hidden
                ${note.unlocked 
                  ? 'bg-white border-t-4 border-detective-primary' 
                  : 'bg-gray-100 border-t-4 border-gray-400 opacity-70'}
              `}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-detective-dark">{note.title}</h2>
                  <span className="bg-detective-secondary text-white text-xs px-2 py-1 rounded">
                    {note.field}
                  </span>
                </div>
                
                {note.unlocked ? (
                  <>
                    <p className="text-gray-700 mb-4">{note.content}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">エピソード: {note.episode}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-500 font-bold">未解除</p>
                    <p className="text-gray-500 text-center text-sm mt-1">
                      エピソード「{note.episode}」をプレイして解除
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScienceNotesPage;
