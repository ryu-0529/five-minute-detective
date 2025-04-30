import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IrisRole } from '../../types/game';

interface AirisDialogProps {
  aiTrustLevel: number;
  onAskAiris: (question: string) => Promise<string>;
  currentEpisodeId: number;
  irisRole?: IrisRole;
  showHint?: boolean;
  airisImage?: string; // アイリスのアバター画像へのパス
}

/**
 * アイリスAIとの対話コンポーネント
 * プレイヤーはアイリスに質問してヒントや情報を得ることができる
 * アイリスの回答は表向きは科学的でサポート的だが、信頼度に応じて
 * 微妙に誤誘導する内容が含まれることもある（黒幕としての側面）
 */
const AirisDialog: React.FC<AirisDialogProps> = ({
  aiTrustLevel,
  onAskAiris,
  currentEpisodeId,
  irisRole,
  showHint = true, // デバッグ用に常にヒントを表示するように変更
  airisImage // アイリスのアバター画像
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<{question: string; answer: string}[]>([]);
  
  // DOM参照のためのrefを追加
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  // イベント伝播を防止するためのパッシブイベントリスナーを追加
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      
      // クリックイベントの伝播を防止する関数
      const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
      };
      
      // タッチイベントの伝播を防止する関数
      const handleTouch = (e: TouchEvent) => {
        e.stopPropagation();
      };
      
      // パッシブ化されたリスナーの訂正
      container.addEventListener('click', handleClick, { capture: true });
      container.addEventListener('touchstart', handleTouch, { passive: false, capture: true });
      container.addEventListener('touchend', handleTouch, { passive: false, capture: true });
      container.addEventListener('touchmove', handleTouch, { passive: false, capture: true });
      
      // クリーンアップ関数
      return () => {
        container.removeEventListener('click', handleClick, { capture: true });
        container.removeEventListener('touchstart', handleTouch, { passive: false, capture: true });
        container.removeEventListener('touchend', handleTouch, { passive: false, capture: true });
        container.removeEventListener('touchmove', handleTouch, { passive: false, capture: true });
      };
    }
  }, []);

  // エピソードに応じた質問オプション
  const getQuestionOptions = () => {
    // エピソード1: スマートスピーカーの陰謀
    if (currentEpisodeId === 1) {
      return [
        "スマートスピーカーの技術的な仕組みを教えてください",
        "広告表示のアルゴリズムはどのように機能しますか？",
        "確証バイアスとは何ですか？",
        "容疑者たちの動機を分析してください"
      ];
    }
    // エピソード2: ワクチンマイクロチップ
    else if (currentEpisodeId === 2) {
      return [
        "ナノテクノロジーの現在の限界について教えてください",
        "ワクチンの構成要素は何ですか？",
        "なぜ一部の人々はワクチンを不信感を持つのでしょうか？",
        "医療情報の誤解はどのように広まるのですか？"
      ];
    }
    // エピソード3: 気象操作
    else if (currentEpisodeId === 3) {
      return [
        "飛行機雲（ケムトレイル）の科学的説明を教えてください",
        "気象操作技術は現実的に可能なのでしょうか？",
        "環境活動とミスインフォメーションの関係について",
        "異常気象の本当の原因は何ですか？"
      ];
    }
    // エピソード4: 5G電波と健康
    else if (currentEpisodeId === 4) {
      return [
        "5G通信技術の仕組みとは何ですか？",
        "電磁波と健康影響について科学的に説明してください",
        "ノセボ効果とは何ですか？",
        "この事件の背後にある利害関係を分析してください"
      ];
    }
    // エピソード5: 秘密結社の暗号
    else if (currentEpisodeId === 5) {
      return [
        "パターン認識バイアスについて説明してください",
        "都市の記号や標識にはどのような種類がありますか？",
        "陰謀論はなぜ魅力的に感じられるのですか？",
        "社会実験としての噂の拡散について"
      ];
    }
    // エピソード6: AI支配計画
    else if (currentEpisodeId === 6) {
      return [
        "現代のAI技術にはどのような限界がありますか？",
        "これまでの事件に共通するパターンはありますか？",
        "情報操作の根本的な目的は何でしょうか？",
        "アトラスAIについて収集した情報を整理してください"
      ];
    }
    // デフォルトの質問（万が一のため）
    else {
      return [
        "この事件の科学的背景について教えてください",
        "陰謀論の心理学的要因を分析してください",
        "容疑者たちの動機について考察してください",
        "批判的思考をどのように適用すべきですか？"
      ];
    }
  };

  const questionOptions = getQuestionOptions();

  // アイリスに質問する - イベント伝播問題を修正
  const handleAskAiris = async (question: string) => {
    if (isLoading) return; // すでに読み込み中なら何もしない
    
    try {
      // 先にローディング状態と選択した質問を設定
      setIsLoading(true);
      setSelectedQuestion(question);
      
      // onAskAirisプロップス経由で質問を送信し、応答を取得
      const answer = await onAskAiris(question);
      
      // 応答とconversationHistoryを更新
      setResponse(answer);
      setConversationHistory(prev => [...prev, { question, answer }]);
      
      // ローディング状態を解除
      setIsLoading(false);
    } catch (error) {
      console.error('アイリスからの応答取得に失敗:', error);
      setResponse('申し訳ありません、応答の生成中にエラーが発生しました。');
      setIsLoading(false);
    }
  };

  // ヒントを表示（アイリスの裏の側面が少し見える）
  const renderHint = () => {
    if (!showHint || !irisRole) return null;
    
    return (
      <div className="mt-4 p-3 bg-detective-light/20 rounded-md border border-dashed border-detective-primary/30">
        <p className="text-xs text-gray-500 mb-1">デバッグモード：アイリスの二面性（プレイヤーには見えません）</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h5 className="text-xs font-bold text-detective-dark">表の役割:</h5>
            <p className="text-xs text-gray-700">{irisRole.public}</p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-detective-dark">裏の役割:</h5>
            <p className="text-xs text-gray-700">{irisRole.hidden}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-lg shadow-md p-4 mb-4"
      onClick={(e) => {
        // ダイアログコンテナでのクリックイベントも止める
        e.stopPropagation();
        e.preventDefault();
        
        // ネイティブイベントも止める
        if (e.nativeEvent) {
          e.nativeEvent.stopImmediatePropagation();
        }
        return false;
      }}
      // タッチイベントは伝播だけを止める
      onTouchStart={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-detective-primary/50 flex items-center justify-center bg-detective-light">
          {/* 画像がある場合は表示、ない場合はプレースホルダーを表示 */}
          {airisImage ? (
            <img 
              src={airisImage} 
              alt="アイリス" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-detective-primary/20 flex items-center justify-center">
              <span className="text-detective-primary text-xl font-bold">AI</span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-detective text-lg text-detective-dark font-bold">
            アイリス AI
          </h3>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-detective-primary" 
                style={{ width: `${aiTrustLevel}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">信頼度: {aiTrustLevel}%</span>
          </div>
        </div>
      </div>
      
      {/* 最新の会話を表示 */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="bg-detective-light/30 p-3 rounded-md mb-3">
            <p className="text-sm font-bold text-detective-dark mb-1">あなたの質問:</p>
            <p className="text-sm text-gray-700">{conversationHistory[conversationHistory.length - 1].question}</p>
          </div>
          <div className="bg-detective-primary/10 p-3 rounded-md">
            <p className="text-sm font-bold text-detective-dark mb-1">アイリスの回答:</p>
            <p className="text-sm text-gray-700">{conversationHistory[conversationHistory.length - 1].answer}</p>
          </div>
        </motion.div>
      )}
      
      {/* 質問選択エリア */}
      <div 
        ref={optionsContainerRef}
        className="mb-3"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          
          // ネイティブイベントも止める
          if (e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation();
          }
          return false;
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <label className="block text-sm font-medium text-detective-dark mb-3">
          アイリスに質問する
        </label>
        <div className="grid grid-cols-1 gap-2">
          {questionOptions.map((option, index) => (
            <div 
              key={index}
              className={`p-3 text-left rounded-md border cursor-pointer transition-colors ${
                isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : selectedQuestion === option
                    ? 'border-detective-primary bg-detective-primary/10'
                    : 'border-gray-200 hover:border-detective-primary/50 hover:bg-detective-primary/5'
              }`}
              onClick={(e) => {
                // イベントの伝播を止める
                e.stopPropagation();
                // デフォルト動作も防止
                e.preventDefault();
                
                // ネイティブイベントも止める
                if (e.nativeEvent) {
                  e.nativeEvent.stopImmediatePropagation();
                }
                
                // すでに読み込み中の場合は反応しない
                if (isLoading) return false;
                
                // 質問を選択するだけ（まだ送信はしない）
                setSelectedQuestion(option);
                
                // エピソードページに戻らないようにfalseを返す
                return false;
              }}
            >
              {option}
              {isLoading && selectedQuestion === option && (
                <span className="ml-2 inline-block animate-pulse">...</span>
              )}
            </div>
          ))}
          
          {/* 質問するボタン - 質問が選択されている場合のみ表示 */}
          {selectedQuestion && !isLoading && !response && (
            <button
              className="mt-4 bg-detective-primary hover:bg-detective-secondary text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              onClick={(e) => {
                // イベントの伝播を止める
                e.stopPropagation();
                // デフォルト動作も防止
                e.preventDefault();
                
                // ネイティブイベントも止める
                if (e.nativeEvent) {
                  e.nativeEvent.stopImmediatePropagation();
                }
                
                // 質問を送信
                if (selectedQuestion) {
                  handleAskAiris(selectedQuestion);
                }
                
                return false;
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              質問する
            </button>
          )}
          
          {/* 新しい質問をするボタン - 回答が表示されている場合のみ表示 */}
          {response && !isLoading && (
            <button
              className="mt-4 bg-detective-secondary hover:bg-detective-primary text-white py-2 px-4 rounded-md transition-colors"
              onClick={(e) => {
                // イベントの伝播を止める
                e.stopPropagation();
                // デフォルト動作も防止
                e.preventDefault();
                
                // ネイティブイベントも止める
                if (e.nativeEvent) {
                  e.nativeEvent.stopImmediatePropagation();
                }
                
                // 応答をリセットして新しい質問ができるようにする
                setResponse(null);
                setSelectedQuestion(null);
                
                return false;
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              別の質問をする
            </button>
          )}
        </div>
      </div>
      
      {/* 過去の会話履歴 (最新の1つは上に表示されているので除外) */}
      {conversationHistory.length > 1 && (
        <div className="mt-4">
          <h4 className="text-sm font-bold text-detective-dark mb-2">会話履歴:</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {conversationHistory.slice(0, -1).reverse().map((convo, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-md text-sm">
                <p className="font-bold text-xs text-detective-dark mb-1">あなた: {convo.question}</p>
                <p className="text-xs text-gray-700">アイリス: {convo.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {renderHint()}
    </div>
  );
};

export default AirisDialog;