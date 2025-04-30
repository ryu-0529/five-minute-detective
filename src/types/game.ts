// 基本的なエピソード情報の型定義
export interface Episode {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  difficulty: string;
  scienceField: string;
  timeLimit: number;
}

// 詳細なエピソードデータの型定義
export interface EpisodeData extends Episode {
  scienceConcepts: ScienceConcept[];
  suspects: Suspect[];
  evidenceItems: Evidence[];
  hints: string[];
  questions: QuestionSet[];
  solution: Solution;
  miniGame: MiniGame;
  // 陰謀論ミステリー編の要素
  relationshipMap?: RelationshipMap;
  backstoryPrediction?: BackstoryPrediction;
  ethicalChoices?: EthicalChoices;
  socialThemes?: SocialTheme[];
}

// 科学概念の型定義
export interface ScienceConcept {
  title: string;
  description: string;
  relevance: string;
  learned?: boolean;
  relatedConspiracy?: string; // 関連する陰謀論
  debunkingPoints?: string[]; // 陰謀論を検証するためのポイント
  field?: string; // 科学分野
  episode?: string; // 関連するエピソード
}

// 容疑者の型定義
export interface Suspect {
  id: string;
  name: string;
  profile: string;
  motive: string;
  alibi: string;
  isGuilty?: boolean;
  trustLevel?: number; // 0-100の信頼度
  motiveCard?: MotiveCardPanel[]; // 動機カードのパネル情報
}

// 動機カードパネルの型定義
export interface MotiveCardPanel {
  id: number;
  content: string;
  revealed: boolean;
}

// 質問セットの型定義
export interface QuestionSet {
  suspectId: string;
  questions: Question[];
}

// 質問の型定義
export interface Question {
  id: string;
  text: string;
  response: string;
  trustImpact: number; // 信頼度への影響値 (-20 ~ +20)
  revealsPanel?: number; // 回答時に明らかになる動機カードのパネルID
  unlocksEvidence?: string[]; // 回答時に解放される証拠ID
}

// 証拠品の型定義
export interface Evidence {
  id: string;
  name: string;
  description: string;
  location: string;
  relevance: string;
  discovered?: boolean;
  locked?: boolean; // 特定の質問や行動で解除される証拠
}

// 解決策の型定義
export interface Solution {
  culprit: string;
  explanation: string;
  scienceExplanation: string;
}

// ミニゲームの型定義
export interface MiniGame {
  type: string;
  description: string;
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
}

// 裏ストーリー予測の型定義
export interface StoryPrediction {
  suspectId: string;
  keywords: string[];
  selectedKeywords: string[];
  correctKeywords: string[];
}

// ゲームの進行状況の型定義
export interface GameProgress {
  completedEpisodes: number[];
  unlockedEpisodes: number[];
  collectedEvidence: string[];
  scienceNotes: string[];
  suspectTrustLevels: Record<string, number>; // 容疑者ごとの信頼度
  aiTrustLevel: number; // アイリスとの信頼関係
  revealedMotivePanels: Record<string, number[]>; // 明らかになった動機カードのパネル
  ethicalChoices: EthicalChoice[]; // 倫理的選択の履歴
  conspiracyAwarenessLevel: number; // 陰謀論意識レベル（0-100）:高いほど陰謀論を疑う
  criticalThinkingScore: number; // 批判的思考スキルスコア（0-100）:高いほど科学的思考が優れている
}

// 倫理的選択の型定義
export interface EthicalChoice {
  episodeId: number;
  choiceType: 'truth' | 'stability'; // 真実公開 or 社会安定
  impact: {
    socialTrust: number; // 社会信頼度への影響
    scienceTrust: number; // 科学信頼度への影響
  }
}

// プレイヤーの型定義
export interface Player {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  level: number;
  score: number;
  socialTrustScore?: number; // 社会信頼度
  scienceTrustScore?: number; // 科学信頼度
  progress?: GameProgress;
}

// ゲームコンテキストの型定義
export interface GameContextType {
  player: Player | null;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  currentEpisode: EpisodeData | null;
  setCurrentEpisode: React.Dispatch<React.SetStateAction<EpisodeData | null>>;
  progress: GameProgress;
  loading: boolean;
  completeEpisode: (episodeId: number, score: number, collectedItems: CollectedItems) => Promise<void>;
  saveProgress: (updatedProgress: Partial<GameProgress>) => Promise<void>;
  updateTrustLevel: (suspectId: string, amount: number) => Promise<void>;
  updateAITrustLevel: (amount: number) => Promise<void>;
  revealMotivePanel: (suspectId: string, panelId: number) => Promise<void>;
  makeEthicalChoice: (episodeId: number, choice: EthicalChoice) => Promise<void>;
  predictBackstory: (suspectId: string, keywords: string[]) => Promise<number>; // 返り値はスコア
  updateConspiracyAwareness: (amount: number) => Promise<void>; // 陰謀論意識レベルの更新
  updateCriticalThinking: (amount: number) => Promise<void>; // 批判的思考スキルの更新
}

// 収集したアイテムの型定義
export interface CollectedItems {
  evidence: string[];
  scienceNotes: string[];
  revealedPanels: {suspectId: string, panelId: number}[];
}

// ゲームステージの型定義
export enum GameStage {
  INTRO = 'intro',
  INVESTIGATION = 'investigation',
  QUESTIONING = 'questioning', // 4択質問ステージ
  EVIDENCE_REVIEW = 'evidence_review',
  SCIENCE_LEARNING = 'science_learning',
  BACKSTORY_PREDICTION = 'backstory_prediction', // 裏ストーリー予測ステージ
  SOLVING = 'solving',
  ETHICAL_CHOICE = 'ethical_choice', // 倫理的選択ステージ
  CONCLUSION = 'conclusion'
}

// 関連性マップのノードとエッジ
export interface RelationshipNode {
  id: string;
  type: 'suspect' | 'evidence' | 'concept' | 'event';
  label: string;
  details?: string;
  discovered: boolean;
}

export interface RelationshipEdge {
  source: string;
  target: string;
  type: 'knows' | 'opposes' | 'related' | 'causes' | 'influences';
  strength: number; // 関連の強さ（0-1）
  discovered: boolean;
}

// 関連性マップ全体の型定義
export interface RelationshipMap {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
}

// 裏ストーリー予測の型定義（陰謀論ミステリー編）
export interface BackstoryPrediction {
  suspectKeywords: Record<string, string[]>;
}

// 倫理的選択の型定義（陰謀論ミステリー編）
export interface EthicalChoices {
  title: string;
  description: string;
  truthOption: {
    text: string;
    impact: {
      socialTrust: number;
      scienceTrust: number;
    }
  };
  stabilityOption: {
    text: string;
    impact: {
      socialTrust: number;
      scienceTrust: number;
    }
  };
}

// 社会風刺テーマの型定義
export interface SocialTheme {
  title: string;
  description: string;
}

// アイリスAIの役割の型定義
export interface IrisRole {
  public: string;  // 表向きの役割
  hidden: string;  // 裏の役割
}

// Next.js用のルーターパラメータ型
export interface EpisodeParams {
  id: string;
}
