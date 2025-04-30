import React, { useState } from 'react';
import Head from 'next/head';
import { useGame } from '../context/GameContext';
import CognitiveBiasNetwork from '../components/visualizations/CognitiveBiasNetwork';
import { biasNodes, biasLinks, episodeBiases } from '../data/cognitiveBiases';

const ScienceNotesPage: React.FC = () => {
  const { player } = useGame();
  
  // 表示モードの状態管理
  const [viewMode, setViewMode] = useState<'list' | 'network'>('list');
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  
  // 陰謀論ミステリー編の科学ノートデータ
  const scienceNotes = [
    {
      id: 'c-note1',
      title: '確証バイアス',
      field: '認知心理学',
      content: '自分の既存の信念や期待に合致する情報を優先的に探し、受け入れる傾向。自分の考えに反する情報は無視または過小評価されやすい。',
      unlocked: true,
      episode: 'スマートスピーカーの陰謀',
      relatedConspiracy: 'スマートスピーカーが会話を盗聴しているという陰謀論',
      debunkingPoints: [
        '偶然の一致を過大評価していないか確認する',
        '確証事例のみに注目していないか検証する',
        '反証例を積極的に探す'
      ]
    },
    {
      id: 'c-note2',
      title: 'フィルターバブル現象',
      field: '情報科学',
      content: 'アルゴリズムがユーザーの過去の行動や好みに基づいて情報をフィルタリングすることで、多様な視点に触れる機会が減少する現象。',
      unlocked: true,
      episode: 'スマートスピーカーの陰謀',
      relatedConspiracy: '個人向けに操作された情報だけが表示されているという陰謀論',
      debunkingPoints: [
        'アルゴリズムの実際の仕組みを理解する',
        '異なる情報源を意識的に利用する',
        'パーソナライゼーションの設定を確認する'
      ]
    },
    {
      id: 'c-note3',
      title: '音声認識技術の仕組み',
      field: '機械学習',
      content: '音声をデジタル信号に変換し、特徴抽出とパターン認識により言語として解析する技術。常時録音しているわけではなく、特定のキーワード検出時のみクラウドへ送信される。',
      unlocked: true,
      episode: 'スマートスピーカーの陰謀',
      relatedConspiracy: 'スマートスピーカーが常に会話を監視しているという陰謀論',
      debunkingPoints: [
        'デバイスの技術仕様を確認する',
        'ネットワークトラフィックを分析する',
        '開発者の説明と実際の動作を比較する'
      ]
    },
    {
      id: 'c-note4',
      title: 'ナノテクノロジーの\nサイズ制約',
      field: '材料工学',
      content: 'ナノテクノロジーは10億分の1メートルスケールの技術。マイクロチップのサイズには物理的・技術的限界があり、注射針を通過できるほど小型化はできない。',
      unlocked: false,
      episode: 'ワクチンマイクロチップ',
      relatedConspiracy: 'ワクチンにマイクロチップが埋め込まれているという陰謀論',
      debunkingPoints: [
        '現在の技術水準と物理的限界を確認する',
        '実際のマイクロチップのサイズと比較する',
        '必要な電源や通信機能の問題を検討する'
      ]
    },
    {
      id: 'c-note5',
      title: 'ノセボ効果',
      field: '心身医学',
      content: '悪影響があると信じることで実際に生理的・心理的症状が現れる現象。期待や思い込みが身体反応を引き起こす。',
      unlocked: false,
      episode: '5G電波と健康',
      relatedConspiracy: '5G電波が健康被害を引き起こすという陰謀論',
      debunkingPoints: [
        '症状と原因の因果関係を科学的に検証する',
        '二重盲検実験の重要性を理解する',
        '心理的要因が身体に及ぼす影響を認識する'
      ]
    },
    {
      id: 'c-note6',
      title: 'パターン認識バイアス',
      field: '認知心理学',
      content: '偶然の中に意味あるパターンを見出してしまう傾向。人間の脳は意味のないノイズの中にも顔や形を認識しやすい特性がある。',
      unlocked: false,
      episode: '秘密結社の暗号',
      relatedConspiracy: '都市の記号に隠されたメッセージがあるという陰謀論',
      debunkingPoints: [
        '偶然パターンの数学的確率を理解する',
        '意味の過剰付与を避ける',
        '多数の観察サンプルで検証する'
      ]
    },
    {
      id: 'c-note7',
      title: '批判的思考法',
      field: 'メディアリテラシー',
      content: '情報を鵜呑みにせず、証拠に基づいて検証し、多角的に評価する思考プロセス。情報源の信頼性、バイアス、論理的一貫性を分析する。',
      unlocked: true,
      episode: '総合学習',
      relatedConspiracy: '様々な陰謀論に対する検証アプローチ',
      debunkingPoints: [
        '情報源の信頼性を確認する',
        '複数の視点から検証する',
        '感情ではなく証拠に基づいて判断する'
      ]
    },
    {
      id: 'c-note8',
      title: '情報源の信頼性評価',
      field: 'メディアリテラシー',
      content: '情報の信頼性を評価するための基準：専門性、客観性、透明性、ピアレビュー、引用元の確認、出版元の評判等。',
      unlocked: true,
      episode: '総合学習',
      relatedConspiracy: '信頼性の低い情報源による陰謀論の拡散',
      debunkingPoints: [
        '一次資料と二次資料を区別する',
        '専門家の合意レベルを確認する',
        '利益相反の可能性を検討する'
      ]
    }
  ];

  // エピソードリストを取得
  const episodes = Array.from(new Set(scienceNotes.map(note => note.episode)));

  // 選択されたエピソードに関連するバイアスノードとリンクをフィルタリング
  const getFilteredBiasData = () => {
    if (!selectedEpisode) {
      return { nodes: biasNodes, links: biasLinks };
    }
    
    const relevantBiasIds = episodeBiases[selectedEpisode as keyof typeof episodeBiases] || [];
    const filteredNodes = biasNodes.filter(node => 
      relevantBiasIds.includes(node.id) || node.discovered
    );
    
    const filteredNodeIds = filteredNodes.map(node => node.id);
    const filteredLinks = biasLinks.filter(link => 
      (filteredNodeIds.includes(link.source as string) && 
       filteredNodeIds.includes(link.target as string)) ||
      link.discovered
    );
    
    return { nodes: filteredNodes, links: filteredLinks };
  };
  
  const { nodes, links } = getFilteredBiasData();

  return (
    <>
      <Head>
        <title>科学ノート | 謎解き探偵：科学の眼（メ）</title>
        <meta name="description" content="謎解き探偵：科学の眼で学んだ科学知識をまとめた科学ノートページです。" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-detective-primary mb-6">科学ノート</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-4">
            陰謀論を科学的思考で解明するための知識をここに記録しています。
            認知バイアスのネットワークを通じて、思考の罠を理解することができます。
          </p>
          
          {/* 表示モード切り替えタブ */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                viewMode === 'list' 
                  ? 'text-detective-primary border-b-2 border-detective-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setViewMode('list')}
            >
              リスト表示
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                viewMode === 'network' 
                  ? 'text-detective-primary border-b-2 border-detective-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setViewMode('network')}
            >
              ネットワーク表示
            </button>
          </div>
          
          {/* エピソード選択（ネットワーク表示モード時のみ） */}
          {viewMode === 'network' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                エピソードフィルター：
              </label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-detective-primary focus:ring focus:ring-detective-primary focus:ring-opacity-50"
                value={selectedEpisode || ''}
                onChange={(e) => setSelectedEpisode(e.target.value || null)}
              >
                <option value="">すべて表示</option>
                {episodes.map(episode => (
                  <option key={episode} value={episode}>
                    {episode}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* コンテンツ表示エリア */}
        {viewMode === 'list' ? (
          // リスト表示モード
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
                    <h2 className="text-xl font-bold text-detective-dark pr-2 flex-shrink">{note.title}</h2>
                    <span className="bg-detective-secondary text-white text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                      {note.field}
                    </span>
                  </div>
                  
                  {note.unlocked ? (
                    <>
                      <p className="text-gray-700 mb-3">{note.content}</p>
                      
                      {note.relatedConspiracy && (
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-detective-secondary">関連する陰謀論:</h3>
                          <p className="text-gray-600 italic">{note.relatedConspiracy}</p>
                        </div>
                      )}
                      
                      {note.debunkingPoints && note.debunkingPoints.length > 0 && (
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-detective-secondary">検証ポイント:</h3>
                          <ul className="list-disc list-inside text-gray-600">
                            {note.debunkingPoints.map((point, idx) => (
                              <li key={idx} className="text-sm ml-2">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
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
        ) : (
          // ネットワーク表示モード
          <div className="bg-white rounded-lg shadow-md p-4">
            <CognitiveBiasNetwork 
              nodes={nodes} 
              links={links} 
              width={800}
              height={600}
            />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-bold">操作方法:</span> ノードをドラッグして動かすことができます。
                ノードにカーソルを合わせると詳細な説明が表示されます。
                色の薄いノードとリンクは、まだ発見されていないバイアスや関連性を表しています。
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScienceNotesPage;
