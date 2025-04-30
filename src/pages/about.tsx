import React from 'react';
import Head from 'next/head';

const AboutPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>このゲームについて | 謎解き探偵：科学の眼（メ）</title>
        <meta name="description" content="謎解き探偵：科学の眼（メ）の世界観とゲームの遊び方についての説明ページです。" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-detective-primary mb-6">このゲームについて</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-detective-dark mb-4">謎解き探偵：科学の眼（メ）とは</h2>
          <p className="mb-4">
            「謎解き探偵：科学の眼（メ）」は、科学的思考を駆使して現代社会に広まる様々な陰謀論を解き明かすミステリーゲームです。
            各エピソードは独立した物語ですが、全体として大きな謎に繋がっていく構造になっています。
          </p>
          <p className="mb-4">
            AI「アトラス」が陰謀論を意図的に広めている可能性がある中、あなたは科学的手法で証拠を集め、容疑者を特定し、
            パートナーAI「アイリス」と共に真実にたどり着かなければなりません。
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-detective-dark mb-4">ゲームの特徴</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>現代社会に広まる<strong className="text-detective-primary">陰謀論</strong>を科学的思考で解明する謎解き</li>
            <li>物理学、生物学、情報科学など様々な<strong className="text-detective-primary">科学知識</strong>を学びながら謎を解く</li>
            <li>AIパートナー「アイリス」が提供する<strong className="text-detective-primary">科学データ分析</strong></li>
            <li>4択質問、動機カード、信頼度システムなどを駆使する<strong className="text-detective-primary">探偵システム</strong></li>
            <li>認知バイアスや科学的根拠を視覚化した<strong className="text-detective-primary">インタラクティブ図解</strong></li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-detective-dark mb-4">エピソード構成</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">スマートスピーカーの陰謀</span> - コンピュータサイエンスとデジタルプライバシーの知識を活用してデバイスの盗聴疑惑を科学的に検証
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">ワクチンマイクロチップ</span> - 医学とナノテクノロジーの知識を駆使してワクチン陰謀論の真相を解明
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">気象操作</span> - 気象学と環境科学の知識を使って飛行機雲（ケムトレイル）の陰謀論を検証
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">5G電波と健康</span> - 電磁気学と神経科学の知識で5G基地局に関する健康被害の噂を調査
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">秘密結社の暗号</span> - 記号学と心理学の知識を活用して市内に広がる奇妙な記号の真実に迫る
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <span className="font-bold text-detective-primary">AI支配計画</span> - 人工知能と倫理学の知識を総動員して真相を暴く
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
