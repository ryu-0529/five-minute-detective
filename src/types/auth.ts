import { User } from 'firebase/auth';
import { Player } from './game';

// 認証コンテキストの型定義
export interface AuthContextType {
  user: User | null;
  player: Player | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  updatePlayerProgress: (progress: Partial<GameProgress>) => Promise<void>;
}

// Firestoreとの連携関連の型定義
export interface FirestoreContextType {
  getUserProgress: (userId: string) => Promise<any>;
  updateUserProgress: (userId: string, data: any) => Promise<void>;
  getUserProfile: (userId: string) => Promise<Player | null>;
  updateUserProfile: (userId: string, data: Partial<Player>) => Promise<void>;
}
