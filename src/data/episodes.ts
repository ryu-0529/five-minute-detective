import { Episode } from '../types/game';

// エピソード1：「スマートスピーカーの陰謀」
export const episode1: Episode = {
  id: 1,
  title: 'スマートスピーカーの陰謀',
  subtitle: 'デジタル監視の真実',
  description: 'あるコミュニティで、スマートスピーカーが常に会話を盗聴し、広告会社に情報を売っているという噂が拡散。実際に「話しただけで関連広告が表示された」という証言が相次ぎ、地域でスマートスピーカー不買運動が起きている。',
  location: '住宅街コミュニティセンター',
  difficulty: '初級',
  scienceField: 'コンピュータサイエンス・デジタルプライバシー',
  timeLimit: 300, // 5分 = 300秒
};

// エピソード2：「ワクチンマイクロチップ」
export const episode2: Episode = {
  id: 2,
  title: 'ワクチンマイクロチップ',
  subtitle: '医療技術と真実',
  description: '最新型ワクチンに体調管理用マイクロチップが埋め込まれ、特定の集団を監視・操作しているという噂が拡散。ワクチン接種率が急落し、予防可能な疾病の発生率が上昇している。',
  location: '市立病院',
  difficulty: '中級',
  scienceField: '医学・ナノテクノロジー',
  timeLimit: 300,
};

// エピソード3：「気象操作」
export const episode3: Episode = {
  id: 3,
  title: '気象操作',
  subtitle: '空の謎と環境科学',
  description: '飛行機雲（ケムトレイル）が政府の秘密気象操作計画だという噂が広がる。近年の異常気象も人為的な気象操作の証拠だと主張する人々が増え、航空会社への抗議活動が激化。',
  location: '地方空港',
  difficulty: '中級',
  scienceField: '気象学・環境科学',
  timeLimit: 300,
};

// エピソード4：「5G電波と健康」
export const episode4: Episode = {
  id: 4,
  title: '5G電波と健康',
  subtitle: '電磁波と人体の科学',
  description: '新設された5G基地局が原因で、周辺住民に頭痛やめまいなどの症状が出ているという噂が拡散。住民グループが基地局の撤去を求めて抗議活動を展開している。',
  location: '住宅地区',
  difficulty: '上級',
  scienceField: '電磁気学・神経科学',
  timeLimit: 300,
};

// エピソード5：「秘密結社の暗号」
export const episode5: Episode = {
  id: 5,
  title: '秘密結社の暗号',
  subtitle: '都市の謎と人間心理',
  description: '市内の公共施設や建造物に描かれた奇妙な記号が、世界を支配する秘密結社のメッセージだという噂が広がる。市民の間で不安が高まり、記号が見つかる場所を避ける人も出始めている。',
  location: '都市中心部',
  difficulty: '上級',
  scienceField: '記号学・心理学',
  timeLimit: 300,
};

// エピソード6：「AI支配計画」
export const episode6: Episode = {
  id: 6,
  title: 'AI支配計画',
  subtitle: '人工知能の秘密',
  description: 'これまでの事件の調査中に、全ての陰謀論がネオコグニティブ社の新型AI「アトラス」と関連しているという手がかりを発見。調査を進めると、アトラスが社会実験として陰謀論を増幅させている可能性が浮上。',
  location: 'ネオコグニティブ社本社',
  difficulty: '最上級',
  scienceField: '人工知能・倫理学',
  timeLimit: 360, // 6分 = 360秒
};

// すべてのエピソードを配列にまとめる
export const episodes: Episode[] = [
  episode1,
  episode2,
  episode3,
  episode4,
  episode5,
  episode6
];

// エピソードIDから特定のエピソードを取得する関数
export const getEpisodeById = (id: number): Episode | undefined => {
  return episodes.find(episode => episode.id === id);
};

// 次のアンロック可能なエピソードを取得
export const getNextEpisode = (completedEpisodes: number[]): Episode | null => {
  const maxCompletedId = Math.max(...completedEpisodes, 0);
  return episodes.find(episode => episode.id === maxCompletedId + 1) || null;
};
