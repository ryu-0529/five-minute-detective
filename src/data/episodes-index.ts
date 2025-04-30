import { EpisodeData } from '../types/game';
import episode1 from './episodes/episode1';
import episode2 from './episodes/episode2';

// すべてのエピソードデータをインポート
// 「謎解き探偵：科学の眼（メ）」陰謀論ミステリー編のエピソード構成
// episode1: スマートスピーカーの陰謀
// episode2: ワクチンマイクロチップ
// episode3: 気象操作
// episode4: 5G電波と健康
// episode5: 秘密結社の暗号
// episode6: AI支配計画（最終話）

// エピソードデータの配列
export const episodesData: EpisodeData[] = [
  episode1,
  episode2,
  // 他のエピソードを追加する場合はここに追加
  // episode3,
  // episode4,
  // episode5,
  // episode6
];

// エピソードIDから特定のエピソードデータを取得する関数
export const getEpisodeDataById = (id: number): EpisodeData | undefined => {
  return episodesData.find(episode => episode.id === id);
};

// 次のアンロック可能なエピソードデータを取得
export const getNextEpisodeData = (completedEpisodes: number[]): EpisodeData | null => {
  const maxCompletedId = Math.max(...completedEpisodes, 0);
  
  // 単純に次のIDのエピソードを探す
  const nextEpisode = episodesData.find(ep => ep.id === maxCompletedId + 1);
  
  return nextEpisode || null;
};

// エピソードのシリーズを取得
export const getEpisodeSeries = (id: number): string => {
  // すべてのエピソードは陰謀論ミステリー編のものになる
  return "陰謀論ミステリー編";
};
