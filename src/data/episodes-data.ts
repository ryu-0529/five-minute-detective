import { EpisodeData } from '../types/game';

// エピソードデータ
export const episodes: EpisodeData[] = [
  {
    id: 1,
    title: "消えた展示物",
    subtitle: "光学の謎",
    description: "科学博物館から最新の光学実験装置が消失。監視カメラには何も映っていないが、展示物は確かに消えている。",
    location: "科学博物館",
    difficulty: "初級",
    scienceField: "物理学 - 光学",
    timeLimit: 300, // 5分（秒数）
    
    // 科学的概念説明
    scienceConcepts: [
      {
        title: "光の反射と屈折",
        description: "光が異なる媒質に入ると屈折し、進行方向が変わる現象。スネルの法則によって角度が決まる。",
        relevance: "この原理を使って物体を視覚的に消失させることが可能。"
      },
      {
        title: "全反射",
        description: "光が特定の角度（臨界角）以上で異なる媒質の境界に当たると、全て反射して進まない現象。",
        relevance: "全反射を利用して光の経路を操作できる。"
      },
      {
        title: "不可視スペクトル",
        description: "人間の目で見えない光の波長（紫外線や赤外線など）。",
        relevance: "特殊なカメラや機器でのみ検出可能。"
      }
    ],
    
    // 容疑者情報
    suspects: [
      {
        id: "museum-director",
        name: "館長 鈴木誠一",
        profile: "50代男性。博物館の経営不振に悩んでいる。",
        motive: "高額な保険金を得るため？",
        alibi: "事件当時は理事会に出席していた。複数の証人あり。"
      },
      {
        id: "rival-researcher",
        name: "競合研究者 中村博士",
        profile: "40代女性。光学迷彩の研究で知られる。",
        motive: "研究の独占と競争相手の排除。",
        alibi: "事件当時は博物館内にいたが、監視カメラには何度か映っている。"
      },
      {
        id: "security-guard",
        name: "警備員 田中剛",
        profile: "30代男性。夜勤専門の警備員。",
        motive: "借金があり、金銭的問題を抱えている？",
        alibi: "事件当時は巡回中だが、15分ほど姿が確認できない時間帯がある。"
      },
      {
        id: "cleaning-staff",
        name: "清掃スタッフ 山田花子",
        profile: "20代女性。物理学専攻の大学生のアルバイト。",
        motive: "特になし。",
        alibi: "事件当日は休暇を取っており不在だった。"
      }
    ],
    
    // 証拠アイテム
    evidenceItems: [
      {
        id: "reflective-material",
        name: "特殊反射材",
        description: "展示ケース周辺で発見された微細な反射材の破片。",
        location: "展示ケース付近の床",
        relevance: "光の経路を操作するのに使用された可能性。"
      },
      {
        id: "modified-camera",
        name: "改造されたカメラ",
        description: "通常のカメラに特殊なフィルターが追加されている。",
        location: "警備室の棚",
        relevance: "特定の波長の光だけを検出できるように改造されている。"
      },
      {
        id: "research-notes",
        name: "研究ノート",
        description: "「プロジェクトΩ」と書かれたメモが含まれる中村博士のノート。",
        location: "博物館のスタッフルーム",
        relevance: "光学迷彩技術と展示物の関連性を示唆。"
      },
      {
        id: "unusual-power-consumption",
        name: "異常な電力消費",
        description: "展示室の電力使用量が普段より30%高い記録。",
        location: "施設管理システムの記録",
        relevance: "何らかの装置が稼働していた証拠。"
      },
      {
        id: "special-glasses",
        name: "特殊なメガネ",
        description: "特定の波長の光だけを通すフィルターが付いたメガネ。",
        location: "中村博士のバッグ",
        relevance: "これを使うと通常は見えないものが見える可能性。"
      }
    ],
    
    // 解決のためのヒント
    hints: [
      "光の反射と屈折を利用すると、物体を「見えなく」することができる。",
      "特殊なフィルターや材質を使えば、特定の波長の光だけを通したり反射したりできる。",
      "展示物が「消えた」のではなく、「見えなくなった」と考えると？",
      "電力消費の増加は何かの装置が動いていることを示している。"
    ],
    
    // 正解と説明
    solution: {
      culprit: "rival-researcher", // 犯人のID
      explanation: "中村博士は光学迷彩技術を応用し、展示物の周りに特殊な反射材を設置。光の経路を操作することで展示物が「見えない」状態にした。特殊メガネを使用すると展示物が見える仕組みになっており、通常の監視カメラには映らない。展示物は実際には移動されておらず、光学トリックで隠されていただけ。電力消費の増加は光学装置の動力源からのもの。研究ノートに記された「プロジェクトΩ」の一環として、技術の実証実験を行っていた。",
      scienceExplanation: "この事件では光の反射・屈折・全反射の原理が応用されています。特定の角度と材質を使うことで、光を迂回させて物体の後ろから前に回り込ませることができます。その結果、物体が存在する空間が「透明」に見えるという現象が起こります。現実世界でも光学迷彩技術の研究は進んでおり、メタマテリアルなどを使った実験が行われています。"
    },
    
    // ミニゲームの内容
    miniGame: {
      type: "light-puzzle",
      description: "光の反射と屈折を利用して、レーザー光線を特定のターゲットに導くパズル。鏡や透明な障害物を配置して光の経路を操作する。",
      difficulty: {
        easy: "反射のみを使用する簡単なパズル。",
        medium: "反射と屈折を組み合わせたパズル。",
        hard: "全反射と複数の光源を使った複雑なパズル。"
      }
    }
  },
  // 他のエピソードも同様の構造で定義（省略）
  {
    id: 2,
    title: "謎の病気",
    subtitle: "微生物学の謎",
    description: "科学研究所の従業員たちが謎の症状を発症。感染経路不明の新種の病原体か？",
    location: "バイオテック研究所",
    difficulty: "中級",
    scienceField: "微生物学・疫学",
    timeLimit: 300,
    scienceConcepts: [],  // 省略
    suspects: [],  // 省略
    evidenceItems: [],  // 省略
    hints: [],  // 省略
    solution: {
      culprit: "", 
      explanation: "",
      scienceExplanation: ""
    },
    miniGame: {
      type: "",
      description: "",
      difficulty: {
        easy: "",
        medium: "",
        hard: ""
      }
    }
  }
];

// エピソードIDから特定のエピソードを取得する関数
export const getEpisodeById = (id: number): EpisodeData | undefined => {
  return episodes.find(episode => episode.id === id);
};

// 次のアンロック可能なエピソードを取得
export const getNextEpisode = (completedEpisodes: number[]): EpisodeData | null => {
  const maxCompletedId = Math.max(...completedEpisodes, 0);
  return episodes.find(episode => episode.id === maxCompletedId + 1) || null;
};
