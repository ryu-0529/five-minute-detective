import React from 'react';
import Head from 'next/head';

const AboutPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>このゲームについて | 5分探偵：知恵の糸</title>
        <meta name="description" content="5分探偵：知恵の糸の世界観とゲームの遊び方についての説明ページです。" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-detective-primary mb-6">このゲームについて</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-detective-dark mb-4">5分探偵：知恵の糸とは</h2>
          <p className="mb-4">
            「5分探偵：知恵の糸」は、科学の知識を駆使して謎を解き明かす5分間のミステリーゲームです。
            各エピソードは短時間で完結する独立したミステリーですが、すべてのエピソードを通じて大きな陰謀が明らかになっていきます。
          </p>
          <p className="mb-4">
            謎の組織「エニグマ財団」の影がちらつく中、あなたは5分間という限られた時間で証拠を集め、容疑者を特定し、
            科学的推理によって真実にたどり着かなければなりません。
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-detective-dark mb-4">ゲームの特徴</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>各エピソードは<strong className="text-detective-primary">5分間</strong>で完結する謎解き</li>
            <li>物理学、生物学、暗号学など様々な<strong className="text-detective-primary">科学知識</strong>を学びながら謎を解く</li>
            <li>全5話＋最終エピソードの<strong className="text-detective-primary">ストーリーライン</strong></li>
            <li>複数の容疑者、証拠品、科学的手掛かりを分析する<strong className="text-detective-primary">探偵システム</strong></li>
            <li>学んだ科学知識を記録する<strong className="text-detective-primary">科学ノート機能</strong></li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-detective-dark mb-4">エピソード構成</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">消えた展示物</span> - 物理学（光学）の知識を活用して美術館から消えた貴重な展示品の謎を解き明かす
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">謎の病気</span> - 微生物学と疫学の知識を駆使して突如発生した奇病の原因と解決策を見つける
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">暗号化された脅迫</span> - 数学と暗号学の知識を使って脅迫メッセージの暗号を解読する
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">不可能な足跡</span> - 考古学と地質学の知識で説明のつかない古代遺跡の足跡の謎に迫る
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">消えたAI</span> - コンピュータサイエンスの知識を活用して行方不明になった革新的AIの謎を解く
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">最終事件：プロジェクトΩの真実</span> - これまでの全ての知識を総動員してエニグマ財団の陰謀を暴く
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
