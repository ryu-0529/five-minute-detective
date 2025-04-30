import React, { useState } from 'react';
import { Evidence } from '../../types/game';

interface ConspiracyVerificationProps {
  evidence: Evidence[];
  onVerificationComplete: (verificationScore: number, evidenceUsed: string[]) => void;
  onCancel: () => void;
}

/**
 * 陰謀論検証コンポーネント
 * 
 * 科学的思考を用いて陰謀論の真偽を検証するメカニクス。
 * プレイヤーが収集した証拠を元に、仮説の妥当性を評価する。
 * 批判的思考スキルを育てることを目的としている。
 */
const ConspiracyVerification: React.FC<ConspiracyVerificationProps> = ({
  evidence,
  onVerificationComplete,
  onCancel
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [hypothesis, setHypothesis] = useState<string>('');
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [alternativeExplanation, setAlternativeExplanation] = useState<string>('');
  const [bias, setBias] = useState<string | null>(null);
  
  // 選択可能なバイアスのリスト
  const biases = [
    { id: 'confirmation', name: '確証バイアス', description: '自分の信念を支持する情報を優先的に集め、反証する情報を無視する傾向' },
    { id: 'correlation', name: '相関関係と因果関係の混同', description: '2つの事象が同時に起こることと、一方が他方の原因であることを混同する' },
    { id: 'pattern', name: 'パターン認識バイアス', description: 'ランダムな事象の中にも意味のあるパターンを見出そうとする傾向' },
    { id: 'authority', name: '権威バイアス', description: '専門家や権威ある人物の意見を過度に信頼する傾向' },
    { id: 'availability', name: '利用可能性ヒューリスティック', description: '思い出しやすい事例や印象的な情報を過大評価する傾向' }
  ];
  
  // 証拠の選択・解除
  const toggleEvidence = (evidenceId: string) => {
    if (selectedEvidence.includes(evidenceId)) {
      setSelectedEvidence(prev => prev.filter(id => id !== evidenceId));
    } else {
      setSelectedEvidence(prev => [...prev, evidenceId]);
    }
  };
  
  // 検証ステップの進行
  const nextStep = () => {
    if (verificationStep < 4) {
      setVerificationStep(prev => prev + 1);
    } else {
      completeVerification();
    }
  };
  
  // 前のステップに戻る
  const prevStep = () => {
    if (verificationStep > 1) {
      setVerificationStep(prev => prev - 1);
    }
  };
  
  // 検証完了処理
  const completeVerification = () => {
    // 検証スコアの計算
    let score = 0;
    
    // 選択した証拠の数に応じたスコア（最大30ポイント）
    score += Math.min(selectedEvidence.length * 10, 30);
    
    // 仮説の詳細さ（文字数）に応じたスコア（最大20ポイント）
    score += Math.min(Math.floor(hypothesis.length / 10), 20);
    
    // 代替説明の有無（20ポイント）
    if (alternativeExplanation.length > 10) {
      score += 20;
    }
    
    // バイアスの認識（30ポイント）
    if (bias) {
      score += 30;
    }
    
    // 最終スコアを0-100の範囲に正規化
    const normalizedScore = Math.min(Math.max(score, 0), 100);
    
    // 検証結果をコールバックで返す
    onVerificationComplete(normalizedScore, selectedEvidence);
  };
  
  // 各ステップの内容をレンダリング
  const renderStepContent = () => {
    switch (verificationStep) {
      case 1: // 証拠の選択
        return (
          <div>
            <h4 className="font-bold text-detective-dark mb-3">
              ステップ1: 関連する証拠を選択
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              陰謀論を検証するために関連する証拠を選択してください。科学的検証には複数の独立した証拠が重要です。
            </p>
            
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {evidence.map(item => (
                <div
                  key={item.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedEvidence.includes(item.id)
                      ? 'bg-detective-primary/10 border-detective-primary'
                      : 'bg-white hover:bg-detective-light/30'
                  }`}
                  onClick={() => toggleEvidence(item.id)}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-sm">{item.name}</h5>
                    <span className="text-xs bg-detective-light px-2 py-1 rounded-full">
                      {item.location}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-right">
              <button
                onClick={nextStep}
                disabled={selectedEvidence.length === 0}
                className={`px-4 py-2 rounded-md font-bold ${
                  selectedEvidence.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-detective-primary text-white hover:bg-detective-secondary'
                }`}
              >
                次へ
              </button>
            </div>
          </div>
        );
        
      case 2: // 仮説の定式化
        return (
          <div>
            <h4 className="font-bold text-detective-dark mb-3">
              ステップ2: 仮説の定式化
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              証拠に基づいて検証可能な仮説を定式化してください。良い仮説は具体的で検証可能なものです。
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-detective-dark mb-2">
                仮説:
              </label>
              <textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                className="w-full border rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-detective-primary/50"
                placeholder="あなたの仮説を記述してください..."
              />
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-md font-bold bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                戻る
              </button>
              <button
                onClick={nextStep}
                disabled={hypothesis.length < 10}
                className={`px-4 py-2 rounded-md font-bold ${
                  hypothesis.length < 10
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-detective-primary text-white hover:bg-detective-secondary'
                }`}
              >
                次へ
              </button>
            </div>
          </div>
        );
        
      case 3: // 代替説明
        return (
          <div>
            <h4 className="font-bold text-detective-dark mb-3">
              ステップ3: 代替説明の検討
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              同じ証拠を説明できる別の可能性も考慮することが重要です。陰謀論以外の説明を考えてみましょう。
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-detective-dark mb-2">
                代替説明:
              </label>
              <textarea
                value={alternativeExplanation}
                onChange={(e) => setAlternativeExplanation(e.target.value)}
                className="w-full border rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-detective-primary/50"
                placeholder="代替の説明を記述してください..."
              />
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-md font-bold bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                戻る
              </button>
              <button
                onClick={nextStep}
                disabled={alternativeExplanation.length < 10}
                className={`px-4 py-2 rounded-md font-bold ${
                  alternativeExplanation.length < 10
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-detective-primary text-white hover:bg-detective-secondary'
                }`}
              >
                次へ
              </button>
            </div>
          </div>
        );
        
      case 4: // バイアスの認識
        return (
          <div>
            <h4 className="font-bold text-detective-dark mb-3">
              ステップ4: 認知バイアスの認識
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              私たちの思考は常に認知バイアスの影響を受けています。この陰謀論に関連する可能性のあるバイアスを選択してください。
            </p>
            
            <div className="space-y-2 mb-4">
              {biases.map(item => (
                <div
                  key={item.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    bias === item.id
                      ? 'bg-detective-primary/10 border-detective-primary'
                      : 'bg-white hover:bg-detective-light/30'
                  }`}
                  onClick={() => setBias(item.id)}
                >
                  <h5 className="font-bold text-sm">{item.name}</h5>
                  <p className="text-xs text-gray-700 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-md font-bold bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                戻る
              </button>
              <button
                onClick={completeVerification}
                className="px-4 py-2 rounded-md font-bold bg-detective-primary text-white hover:bg-detective-secondary"
              >
                検証を完了
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-3">
        陰謀論の科学的検証
      </h3>
      
      {/* 進行状況インジケーター */}
      <div className="flex mb-6">
        {[1, 2, 3, 4].map(step => (
          <div
            key={step}
            className="flex-1 relative"
          >
            <div
              className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm ${
                step === verificationStep
                  ? 'bg-detective-primary text-white'
                  : step < verificationStep
                    ? 'bg-detective-secondary/50 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                  step < verificationStep ? 'bg-detective-secondary/50' : 'bg-gray-200'
                }`}
              />
            )}
            <div className="text-center mt-1 text-xs">
              {step === 1 && '証拠選択'}
              {step === 2 && '仮説'}
              {step === 3 && '代替説明'}
              {step === 4 && 'バイアス'}
            </div>
          </div>
        ))}
      </div>
      
      {/* 各ステップの内容 */}
      {renderStepContent()}
      
      {/* キャンセルボタン */}
      <div className="mt-4 text-center">
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-detective-dark underline"
        >
          検証をキャンセル
        </button>
      </div>
    </div>
  );
};

export default ConspiracyVerification;
