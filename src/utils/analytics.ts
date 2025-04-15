/**
 * 分析とイベント追跡のための関数
 */

import { getAnalytics, logEvent } from 'firebase/analytics';
import { isClient } from './common';

// 分析イベントの種類
export enum AnalyticsEvent {
  // ユーザーアクション
  SIGN_UP = 'sign_up',
  LOGIN = 'login',
  START_EPISODE = 'start_episode',
  COMPLETE_EPISODE = 'complete_episode',
  COLLECT_EVIDENCE = 'collect_evidence',
  LEARN_SCIENCE = 'learn_science',
  SOLVE_PUZZLE = 'solve_puzzle',
  IDENTIFY_CULPRIT = 'identify_culprit',
  
  // エンゲージメント
  VIEW_EPISODE_LIST = 'view_episode_list',
  VIEW_SCIENCE_NOTES = 'view_science_notes',
  VIEW_EVIDENCE = 'view_evidence',
  
  // パフォーマンス
  EPISODE_COMPLETION_TIME = 'episode_completion_time',
  PUZZLE_COMPLETION_TIME = 'puzzle_completion_time',
  
  // エラー
  ERROR = 'error',
  
  // カスタム
  SHARE = 'share',
  RATE_EPISODE = 'rate_episode',
  UNLOCK_ACHIEVEMENT = 'unlock_achievement'
}

/**
 * イベントを記録する関数
 */
export const trackEvent = (eventName: AnalyticsEvent, eventParams?: Record<string, any>): void => {
  if (!isClient) return;
  
  try {
    // Firebaseの分析ツールの初期化
    const analytics = getAnalytics();
    
    // イベントのログ記録
    logEvent(analytics, eventName, eventParams);
    
    // 開発中はコンソールにも出力
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Event: ${eventName}`, eventParams);
    }
  } catch (error) {
    // エラーの場合は開発環境のみで出力
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Analytics] Failed to track event: ${eventName}`, error);
    }
  }
};

/**
 * エラーを記録する関数
 */
export const trackError = (errorMessage: string, errorDetails?: Record<string, any>): void => {
  trackEvent(AnalyticsEvent.ERROR, {
    error_message: errorMessage,
    ...errorDetails
  });
};

/**
 * エピソード開始を記録する関数
 */
export const trackEpisodeStart = (episodeId: number, episodeTitle: string): void => {
  trackEvent(AnalyticsEvent.START_EPISODE, {
    episode_id: episodeId,
    episode_title: episodeTitle
  });
};

/**
 * エピソード完了を記録する関数
 */
export const trackEpisodeComplete = (
  episodeId: number, 
  episodeTitle: string, 
  completionTimeSeconds: number, 
  score: number
): void => {
  trackEvent(AnalyticsEvent.COMPLETE_EPISODE, {
    episode_id: episodeId,
    episode_title: episodeTitle,
    completion_time_seconds: completionTimeSeconds,
    score: score
  });
};
