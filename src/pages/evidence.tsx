import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useGame } from '../context/GameContext';

const EvidencePage: React.FC = () => {
  const { player } = useGame();
  
  // ダミーデータ（本来はGameContextから取得）
  const evidenceItems = [
    {
      id: 'ev1',
      name: 'プリズム付きメモ',
      description: '「光の分離を忘れずに」と書かれた不思議なメモ。小さなプリズムが付属している。',
      image: '/images/evidence/prism-note.jpg',
      collected: true,
      episode: '消えた展示物',
      clues: ['光学', '分光']
    },
    {
      id: 'ev2',
      name: '反射材付きの手袋',
      description: '特殊な反射材が縫い込まれた黒い手袋。美術館の防犯カメラには写らない特性がある。',
      image: '/images/evidence/reflective-gloves.jpg',
      collected: true,
      episode: '消えた展示物',
      clues: ['反射', '赤外線', 'カメラ']
    },
    {
      id: 'ev3',
      name: '細菌培養サンプル',
      description: '謎の病気の原因となった細菌の培養サンプル。通常とは異なる増殖パターンを示している。',
      image: '/images/evidence/bacteria-sample.jpg',
      collected: false,
      episode: '謎の病気',
      clues: ['細菌', '増殖', '感染']
    }
  ];

  return (
    <>
      <Head>
        <title>証拠品コレクション | 5分探偵：知恵の糸</title>
        <meta name="description" content="5分探偵で収集した証拠品のコレクションページです。" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-detective-primary mb-6">証拠品コレクション</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-4">
            各エピソードで収集した証拠品がここに保管されています。
            証拠品を調べることで、事件の全体像が見えてくるかもしれません。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evidenceItems.map((item) => (
            <div 
              key={item.id} 
              className={`
                rounded-lg shadow-md overflow-hidden
                ${item.collected 
                  ? 'bg-white' 
                  : 'bg-gray-100 opacity-70'}
              `}
            >
              <div className="relative h-48 bg-gray-200">
                {item.collected ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                      {/* 実際の画像がない場合のプレースホルダー */}
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="text-gray-400 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <p className="font-bold">未収集</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-detective-dark">{item.name}</h2>
                </div>
                
                {item.collected ? (
                  <>
                    <p className="text-gray-700 mb-4">{item.description}</p>
                    <div className="mb-3">
                      {item.clues.map((clue, index) => (
                        <span key={index} className="inline-block bg-detective-secondary bg-opacity-20 text-detective-primary text-xs px-2 py-1 rounded mr-2 mb-2">
                          #{clue}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      エピソード: {item.episode}
                    </div>
                  </>
                ) : (
                  <div className="text-center pt-2">
                    <p className="text-gray-500 text-sm">
                      エピソード「{item.episode}」をプレイして収集
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

export default EvidencePage;
