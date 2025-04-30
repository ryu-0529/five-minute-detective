import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import episode3 from '../data/episodes-conspiracy/episode3';
import { Suspect } from '../types/game';

interface SuspectListProps {
  suspects: Suspect[];
  episodeTitle: string;
  episodeSubtitle: string;
}

const SuspectList: React.FC<SuspectListProps> = ({ suspects, episodeTitle, episodeSubtitle }) => {
  // 肩書きと名前を分離する関数
  const formatNameAndTitle = (name: string): { name: string; title: string } => {
    const match = name.match(/(.+?)(?:\s*\((.+?)\))?$/);
    if (match) {
      return {
        name: match[1],
        title: match[2] || ''
      };
    }
    return { name, title: '' };
  };

  // 警戒レベルに応じた色とラベル
  const getTrustLevelInfo = (level: number) => {
    if (level >= 75) return { color: 'bg-red-500', label: '警戒' };
    if (level >= 50) return { color: 'bg-yellow-500', label: '中立' };
    if (level >= 25) return { color: 'bg-orange-500', label: '警戒' };
    return { color: 'bg-green-500', label: '信頼' };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-detective-dark text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold">謎解き探偵：科学の眼</h1>
            <p className="text-xs text-blue-300">陰謀論ミステリー編</p>
          </div>
        </div>
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* エピソードタイトル */}
      <div className="bg-detective-dark text-white p-4 flex justify-between items-center border-t border-gray-700">
        <div>
          <h2 className="text-xl font-bold">{episodeTitle}</h2>
          <p className="text-blue-300 text-sm">{episodeSubtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">スコア: 0</p>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex p-4 bg-white border-b">
        <div className="flex-1 py-2 border-r">
          <h3 className="text-sm font-bold">容疑者に質問する</h3>
        </div>
        <div className="flex-1 py-2 pl-4">
          <button className="bg-detective-accent text-white px-4 py-2 rounded-md flex items-center justify-center w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            アイリスに相談
          </button>
        </div>
      </div>

      {/* 容疑者一覧 */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-3">容疑者一覧</h3>
        
        <div className="space-y-4">
          {suspects.map((suspect) => {
            const { name, title } = formatNameAndTitle(suspect.name);
            const trustInfo = getTrustLevelInfo(suspect.trustLevel || 0);
            
            return (
              <div key={suspect.id} className="border border-gray-300 rounded-lg p-4 bg-white">
                <h4 className="text-lg font-bold mb-1">{name}</h4>
                <p className="text-sm text-gray-700 mb-3">{suspect.profile}</p>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold mb-1">動機: {suspect.motive}</p>
                  </div>
                  
                  <div className="min-w-[120px]">
                    <div className="flex justify-end items-center">
                      <div className="text-right">
                        <div className="flex items-center justify-end mb-1">
                          <div className={`px-2 py-1 rounded text-xs text-white ${trustInfo.color === 'bg-orange-500' ? 'bg-orange-500' : trustInfo.color === 'bg-yellow-500' ? 'bg-yellow-500' : trustInfo.color}`}>
                            {trustInfo.label}
                          </div>
                          <div className="ml-2">{suspect.trustLevel}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={trustInfo.color}
                        style={{ width: `${suspect.trustLevel}%` }}
                        role="progressbar"
                        aria-valuenow={suspect.trustLevel || 0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`警戒レベル: ${suspect.trustLevel}%`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      suspects: episode3.suspects,
      episodeTitle: episode3.title,
      episodeSubtitle: episode3.subtitle,
    },
  };
};

export default SuspectList;
