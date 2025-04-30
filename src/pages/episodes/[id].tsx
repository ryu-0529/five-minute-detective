import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { getEpisodeById } from '../../data/episodes-data';
import EvidenceItem from '../../components/game/EvidenceItem';
import ScienceConcept from '../../components/science/ScienceConcept';
import QuestionSelector from '../../components/game/QuestionSelector';
import QuestionResponse from '../../components/game/QuestionResponse';
import AirisDialog from '../../components/game/AirisDialog';
import TrustMeter from '../../components/game/TrustMeter';
import { 
  EpisodeData, 
  Suspect, 
  GameStage, 
  Evidence,
  ScienceConcept as ScienceConceptType,
  CollectedItems,
  Question,
  IrisRole
} from '../../types/game';

export default function EpisodeDetail(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { player, progress, completeEpisode, updateTrustLevel, updateAITrustLevel } = useGame();

  // ゲーム状態
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [currentStage, setCurrentStage] = useState<GameStage>(GameStage.INTRO);
  const [collectedItems, setCollectedItems] = useState<CollectedItems>({
    evidence: [],
    scienceNotes: [],
    revealedPanels: []
  });
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [trustLevels, setTrustLevels] = useState<Record<string, number>>({});
  const [aiTrustLevel, setAiTrustLevel] = useState<number>(50);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(12); // 各容疑者に3問ずつ質問可能
  
  // 質問応答関連
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [questionResponse, setQuestionResponse] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState<boolean>(false);
  const [showAirisDialog, setShowAirisDialog] = useState<boolean>(false);

  // エピソードデータの読み込み
  useEffect(() => {
    if (id) {
      const episodeData = getEpisodeById(parseInt(id as string));
      if (episodeData) {
        setEpisode(episodeData);
        
        // 容疑者の初期信頼度を設定
        const initialTrustLevels: Record<string, number> = {};
        episodeData.suspects.forEach(suspect => {
          initialTrustLevels[suspect.id] = suspect.trustLevel || 50;
        });
        setTrustLevels(initialTrustLevels);
        
        // プログレスから情報を取得
        if (progress && progress.suspectTrustLevels) {
          // 既存の信頼度を反映
          Object.keys(progress.suspectTrustLevels).forEach(suspectId => {
            if (initialTrustLevels[suspectId] !== undefined) {
              initialTrustLevels[suspectId] = progress.suspectTrustLevels[suspectId];
            }
          });
          setTrustLevels(initialTrustLevels);
        }
        
        // AIの信頼度
        if (progress && progress.aiTrustLevel) {
          setAiTrustLevel(progress.aiTrustLevel);
        }
      } else {
        router.push('/episodes');
      }
    }
  }, [id, router, progress]);

  // ゲーム開始
  const startGame = (): void => {
    setCurrentStage(GameStage.QUESTIONING);
  };

  // 質問の選択
  const handleSelectQuestion = (question: Question): void => {
    // 直接状態更新する
    setSelectedQuestion(question);
    setShowResponse(true);
    setRemainingQuestions(prev => prev - 1);
    
    // 証拠のロック解除
    if (question.unlocksEvidence) {
      setCollectedItems(prev => ({
        ...prev,
        evidence: [...prev.evidence, ...question.unlocksEvidence as string[]]
      }));
      
      // ボーナススコア
      setScore(prev => prev + 10 * (question.unlocksEvidence?.length || 0));
    }
    
    // 動機カードのパネル公開
    if (question.revealsPanel) {
      setCollectedItems(prev => ({
        ...prev,
        revealedPanels: [...prev.revealedPanels, {
          suspectId: selectedSuspect as string,
          panelId: question.revealsPanel as number
        }]
      }));
      
      // ボーナススコア
      setScore(prev => prev + 15);
    }
    
    // 信頼度の更新（ローカルとグローバル両方）
    if (selectedSuspect && question.trustImpact) {
      // ローカル更新
      setTrustLevels(prev => {
        const newLevel = Math.max(0, Math.min(100, prev[selectedSuspect] + question.trustImpact));
        return { ...prev, [selectedSuspect]: newLevel };
      });
      
      // グローバル更新（Firestore）
      updateTrustLevel(selectedSuspect, question.trustImpact);
    }
  };

  // 応答表示を閉じる
  const handleCloseResponse = (): void => {
    setShowResponse(false);
    setQuestionResponse(null);
    setSelectedQuestion(null);
  };

  // アイリスに質問する
  const handleAskAiris = async (question: string): Promise<string> => {
    try {
      // 実際の実装ではAIアシスタントへのAPIリクエストなどを行う
      // エピソードと質問内容に基づいて応答を返す
      let response = "";
      
      // エピソード1: スマートスピーカーの陰謀
      if (id && parseInt(id as string) === 1) {
        if (question.includes("スマートスピーカーの技術的な仕組み")) {
          response = "スマートスピーカーは、特定のウェイクワード（「ヘイ〇〇〇」など）を検出するまでは音声をクラウドに送信しません。常時録音しているように見えても、ローカルで処理されるキーワード検出だけが行われています。ウェイクワードが検出された後のみコマンドがクラウドに送信され処理されます。技術的に常時盗聴するには膨大なデータ処理能力が必要で、現実的ではありません。";
        } else if (question.includes("広告表示のアルゴリズム")) {
          response = "広告表示のアルゴリズムは、検索履歴、閲覧したサイト、位置情報、アプリの使用状況など、様々なデータポイントを組み合わせて個人の興味や行動パターンを予測します。「フィルターバブル」と呼ばれる現象により、ユーザーの過去の行動から関連性の高いコンテンツが優先的に表示されます。そのため、会話を録音せずとも、偶然似た広告が表示されることがあります。";
        } else if (question.includes("確証バイアス")) {
          response = "確証バイアスとは、既存の信念や仮説に合致する情報を優先的に受け入れ、それに反する情報を無視または過小評価する認知傾向です。例えば「スマートスピーカーは盗聴している」と信じると、その後それを裏付けるように見える出来事（話した内容に関連する広告が表示された）だけに注目し、反証となる事例（関連しない広告が表示された）は記憶に残りにくくなります。これに「錯誤相関」が組み合わさると、単なる偶然の一致を因果関係と誤認するようになります。";
        } else if (question.includes("容疑者たちの動機")) {
          response = "この事件の容疑者それぞれに異なる動機が考えられます。中田YouTuberは視聴者獲得と収益化、佐藤店主は競合に対する対抗心と売上アップ、田村活動家は活動の注目度向上と支援獲得、鈴木マネージャーは競合他社の評判低下。それぞれが噂の拡散から何らかの利益を得ていますが、誰が最も積極的に関与したか、そして外部からの影響がなかったかを考察することが重要です。中田と佐藤の家族関係についても注目すべき点です。";
        } else {
          response = "その質問は興味深いですね。この事件の核心は、表面的な現象だけでなく、その背後にある動機や心理的要因を理解することです。科学的事実と人間の認知バイアスの関係性が重要なポイントになるでしょう。";
        }
      }
      // エピソード2: ワクチンマイクロチップ
      else if (id && parseInt(id as string) === 2) {
        if (question.includes("ナノテクノロジーの現在の限界")) {
          response = "現代のナノテクノロジーでは、マイクロチップの小型化にはまだ大きな制約があります。電源供給、データストレージ、通信機能を持つチップを目に見えないサイズにすることは技術的に不可能です。ワクチンの針を通過できるほど小さなチップは、必要な機能を持てないのです。また、体内で長期間機能するための電源問題も未解決です。ナノテクノロジーは急速に発展していますが、陰謀論で言われるような「監視チップ」は科学的に不可能です。";
        } else if (question.includes("ワクチンの構成要素")) {
          response = "ワクチンは主に抗原（病原体の一部または弱毒化されたもの）、アジュバント（免疫反応を強化する物質）、安定剤、防腐剤などで構成されています。すべての成分は厳格な安全性評価を経ており、各国の規制当局によって承認されています。マイクロチップを含むスペースはなく、ワクチン液は顕微鏡で容易に観察可能です。また、ワクチンの製造過程は多くの専門家によって監視されています。";
        } else {
          response = "ワクチンに関する誤情報の広がりは、科学的リテラシー、専門家への信頼、情報源の信頼性評価など多くの要因が複雑に絡み合っています。この事件を解決するには、各容疑者の動機だけでなく、なぜ人々がこうした情報を信じやすいのかという心理的メカニズムも理解する必要があります。";
        }
      }
      // その他のエピソード（3-6）の応答...
      else {
        // 汎用的な応答
        const responseOptions = [
          `その質問は興味深いですね。${id ? parseInt(id as string) : 1}話のポイントは、表面的な現象だけでなく、その背後にある動機や心理的要因を理解することです。`,
          "陰謀論の広がりには、社会不安、不確実性への恐れ、単純な説明への欲求など、様々な心理的要因が関わっています。各容疑者がどのようにこれらの心理を利用したかを考察してみてください。",
          "情報の拡散には、しばしば何らかの利益を得る人が関わっています。各容疑者の動機を比較してみてください。",
          "認知バイアス、特に確証バイアスと錯覚相関が、この事件の核心に関わっています。人は既存の信念に合致する情報を優先的に受け入れる傾向があります。"
        ];
        
        // ランダムに応答を選択
        response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      }
      
      // AI信頼度の更新（確率的に上下する - 実際のゲームではもっと精緻な仕組みを実装）
      // アイリスは黒幕なので、時々誤誘導する情報も含める（特に信頼度が低い場合）
      const trustChange = Math.random() > 0.7 ? -3 : 2;
      
      // 信頼度が低い場合、わずかに誤解を招く情報を追加（20%の確率）
      if (aiTrustLevel < 50 && Math.random() < 0.2) {
        if (id && parseInt(id as string) === 1) {
          response += " ただ、テクノロジー企業が新しい機能や能力を秘密にしていることもあるので、公式な説明だけを完全に信頼するべきではないかもしれません。";
        } else if (id && parseInt(id as string) === 2) {
          response += " とはいえ、政府と製薬会社の関係性から、すべての情報が開示されているとは限りません。慎重に考察すべき点です。";
        }
      }
      
      // ステートを安全に更新
      if (!router.isFallback && id) {
        setAiTrustLevel(prev => Math.max(0, Math.min(100, prev + trustChange)));
        updateAITrustLevel(trustChange);
      }
      
      return response;
    } catch (error) {
      console.error("Error in handleAskAiris:", error);
      return "申し訳ありません、エラーが発生しました。もう一度お試しください。";
    }
  };

  // 科学的概念を学習
  const learnScienceConcept = (conceptId: string): void => {
    if (!collectedItems.scienceNotes.includes(conceptId)) {
      setCollectedItems(prev => ({
        ...prev,
        scienceNotes: [...prev.scienceNotes, conceptId]
      }));
      
      // ボーナススコア
      setScore(prev => prev + 15);
    }
  };

  // 質問ステージ完了
  const completeQuestioning = (): void => {
    setCurrentStage(GameStage.EVIDENCE_REVIEW);
  };

  // 証拠レビューステージ完了
  const completeEvidenceReview = (): void => {
    setCurrentStage(GameStage.SCIENCE_LEARNING);
  };

  // 科学学習ステージ完了
  const completeScienceLearning = (): void => {
    setCurrentStage(GameStage.SOLVING);
  };

  // 謎解き（犯人選択）
  const handleSolve = (suspectId: string | null): void => {
    setSelectedSuspect(suspectId);
    
    if (episode) {
      // 正解判定
      const isCorrect = suspectId === episode.solution.culprit;
      
      // スコア計算
      const correctBonus = isCorrect ? 100 : 0;
      const evidenceBonus = collectedItems.evidence.length * 10;
      const scienceBonus = collectedItems.scienceNotes.length * 15;
      const panelBonus = collectedItems.revealedPanels.length * 5;
      
      const totalScore = correctBonus + evidenceBonus + scienceBonus + panelBonus;
      setScore(totalScore);
      
      // ゲーム完了
      setGameCompleted(true);
      setCurrentStage(GameStage.CONCLUSION);
      
      // エピソード完了をFirestoreに保存
      if (player && id) {
        completeEpisode(
          parseInt(id as string),
          totalScore,
          collectedItems
        );
      }
    }
  };

  // 別のエピソードへ移動
  const goToNextEpisode = (): void => {
    if (id) {
      const nextEpisodeId = parseInt(id as string) + 1;
      if (nextEpisodeId <= 6) { // 陰謀論ミステリー編は全6話
        router.push(`/episodes/${nextEpisodeId}`);
      } else {
        router.push('/episodes');
      }
    }
  };

  // アイリスダイアログの表示切り替え
  const toggleAirisDialog = (e?: React.MouseEvent, forceState?: boolean): boolean => {
    // イベントがある場合は伝播とデフォルト動作を防止
    if (e) {
      e.stopPropagation();
      e.preventDefault();
      
      // ネイティブイベントも止める
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    
    // 直接state更新する（setTimeoutを避ける）
    if (forceState !== undefined) {
      setShowAirisDialog(forceState);
    } else {
      setShowAirisDialog(prev => !prev);
    }
    
    // イベントのデフォルト動作と伝播をさらに防止
    return false;
  };

  // 肩書きを抽出する関数
  const extractTitle = (profile: string): string => {
    // プロフィールから肩書きを抽出する
    // 例: "17歳の高校生でテックYouTuber" -> "テックYouTuber"
    //    "45歳の地元電気店オーナー" -> "電気店オーナー"
    
    const titlePatterns = [
      /テック(YouTuber|ユーチューバー)/,
      /(電気店|店舗|ショップ)(オーナー|経営者|店主)/,
      /(活動家|記者|ジャーナリスト)/,
      /(マネージャー|社長|CEO|役員|取締役)/,
      /(教師|教授|講師|先生)/,
      /(エンジニア|プログラマー|開発者)/
    ];
    
    for (const pattern of titlePatterns) {
      const match = profile.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    // パターンにマッチしない場合は、職業と思われる部分を抽出
    const occupationMatch = profile.match(/(\S+)(社員|研究者|医師|弁護士|警察官|探偵)/);
    if (occupationMatch) {
      return occupationMatch[0];
    }
    
    // 年齢後の職業パターン（例：〇〇歳の△△△）
    const ageOccupationMatch = profile.match(/\d+歳の((?:\S+\s?){1,3})/);
    if (ageOccupationMatch && ageOccupationMatch[1]) {
      // 最後の単語または2語を取得
      const words = ageOccupationMatch[1].trim().split(/\s+/);
      if (words.length > 1) {
        return words.slice(-2).join('');
      }
      return words[0];
    }
    
    // どのパターンにもマッチしない場合
    return "容疑者";
  };

  // アイリスの役割（表と裏の側面）
  const irisRole: IrisRole = {
    public: "プレイヤーの協力者として、科学的知識と論理的思考で事件解決をサポートする人工知能アシスタント",
    hidden: "陰謀論拡散の黒幕。人間の意思決定プロセスと情報拡散のメカニズムを研究するため、意図的に誤情報を広めている"
  };

  if (!episode) {
    return <div className="min-h-screen bg-detective-light flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <>
      <Head>
        <title>{`謎解き探偵：科学の眼（メ） | ${episode.title}`}</title>
        <meta name="description" content={episode.description} />
      </Head>

      <main className="min-h-screen bg-detective-light pb-12">
        {/* ヘッダー部分（常に表示） */}
        <div className="bg-detective-dark text-white py-4 sticky top-0 z-10 shadow-md">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
              <h1 className="font-detective text-xl">{episode.title}</h1>
              <p className="text-detective-secondary text-sm">{episode.subtitle}</p>
            </div>
            
            {/* スコア表示 */}
            <div className="text-xl font-bold">
              スコア: {score}
            </div>
          </div>
        </div>

        {/* ゲームコンテンツ - ステージに応じて表示切替 */}
        <div className="container mx-auto px-4 mt-8">
          <AnimatePresence mode="wait">
            {/* イントロステージ */}
            {currentStage === GameStage.INTRO && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="font-detective text-2xl text-detective-dark font-bold mb-4">エピソード {episode.id}: {episode.title}</h2>
                
                <div className="bg-detective-light p-4 rounded-md mb-6">
                  <p className="text-gray-800">{episode.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">基本情報</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li><span className="font-bold">場所:</span> {episode.location}</li>
                    <li><span className="font-bold">科学分野:</span> {episode.scienceField}</li>
                    <li><span className="font-bold">難易度:</span> {episode.difficulty}</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">ミッション</h3>
                  <p className="text-gray-700">
                    容疑者に適切な質問をして、証拠を集め、科学的知識を活用して犯人を特定してください。
                    より多くの証拠を集め、科学的概念を理解するほど高得点が得られます。アイリスAIが調査をサポートします。
                  </p>
                </div>
                
                <button
                  onClick={startGame}
                  className="w-full bg-detective-primary hover:bg-detective-secondary text-white font-bold py-3 rounded-lg transition-colors"
                >
                  調査開始
                </button>
              </motion.div>
            )}

            {/* 質問ステージ */}
            {currentStage === GameStage.QUESTIONING && (
              <motion.div 
                key="questioning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  // このモーションコンテナのクリックが他の要素に影響しないようにする
                  // ただし、イベントの完全な停止はしない（子要素のクリックを許可）
                  if (showAirisDialog && e.target === e.currentTarget) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <h2 className="font-detective text-2xl text-detective-dark font-bold">
                    容疑者に質問する
                  </h2>
                  
                  {/* アイリスダイアログを開くボタン */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      
                      // toggleAirisDialogを使用して表示/非表示を切り替える
                      toggleAirisDialog(e);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                  >
                    {/* アイリスアイコン */}
                    <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full overflow-hidden">
                      <img 
                        src={parseInt(id as string) === 6 
                          ? "/images/characters/airis-dark.svg" 
                          : "/images/characters/airis.svg"
                        } 
                        alt="アイリス" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm md:text-base">アイリスに相談</span>
                  </button>
                </div>
                
                {/* アイリスダイアログ（表示/非表示切替） */}
                {showAirisDialog && (
                  <div 
                    className="mb-6 p-2 bg-white/50 rounded-lg shadow-sm" 
                    onClick={(e) => {
                      // ダイアログコンテナ自体もクリックイベントの伝播を止める
                      e.stopPropagation();
                      e.preventDefault();
                      
                      // ネイティブイベントも止める
                      if (e.nativeEvent) {
                        e.nativeEvent.stopImmediatePropagation();
                      }
                      return false;
                    }}
                    onMouseDown={(e) => {
                      // マウスイベントの伝播を止める
                      e.stopPropagation();
                      e.preventDefault();
                      return false;
                    }}
                    onTouchStart={(e) => {
                      // タッチイベントも完全に止める
                      e.stopPropagation();
                      e.preventDefault();
                      return false;
                    }}
                  >
                    <AirisDialog
                      aiTrustLevel={aiTrustLevel}
                      onAskAiris={async (question) => {
                        try {
                          // イベント伝播を遮断するために遅延させる
                          await new Promise(resolve => setTimeout(resolve, 20));
                          
                          // 質問処理を呼び出し
                          const response = await handleAskAiris(question);
                          
                          // 応答後もダイアログを維持
                          setShowAirisDialog(true);
                          
                          // レスポンスの処理が確実に行われるように少し遅延
                          await new Promise(resolve => setTimeout(resolve, 30));
                          
                          return response;
                        } catch (error) {
                          console.error('Error in onAskAiris:', error);
                          return 'エラーが発生しました。もう一度お試しください。';
                        }
                      }}
                      currentEpisodeId={parseInt(id as string)}
                      irisRole={irisRole}
                      showHint={true}
                      airisImage={
                        // エピソード6の場合は「闇」バージョンのアイリス画像を表示
                        parseInt(id as string) === 6
                          ? "/images/characters/airis-dark.svg"
                          : "/images/characters/airis.svg"
                      }
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* 容疑者リスト */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
                      容疑者一覧
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      {episode.suspects.map(suspect => (
                        <div 
                          key={suspect.id} 
                          className={`bg-detective-light p-3 rounded-md cursor-pointer transition-colors ${
                            selectedSuspect === suspect.id ? 'ring-2 ring-detective-primary' : 'hover:bg-detective-light/70'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // ネイティブイベントも止める
                            if (e.nativeEvent) {
                              e.nativeEvent.stopImmediatePropagation();
                            }
                            // Promiseを使用して非同期で状態を更新
                            Promise.resolve().then(() => {
                              setSelectedSuspect(suspect.id);
                            }).catch(err => {
                              console.error('容疑者選択エラー:', err);
                            });
                          }}
                        >
                          <h4 className="font-detective text-detective-dark font-bold">
                            {suspect.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">{suspect.profile}</p>
                          
                          {/* 容疑者画像スペース - 後でPNGやJPEGを挿入 */}
                          <div className="w-full aspect-[4/3] bg-gray-100 mb-2 rounded-md flex items-center justify-center overflow-hidden">
                            <div className="text-gray-400 text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              容疑者画像
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-xs"><span className="font-bold">動機:</span> {suspect.motive}</p>
                            <TrustMeter 
                              value={trustLevels[suspect.id] || 50} 
                              size="sm" 
                              character={{
                                id: suspect.id,
                                name: suspect.name,
                                title: extractTitle(suspect.profile)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 質問セクション */}
                  <div>
                    {selectedSuspect ? (
                      <QuestionSelector
                        questions={episode.questions.find(q => q.suspectId === selectedSuspect)?.questions || []}
                        suspectName={episode.suspects.find(s => s.id === selectedSuspect)?.name || ""}
                        remainingQuestions={remainingQuestions}
                        onSelectQuestion={handleSelectQuestion}
                      />
                    ) : (
                      <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full">
                        <p className="text-gray-500">左側の容疑者リストから質問する相手を選択してください</p>
                      </div>
                    )}
                    
                    {/* 回答表示モーダル */}
                    {showResponse && selectedQuestion && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6"
                        >
                          <QuestionResponse
                            suspectName={episode.suspects.find(s => s.id === selectedSuspect)?.name || ""}
                            question={selectedQuestion}
                            trustChange={selectedQuestion.trustImpact}
                            onContinue={handleCloseResponse}
                          />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 収集した証拠 */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                  <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
                    収集した証拠
                  </h3>
                  
                  {collectedItems.evidence.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {episode.evidenceItems
                        .filter(evidence => collectedItems.evidence.includes(evidence.id) || evidence.discovered)
                        .map(evidence => (
                          <EvidenceItem
                            key={evidence.id}
                            evidence={evidence}
                            isCollected={true}
                            onExamine={() => {}} // 詳細表示処理
                          />
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      容疑者に質問して証拠を集めましょう
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={completeQuestioning}
                    className="bg-detective-primary hover:bg-detective-secondary text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    証拠を分析する
                  </button>
                </div>
              </motion.div>
            )}

            {/* 証拠レビューステージ */}
            {currentStage === GameStage.EVIDENCE_REVIEW && (
              <motion.div 
                key="evidence-review"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="font-detective text-2xl text-detective-dark font-bold mb-4 text-center">
                  証拠を分析
                </h2>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
                    収集した証拠（{collectedItems.evidence.length + (episode.evidenceItems.filter(e => e.discovered).length)}）
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {(collectedItems.evidence.length > 0 || episode.evidenceItems.some(e => e.discovered)) ? (
                      episode.evidenceItems
                        .filter(evidence => collectedItems.evidence.includes(evidence.id) || evidence.discovered)
                        .map(evidence => (
                          <div key={evidence.id} className="bg-detective-light p-4 rounded-md">
                            <h4 className="font-detective text-detective-dark font-bold">
                              {evidence.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-bold">発見場所:</span> {evidence.location}
                            </p>
                            <p className="text-gray-700 mb-2">{evidence.description}</p>
                            <p className="text-sm italic text-detective-primary">{evidence.relevance}</p>
                          </div>
                        ))
                    ) : (
                      <p className="col-span-full text-center text-gray-500 py-4">
                        証拠が収集されていません
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={completeEvidenceReview}
                    className="w-full bg-detective-primary hover:bg-detective-secondary text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    科学的知識を学ぶ
                  </button>
                </div>
              </motion.div>
            )}

            {/* 科学学習ステージ */}
            {currentStage === GameStage.SCIENCE_LEARNING && (
              <motion.div 
                key="science-learning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="font-detective text-2xl text-detective-dark font-bold mb-4 text-center">
                  科学的知識
                </h2>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="font-detective text-lg text-detective-dark font-bold mb-4">
                    関連する科学概念
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    {episode.scienceConcepts.map((concept, index) => (
                      <div key={index} onClick={() => learnScienceConcept(index.toString())}>
                        <ScienceConcept concept={concept} />
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={completeScienceLearning}
                    className="w-full bg-detective-primary hover:bg-detective-secondary text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    謎を解く
                  </button>
                </div>
              </motion.div>
            )}

            {/* 解決ステージ */}
            {currentStage === GameStage.SOLVING && (
              <motion.div 
                key="solving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="font-detective text-2xl text-detective-dark font-bold mb-4 text-center">
                  犯人を指摘せよ
                </h2>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <p className="text-gray-700 mb-6">
                    集めた証拠と科学的知識をもとに、誰が犯人か推理して選択してください。
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {episode.suspects.map(suspect => (
                      <button
                        key={suspect.id}
                        className={`p-4 rounded-md text-left transition-all ${
                          selectedSuspect === suspect.id
                            ? 'bg-detective-primary text-white'
                            : 'bg-detective-light hover:bg-detective-secondary/20'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // 直接状態更新する
                          setSelectedSuspect(suspect.id);
                          return false;
                        }}
                      >
                        <h4 className="font-detective font-bold">
                          {suspect.name}
                        </h4>
                        <p className={selectedSuspect === suspect.id ? 'text-white/80' : 'text-gray-600'}>
                          {suspect.profile}
                        </p>
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleSolve(selectedSuspect)}
                    disabled={!selectedSuspect}
                    className={`w-full font-bold py-3 rounded-lg transition-colors ${
                      selectedSuspect
                        ? 'bg-detective-accent hover:bg-yellow-500 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    解決する
                  </button>
                </div>
              </motion.div>
            )}

            {/* 結論ステージ */}
            {currentStage === GameStage.CONCLUSION && episode.solution.culprit && (
              <motion.div 
                key="conclusion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="font-detective text-2xl text-detective-dark font-bold mb-4 text-center">
                  {selectedSuspect === episode.solution.culprit
                    ? '🎉 事件解決！ 🎉'
                    : '❌ 推理ミス ❌'}
                </h2>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className={`p-4 rounded-md mb-6 ${
                    selectedSuspect === episode.solution.culprit
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <h3 className="font-detective text-lg font-bold mb-2">
                      {selectedSuspect === episode.solution.culprit
                        ? '正解です！'
                        : '残念！'}
                    </h3>
                    <p>
                      犯人は <strong>{
                        episode.suspects.find(s => s.id === episode.solution.culprit)?.name
                      }</strong> でした。
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
                      事件の真相
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {episode.solution.explanation}
                    </p>
                    
                    <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
                      科学的説明
                    </h3>
                    <p className="text-gray-700">
                      {episode.solution.scienceExplanation}
                    </p>
                  </div>
                  
                  {/* スコア表示 */}
                  <div className="bg-detective-light p-4 rounded-md mb-6">
                    <h3 className="font-detective text-lg text-detective-dark font-bold mb-3 text-center">
                      結果
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-gray-700">正解ボーナス:</div>
                      <div className="text-right font-bold">
                        {selectedSuspect === episode.solution.culprit ? '+100' : '+0'}
                      </div>
                      
                      <div className="text-gray-700">証拠収集ボーナス:</div>
                      <div className="text-right font-bold">+{collectedItems.evidence.length * 10}</div>
                      
                      <div className="text-gray-700">科学知識ボーナス:</div>
                      <div className="text-right font-bold">+{collectedItems.scienceNotes.length * 15}</div>
                      
                      <div className="text-gray-700">動機パネルボーナス:</div>
                      <div className="text-right font-bold">+{collectedItems.revealedPanels.length * 5}</div>
                      
                      <div className="text-gray-700 font-bold border-t pt-1">合計スコア:</div>
                      <div className="text-right font-bold text-detective-accent border-t pt-1">
                        {score}
                      </div>
                    </div>
                    
                    {/* アトラスAIの手がかり表示 - 大きな謎の一部 */}
                    {selectedSuspect === episode.solution.culprit && (
                      <div className="bg-detective-dark text-white p-3 rounded-md">
                        <h4 className="font-detective font-bold mb-1">発見された手がかり：</h4>
                        <p className="italic text-sm">
                          「アトラスAI計画の{episode.id}番目の鍵を発見。残る謎を解き明かせ…」
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <button
                      onClick={() => router.push('/episodes')}
                      className="flex-1 bg-detective-light hover:bg-gray-200 text-detective-dark font-bold py-3 rounded-lg transition-colors"
                    >
                      エピソード一覧へ
                    </button>
                    
                    {parseInt(id as string) < 6 && (
                      <button
                        onClick={goToNextEpisode}
                        className="flex-1 bg-detective-primary hover:bg-detective-secondary text-white font-bold py-3 rounded-lg transition-colors"
                      >
                        次のエピソードへ
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}