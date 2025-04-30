import { EpisodeData } from '../types/game';
import episode1 from './episodes/episode1';
import episode2 from './episodes/episode2';

// エピソードデータ
export const episodes: EpisodeData[] = [
  episode1,
  episode2,
  // 今後のエピソードを追加
  // episode3, // 「気象操作」
  // episode4, // 「5G電波と健康」
  // episode5, // 「秘密結社の暗号」
  // episode6, // 「AI支配計画」（最終話）
];

// エピソードIDから特定のエピソードを取得する関数
export const getEpisodeById = (id: number): EpisodeData | undefined => {
  return episodes.find(episode => episode.id === id);
};

// 次のアンロック可能なエピソードを取得
export const getNextEpisode = (completedEpisodes: number[]): EpisodeData | null => {
  const maxCompletedId = Math.max(...completedEpisodes, 0);
  // 単純に次のIDのエピソードを探す
  const nextEpisode = episodes.find(ep => ep.id === maxCompletedId + 1);
  
  return nextEpisode || null;
};

// エピソードのシリーズ名を取得
export const getEpisodeSeries = (id: number): string => {
  return "陰謀論ミステリー編";
};
