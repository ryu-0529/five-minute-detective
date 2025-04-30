import { BiasNode, BiasLink } from '../components/visualizations/CognitiveBiasNetwork';

// 認知バイアスノードのデータ
export const biasNodes: BiasNode[] = [
  {
    id: 'confirmation-bias',
    name: '確証バイアス',
    description: '自分の既存の信念や期待に合致する情報を優先的に探し、受け入れる傾向。',
    example: '例：スマートスピーカーが盗聴していると思い込んだ人が、偶然関連広告が表示された事例だけを記憶し、そうでない数百回の事例は無視してしまう。',
    category: 'cognitive',
    discovered: true
  },
  {
    id: 'availability-bias',
    name: '利用可能性ヒューリスティック',
    description: '思い出しやすい情報や経験が、より一般的または重要だと判断してしまう傾向。',
    example: '例：ニュースで飛行機事故を見た後、統計的には自動車より安全であるにも関わらず、飛行機旅行を危険だと考えてしまう。',
    category: 'cognitive',
    discovered: true
  },
  {
    id: 'bandwagon-effect',
    name: 'バンドワゴン効果',
    description: '多くの人が信じていることを自分も信じる傾向。集団同調圧力とも関連。',
    example: '例：SNSで「5G基地局が健康に悪影響」という投稿が多数あると、科学的根拠がなくても信じてしまうこと。',
    category: 'social',
    discovered: true
  },
  {
    id: 'authority-bias',
    name: '権威バイアス',
    description: '権威ある人物や組織からの情報を過度に信頼する傾向。',
    example: '例：医師ではない有名人が健康法を勧めると、その有名性だけで効果を信じてしまうこと。科学的根拠よりも肩書きで判断してしまう。',
    category: 'social',
    discovered: false
  },
  {
    id: 'illusory-correlation',
    name: '錯覚相関',
    description: '関連のない事象間に関係性があると誤って認識する傾向。',
    example: '例：「朝ニンニクを食べた日は試験の点数が良かった」という偶然の一致から、ニンニクと学力向上に関係があると思い込むこと。',
    category: 'cognitive',
    discovered: false
  },
  {
    id: 'backfire-effect',
    name: 'バックファイア効果',
    description: '自分の信念と矛盾する証拠に直面した際に、かえって信念が強化される現象。',
    example: '例：ワクチンが安全だという科学的証拠を示されたワクチン反対派が、かえってワクチンへの不信感を強めてしまうこと。',
    category: 'cognitive',
    discovered: false
  },
  {
    id: 'clustering-illusion',
    name: 'クラスタリング錯覚',
    description: '偶然のパターンに過剰な意味を見出してしまう傾向。',
    example: '例：壁のシミに顔や文字を見出したり、市内の建物の配置が特定の幾何学模様を描いていると考えたりすること。',
    category: 'probabilistic',
    discovered: true
  },
  {
    id: 'anchoring',
    name: 'アンカリング効果',
    description: '最初に得た情報（アンカー）に過度に影響を受け、その後の判断が歪む傾向。',
    example: '例：セール前の高い値札を見た後、割引後の価格が「お得」に感じるが、実際には標準的な価格であること。',
    category: 'cognitive',
    discovered: false
  },
  {
    id: 'memory-reconstruction',
    name: '記憶の再構成',
    description: '記憶は完全な再生ではなく、断片から再構成されるため、バイアスの影響を受けやすい。',
    example: '例：目撃証言が時間とともに変化し、後から得た情報が元の記憶に組み込まれ、元の出来事と違う内容になってしまうこと。',
    category: 'memory',
    discovered: false
  }
];

// バイアス間の関連性データ
export const biasLinks: BiasLink[] = [
  {
    source: 'confirmation-bias',
    target: 'backfire-effect',
    strength: 0.8,
    description: '確証バイアスが強いほど、反証に対するバックファイア効果も強くなる',
    discovered: false
  },
  {
    source: 'confirmation-bias',
    target: 'illusory-correlation',
    strength: 0.7,
    description: '確証バイアスが錯覚相関の形成を促進する',
    discovered: false
  },
  {
    source: 'availability-bias',
    target: 'clustering-illusion',
    strength: 0.6,
    description: '思い出しやすい情報がパターン認識に影響する',
    discovered: true
  },
  {
    source: 'bandwagon-effect',
    target: 'authority-bias',
    strength: 0.5,
    description: '集団の意見と権威の意見が一致すると、さらに強い影響力を持つ',
    discovered: false
  },
  {
    source: 'clustering-illusion',
    target: 'illusory-correlation',
    strength: 0.9,
    description: 'パターンの過剰認識が見せかけの相関関係の認識につながる',
    discovered: true
  },
  {
    source: 'anchoring',
    target: 'confirmation-bias',
    strength: 0.7,
    description: '最初の情報（アンカー）が確証バイアスの方向性を決める',
    discovered: false
  },
  {
    source: 'memory-reconstruction',
    target: 'confirmation-bias',
    strength: 0.6,
    description: '記憶の再構成は既存の信念に合うように歪められる',
    discovered: false
  },
  {
    source: 'availability-bias',
    target: 'authority-bias',
    strength: 0.4,
    description: '権威ある情報源からの情報は思い出しやすく、利用可能性が高まる',
    discovered: false
  }
];

// 陰謀論ミステリー編の各エピソードに関連するバイアス
export const episodeBiases = {
  'スマートスピーカーの陰謀': ['confirmation-bias', 'illusory-correlation', 'availability-bias'],
  'ワクチンマイクロチップ': ['authority-bias', 'backfire-effect', 'bandwagon-effect'],
  '気象操作': ['clustering-illusion', 'confirmation-bias'],
  '5G電波と健康': ['illusory-correlation', 'authority-bias'],
  '秘密結社の暗号': ['clustering-illusion', 'memory-reconstruction', 'anchoring'],
  'AI支配計画': ['confirmation-bias', 'authority-bias', 'bandwagon-effect']
};
