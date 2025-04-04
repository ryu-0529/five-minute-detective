import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { getEpisodeById } from '../../data/episodes-data';
import EvidenceItem from '../../components/game/EvidenceItem';
import ScienceConcept from '../../components/science/ScienceConcept';
import { 
  EpisodeData, 
  Suspect, 
  GameStage, 
  Evidence,
  ScienceConcept as ScienceConceptType,
  CollectedItems
} from '../../types/game';

// タイマーフォーマット関数
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function EpisodeDetail(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { player, progress, completeEpisode } = useGame();

  // ゲーム状態
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [currentStage, setCurrentStage] = useState<GameStage>(GameStage.INTRO);
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5分 = 300秒
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [collectedItems, setCollectedItems] = useState<CollectedItems>({
    evidence: [],
    scienceNotes: []
  });
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // エピソードデータの読み込み
  useEffect(() => {
    if (id) {
      const episodeData = getEpisodeById(parseInt(id as string));
      if (episodeData) {
        setEpisode(episodeData);
        setTimeRemaining(episodeData.timeLimit || 300);
      } else {
        router.push('/episodes');
      }
    }
  }, [id, router]);

  // タイマー処理
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      // 時間切れの処理
      setTimerActive(false);
      handleTimeUp();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);

  // ゲーム開始
  const startGame = (): void => {
    setTimerActive(true);
    setCurrentStage(GameStage.INVESTIGATION);
  };

  // 時間切れの処理
  const handleTimeUp = (): void => {
    // 時間切れ時は現在のステージに応じた処理
    if (currentStage === GameStage.INVESTIGATION) {
      // 調査中に時間切れ: 強制的に証拠レビューステージへ
      setCurrentStage(GameStage.EVIDENCE_REVIEW);
    } else if (currentStage === GameStage.EVIDENCE_REVIEW || currentStage === GameStage.SCIENCE_LEARNING) {
      // レビュー中に時間切れ: 解決ステージへ
      setCurrentStage(GameStage.SOLVING);
    } else if (currentStage === GameStage.SOLVING) {
      // 解決中に時間切れ: 強制終了
      handleSolve(null);
    }
  };

  // 証拠品を収集
  const collectEvidence = (evidenceId: string): void => {
    if (!collectedItems.evidence.includes(evidenceId) && episode) {
      const evidence = episode.evidenceItems.find(item => item.id === evidenceId);
      if (evidence) {
        setCollectedItems(prev => ({
          ...prev,
          evidence: [...prev.evidence, evidenceId]
        }));
        
        // ボーナススコア
        setScore(prev => prev + 10);
      }
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

  // 調査ステージ完了
  const completeInvestigation = (): void => {
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
    setTimerActive(false);
    
    if (episode) {
      // 正解判定
      const isCorrect = suspectId === episode.solution.culprit;
      
      // スコア計算
      const timeBonus = Math.max(0, timeRemaining);
      const correctBonus = isCorrect ? 100 : 0;
      const evidenceBonus = collectedItems.evidence.length * 10;
      const scienceBonus = collectedItems.scienceNotes.length * 15;
      
      const totalScore = timeBonus + correctBonus + evidenceBonus + scienceBonus;
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
      if (nextEpisodeId <= 5) {
        router.push(`/episodes/${nextEpisodeId}`);
      } else {
        router.push('/episodes');
      }
    }
  };

  if (!episode) {
    return <div className="min-h-screen bg-detective-light flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <>
      <Head>
        <title>{`5分探偵 | ${episode.title}`}</title>
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
            
            {/* タイマー表示 */}
            <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {formatTime(timeRemaining)}
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
                    <li><span className="font-bold">制限時間:</span> {formatTime(episode.timeLimit)}</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">ミッション</h3>
                  <p className="text-gray-700">
                    制限時間内に証拠を集め、科学的知識を活用して犯人を特定してください。
                    より多くの証拠を集め、科学的概念を理解するほど高得点が得られます。
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

            {/* 調査ステージ */}
            {currentStage === GameStage.INVESTIGATION && (
              <motion.div 
                key="investigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="font-detective text-2xl text-detective-dark font-bold mb-4 text-center">
                  証拠を探せ！
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* 犯行現場の表示 */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
                      現場: {episode.location}
                    </h3>
                    
                    <div className="relative h-64 bg-gray-200 rounded-md overflow-hidden mb-4">
                      {/* インタラクティブな現場図 - 本来は画像マップなどを実装 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500">
                          現場画像をクリックして証拠を探してください
                        </p>
                      </div>
                      
                      {/* 証拠品のホットスポット - 実際はマップ座標で配置 */}
                      {episode.evidenceItems.map((evidence, index) => (
                        <button
                          key={evidence.id}
                          className="absolute w-8 h-8 bg-yellow-400 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                          style={{
                            top: `${20 + (index * 15)}%`,
                            left: `${15 + (index * 18)}%`,
                          }}
                          onClick={() => collectEvidence(evidence.id)}
                        >
                          <span className="sr-only">{evidence.name}</span>
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      現場をクリックして証拠を探してください。見つけた証拠は自動的に収集されます。
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-detective-primary font-bold">
                        {collectedItems.evidence.length}/{episode.evidenceItems.length} アイテム発見
                      </span>
                      
                      <button
                        onClick={completeInvestigation}
                        className="bg-detective-primary hover:bg-detective-secondary text-white px-4 py-2 rounded-md transition-colors"
                      >
                        調査完了
                      </button>
                    </div>
                  </div>
                  
                  {/* 容疑者リスト */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
                      容疑者
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      {episode.suspects.map(suspect => (
                        <div key={suspect.id} className="bg-detective-light p-3 rounded-md">
                          <h4 className="font-detective text-detective-dark font-bold">
                            {suspect.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">{suspect.profile}</p>
                          <p className="text-sm"><span className="font-bold">動機:</span> {suspect.motive}</p>
                          <p className="text-sm"><span className="font-bold">アリバイ:</span> {suspect.alibi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 収集済み証拠 */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h3 className="font-detective text-lg text-detective-dark font-bold mb-2">
                    収集した証拠
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {episode.evidenceItems.map(evidence => (
                      <EvidenceItem
                        key={evidence.id}
                        evidence={evidence}
                        isCollected={collectedItems.evidence.includes(evidence.id)}
                        onExamine={() => {}} // 詳細表示処理
                      />
                    ))}
                  </div>
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
                    収集した証拠（{collectedItems.evidence.length}/{episode.evidenceItems.length}）
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {collectedItems.evidence.length > 0 ? (
                      episode.evidenceItems
                        .filter(evidence => collectedItems.evidence.includes(evidence.id))
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
                        onClick={() => setSelectedSuspect(suspect.id)}
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
                      
                      <div className="text-gray-700">残り時間ボーナス:</div>
                      <div className="text-right font-bold">+{Math.max(0, timeRemaining)}</div>
                      
                      <div className="text-gray-700">証拠収集ボーナス:</div>
                      <div className="text-right font-bold">+{collectedItems.evidence.length * 10}</div>
                      
                      <div className="text-gray-700">科学知識ボーナス:</div>
                      <div className="text-right font-bold">+{collectedItems.scienceNotes.length * 15}</div>
                      
                      <div className="text-gray-700 font-bold border-t pt-1">合計スコア:</div>
                      <div className="text-right font-bold text-detective-accent border-t pt-1">
                        {score}
                      </div>
                    </div>
                    
                    {/* プロジェクトΩの手がかり表示 - 大きな謎の一部 */}
                    {selectedSuspect === episode.solution.culprit && (
                      <div className="bg-detective-dark text-white p-3 rounded-md">
                        <h4 className="font-detective font-bold mb-1">発見された手がかり：</h4>
                        <p className="italic text-sm">
                          「プロジェクトΩの{episode.id}番目の鍵を発見。残る謎を解き明かせ…」
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
                    
                    {parseInt(id as string) < 5 && (
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
