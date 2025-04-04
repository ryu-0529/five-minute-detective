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
  solution: Solution;
  miniGame: MiniGame;
}

// 科学概念の型定義
export interface ScienceConcept {
  title: string;
  description: string;
  relevance: string;
  learned?: boolean;
}

// 容疑者の型定義
export interface Suspect {
  id: string;
  name: string;
  profile: string;
  motive: string;
  alibi: string;
  isGuilty?: boolean;
}

// 証拠品の型定義
export interface Evidence {
  id: string;
  name: string;
  description: string;
  location: string;
  relevance: string;
  discovered?: boolean;
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

// ゲームの進行状況の型定義
export interface GameProgress {
  completedEpisodes: number[];
  unlockedEpisodes: number[];
  collectedEvidence: string[];
  scienceNotes: string[];
}

// プレイヤーの型定義
export interface Player {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  level: number;
  score: number;
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
}

// 収集したアイテムの型定義
export interface CollectedItems {
  evidence: string[];
  scienceNotes: string[];
}

// ゲームステージの型定義
export enum GameStage {
  INTRO = 'intro',
  INVESTIGATION = 'investigation',
  EVIDENCE_REVIEW = 'evidence_review',
  SCIENCE_LEARNING = 'science_learning',
  SOLVING = 'solving',
  CONCLUSION = 'conclusion'
}

// Next.js用のルーターパラメータ型
export interface EpisodeParams {
  id: string;
}
